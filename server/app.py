import database.queries as queries
from database.connection import create_connection
from flask import Flask, request, jsonify
import sys
import yaml

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
vaildResources = {
    "AddAndEdit": ["product", "location", "productmovement"],
    "View": ["products", "locations", "productmovements"]
}


def requestValidation(tablename, method, body, item):
    global vaildationError

    requiredFieldsByTableName = {
        'product': ['name', 'warehouse', 'qty'],
        'location': ['city'],
        'productmovement': ['movement_timestamp', 'qty']
    }

    requestBodyFields = list(body.keys())

    # Empty Required Fields.
    if len(list(body.keys())) <= 0:
        vaildationError = jsonify(
            {'error': "There are missing requird fields!"})
    else:
        emptyFields = []
        for f in list(requiredFieldsByTableName[tablename]):
            notExistOrEmpty = f not in requestBodyFields or not bool(
                body[f].strip())
            existAndEmpty = f in requestBodyFields and not bool(
                body[f].strip())

            if (notExistOrEmpty and method == "POST") or (existAndEmpty and method == "PUT"):
                emptyFields.append(f)

        if len(emptyFields) > 0:
            vaildationError = jsonify(
                {'error': "The (" + ','.join(list(emptyFields)) + ") field/s can't be empty!"})

    # Source and Destination check.
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

        to_locationInDataBase = item['to_location']
        from_locationInDataBase = item['from_location']

        if method == "POST" and (to_locationNotExistOrEmpty and from_locationNotExistOrEmpty):
            vaildationError = jsonify(
                {"error": "You have to include source location or destination location at least!"})
        elif method == "PUT":

            from_location_removing_with_no_to_locationInDataBase = (
                not to_locationInDataBase) and to_locationNotExistOrEmpty and from_locationExistAndEmpty

            to_location_removing_with_no_from_locationInDataBase = (
                not from_locationInDataBase) and from_locationNotExistOrEmpty and to_locationExistAndEmpty

            removing_both = to_locationExistAndEmpty and from_locationExistAndEmpty

            if from_location_removing_with_no_to_locationInDataBase or to_location_removing_with_no_from_locationInDataBase or removing_both:
                vaildationError = jsonify(
                    {"error": "Bad updating which will remove both of source and destination locations of the movement"})
    
    return vaildationError

# Routing


@ app.route("/api/<string:resource>", methods=["GET", "POST"], defaults={'id': None})
@ app.route("/api/<string:resource>/<string:id>", methods=["GET", "PUT"])
def routing(resource, id):
    resource = resource.strip()
    if request.method in acceptedRequestMethods:
        if resource in vaildResources['View'] and request.method == "GET":
            items = queries.getAllItems(resource[: -1], connection)
            if items and len(items) > 0:
                return jsonify({"data": items})
            else:
                return jsonify({"error": "There is no stored data"})

        elif resource in vaildResources['AddAndEdit'] and request.method == "POST" and id == None:
            items = queries.getAllItems(resource, connection)
            vaildationError = requestValidation(resource, 'POST', request.json)
            if vaildationError:
                return vaildationError
            else:
                return queries.addNewItem(resource, request.json, len(items)+1, connection)

        elif resource in vaildResources["AddAndEdit"] and request.method != "POST":
            if id:
                item = queries.getItemById(resource, id, connection)
                if item:
                    if request.method == "PUT":
                        vaildationError = requestValidation(
                            resource, 'PUT', request.json, item)
                        if vaildationError:
                            return vaildationError
                        else:
                            return queries.updateItem(resource, request.json, id, connection)
                    else:
                        return jsonify({"data": item})
                else:
                    return jsonify({'error': "No " + resource + " related with the requested id: " + id})
            else:
                return jsonify({'error': "ID parameter are missing !!"}), 404

        else:
            return jsonify({'error': 'Invaild Endpoint'}), 404
    else:
        return jsonify({'error': 'Unexpected HTTP Method'}), 502


if __name__ == "__main__":
    app.run(debug=True)
