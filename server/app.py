import database.queries as queries
from database.connection import create_connection
from flask import Flask, request, jsonify
import sys
import yaml
import pandas as pd
import datetime

# import custom functions
sys.path.append("/server/database")

# Flask App initlization
app = Flask(__name__)

# load database configuration params
db = yaml.full_load(open('db.yaml'))

# Create Connection
connection = create_connection(
    db['mysql_host'], db['mysql_user'], db['mysql_password'], db['mysql_database'])

# Vars declartion
acceptedRequestMethods = ["GET", "POST", "PUT"]
vaildResources = ["product", "location", "productmovement"]

# Request Validation


def requestValidation(tablename, method, body, item):
    vaildationError = {}

    requiredFieldsByTableName = {
        'product': ['name'],
        'location': ['city'],
        'productmovement': ['product_id', 'movement_timestamp', 'qty']
    }

    optionalFieldsByTableName = {
        'productmovement': ['to_location', 'from_location']
    }

    if body:
        requestBodyFields = list(body.keys())

        # Check body fields
        if tablename in optionalFieldsByTableName.keys():
            validRequestBodyKeys = requiredFieldsByTableName[tablename] + \
                optionalFieldsByTableName[tablename]
        else:
            validRequestBodyKeys = requiredFieldsByTableName[tablename]

        diff = [rbf for rbf in requestBodyFields if rbf not in validRequestBodyKeys]

        if diff:
            vaildationError = jsonify(
                {"error": "The send request contains invalid fields which are (" + ','.join(list(diff)) + ').'})

        # Check Empty.
        else:
            emptyFields = []
            for f in list(requiredFieldsByTableName[tablename]):
                if isinstance(body[f], str):
                    body[f] = body[f].strip()

                notExistOrEmpty = f not in requestBodyFields or not bool(
                    body[f])
                existAndEmpty = f in requestBodyFields and not bool(body[f])

                if (notExistOrEmpty and method == "POST") or (existAndEmpty and method == "PUT"):
                    emptyFields.append(f)

            if len(emptyFields) > 0:
                vaildationError = jsonify(
                    {'error': "The (" + ', '.join(list(emptyFields)).rstrip() + ") field/s can't be empty!"})

            # Check Format.
            else:
                inValidFormat = []

                # print(isinstance(datetime.date(body['movement_timestamp']), datetime.date))

                # for rbf in requestBodyFields:
                #     if rbf == 'movement_timestamp' and not isinstance(datetime.datetime(body['movement_timestamp']), datetime.date):
                #         inValidFormat.append('movement_timestamp')

                #     elif rbf == 'qty' and not isinstance(body['qty'], int):
                #         inValidFormat.append('qty')

                #     elif not isinstance(body[rbf], str):
                #         inValidFormat.append(rbf)

                if len(inValidFormat) > 0:
                    vaildationError = jsonify(
                        {"error": "Invalid format for (" + ', '.join(list(inValidFormat)).rstrip() + ") field/s !!"})

                # Check Source and Destination fields rules
                else:
                    if tablename == "productmovement":

                        # Post rules
                        to_locationNotExistOrEmpty = 'to_location' not in requestBodyFields or not bool(
                            body['to_location'].strip())
                        from_locationNotExistOrEmpty = 'from_location' not in requestBodyFields or not bool(
                            body['from_location'].strip())

                        # Put rules
                        to_locationExistAndEmpty = 'to_location' in requestBodyFields and not bool(
                            body['to_location'].strip())
                        from_locationExistAndEmpty = 'from_location' in requestBodyFields and not bool(
                            body['from_location'].strip())

                        # Both
                        to_locationExistAndNotEmpty = 'to_location' in requestBodyFields and bool(
                            body['to_location'].strip())
                        from_locationExistAndNotEmpty = 'from_location' in requestBodyFields and bool(
                            body['from_location'].strip())

                        if to_locationExistAndNotEmpty and from_locationExistAndNotEmpty and (body['to_location'].strip() == body['from_location'].strip()):
                            vaildationError = jsonify(
                                {"error": "The source and destination locations can't be have the same value !"})

                        elif method == "POST":
                            if to_locationNotExistOrEmpty and from_locationNotExistOrEmpty:
                                vaildationError = jsonify(
                                    {"error": "You have to enter at least one of source and destination locations !"})

                        elif method == "PUT":
                            # No Changes case

                            temp = dict(body)
                            if 'movement_timestamp' in requestBodyFields:
                                temp['movement_timestamp'] = pd.to_datetime(
                                    temp['movement_timestamp'], infer_datetime_format=True)
                                item['movement_timestamp'] = pd.to_datetime(
                                    item['movement_timestamp'], infer_datetime_format=True)

                            equal = len(
                                [rbf for rbf in requestBodyFields if temp[rbf] != item[rbf]]) <= 0

                            if equal:
                                vaildationError = jsonify(
                                    {"error": "No changes made !"})

                            # New Changes (Removing case)
                            else:

                                to_locationInDataBase = item['to_location']
                                from_locationInDataBase = item['from_location']

                                from_location_removing_with_no_to_locationInDataBase = (
                                    not to_locationInDataBase) and to_locationNotExistOrEmpty and from_locationExistAndEmpty

                                to_location_removing_with_no_from_locationInDataBase = (
                                    not from_locationInDataBase) and from_locationNotExistOrEmpty and to_locationExistAndEmpty

                                removing_both = to_locationExistAndEmpty and from_locationExistAndEmpty

                                if from_location_removing_with_no_to_locationInDataBase or to_location_removing_with_no_from_locationInDataBase or removing_both:
                                    vaildationError = jsonify(
                                        {"error": "Not allowed update since it will remove both source and destination locations !"})

                                # New Changes (Similarity case)
                                else:
                                    to_locationExistAndNotEmpty_andEqualTo_from_locationInDataBase = to_locationExistAndNotEmpty and (
                                        body['to_location'] == item['from_location'])
                                    from_locationExistAndNotEmpty_andEqualTo_to_locationInDataBase = from_locationExistAndNotEmpty and (
                                        body['from_location'] == item['to_location'])

                                    if to_locationExistAndNotEmpty_andEqualTo_from_locationInDataBase or from_locationExistAndNotEmpty_andEqualTo_to_locationInDataBase:
                                        vaildationError = jsonify(
                                            {"error": "Not allowed update since it will make both source and destination locations have the same value !"})

    else:
        if method == "PUT":
            vaildationError = jsonify({"error": "No changes made !"})
        elif method == "POST":
            vaildationError = jsonify({"error": "Missing request body !"})

    return vaildationError


