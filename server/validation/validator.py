import database.queries as queries
from flask import jsonify
import pandas as pd
import datetime
import sys

# import custom functions
sys.path.append("/server")


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
                notExistOrEmpty = f not in requestBodyFields or not bool(
                    str(body[f]))
                existAndEmpty = f in requestBodyFields and not bool(
                    str(body[f]))

                if (notExistOrEmpty and method == "POST") or (existAndEmpty and method == "PUT"):
                    emptyFields.append(f)

            if len(emptyFields) > 0:
                vaildationError = jsonify(
                    {'error': "The (" + ', '.join(list(emptyFields)).rstrip() + ") field/s can't be empty!"})

            # Check Format.
            else:
                inValidFormat = []

                # print(isinstance(datetime.date(body['movement_timestamp']), datetime.date))

                for rbf in requestBodyFields:
                    if rbf == 'movement_timestamp' and not isinstance(datetime.datetime(body['movement_timestamp']), datetime.date):
                        inValidFormat.append('movement_timestamp')

                    elif rbf == 'qty' and not isinstance(body['qty'], int):
                        inValidFormat.append('qty')

                    elif not isinstance(body[rbf], str):
                        inValidFormat.append(rbf)

                if len(inValidFormat) > 0:
                    vaildationError = jsonify(
                        {"error": "Invalid format for (" + ', '.join(list(inValidFormat)).rstrip() + ") field/s !!"})

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

                                    to_locationExistAndNotEmpty_andEqualTo_from_locationInDataBase = 'from_location' not in requestBodyFields and to_locationExistAndNotEmpty and (
                                        body['to_location'] == item['from_location'])
                                    from_locationExistAndNotEmpty_andEqualTo_to_locationInDataBase = 'to_location' not in requestBodyFields and from_locationExistAndNotEmpty and (
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


def dataValidation(body, method, report, connection):
    dataValidationError = ''
    if body:
        requestBodyFields = list(body.keys())
        for rbf in requestBodyFields:
            if (rbf == 'city' and method == "PUT") or rbf == 'to_location' or rbf == 'from_location':
                locations = queries.getAllItems('location', connection)
                validLocation = [
                    loc for loc in locations if not bool(str(body[rbf].strip())) or body[rbf] == loc['city']]

                if not validLocation:
                    return jsonify(
                        {"error": "Invalid location (" + body[rbf] + "). See the valid locations through the (Browsing locations) link !!"})

            elif rbf == 'qty':
                from_location_exist_and_not_empty = 'from_location' in requestBodyFields and bool(
                    str(body['from_location']))
                product_id_exist_and_not_empty = 'product_id' in requestBodyFields and bool(
                    str(body['product_id']))

                if product_id_exist_and_not_empty:
                    product = queries.getItemById(
                        'product', body['product_id'], connection)

                    if product and from_location_exist_and_not_empty:
                        warehouse = body['from_location']
                        product_name = product['name']
                        product_qty = 0

                        relatedReportRow = [
                            row for row in report if row['product'] == product_name and row['warehouse'] == warehouse]

                        if relatedReportRow and len(relatedReportRow) > 0 and relatedReportRow[0]['qty']:
                            product_qty = relatedReportRow[0]['qty']

                        if int(product_qty) < int(body['qty']):
                            return jsonify({"error": " The quantity for the product (" + product_name + ") in the (" + warehouse +
                                            ") location which (" + str(product_qty) +
                                            ") is less than the exporting quantity (" +
                                            body['qty'] +
                                            ") !!"})

    return dataValidationError