# Routing
@ app.route("/api/<string:resource>", methods=["GET", "POST"], defaults={'id': None})
@ app.route("/api/<string:resource>/<string:id>", methods=["GET", "PUT"])
def routing(resource, id):
    resource = resource.strip()
    if request.method in acceptedRequestMethods:
        if resource in vaildResources:
            if not id:
                items = queries.getAllItems(resource, connection)
                if request.method == "GET":
                    if items and len(items) > 0:
                        return jsonify({"data": items})
                    else:
                        return jsonify({"error": "There is no stored data"})

                elif request.method == "POST":
                    vaildationError = requestValidation(
                        resource, 'POST', request.json, None)
                    if vaildationError:
                        return vaildationError
                    else:
                        return queries.addNewItem(resource, request.json, len(items)+1, connection)

                else:
                    return jsonify({"error": "The " + request.method + " not allowed for the requested URL !"}), 405
            else:
                item = queries.getItemById(resource, id, connection)
                if item:
                    if request.method == "GET":
                        return jsonify({"data": item})

                    elif request.method == "PUT":
                        vaildationError = requestValidation(
                            resource, 'PUT', request.json, item)
                        if vaildationError:
                            return vaildationError
                        else:
                            return queries.updateItem(resource, request.json, id, connection)
                    else:
                        return jsonify({"error": "The " + request.method + " not allowed for the requested URL !"}), 405

                else:
                    return jsonify({'error': "No " + resource + " related with the passed id: " + id})
        else:
            return jsonify({'error': 'Invaild Endpoint'}), 404
    else:
        return jsonify({'error': 'Unexpected HTTP Method'}), 502


if __name__ == "__main__":
    app.run(debug=True)
