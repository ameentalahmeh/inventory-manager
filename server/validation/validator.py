import database.queries as queries
from flask import jsonify
import pandas as pd
import datetime
import sys
from dateutil.parser import parse

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
                    str(body[f]).strip())
                existAndEmpty = f in requestBodyFields and not bool(
                    str(body[f]).strip())

                if (notExistOrEmpty and method == "POST") or (existAndEmpty and method == "PUT"):
                    emptyFields.append(f)

            if len(emptyFields) > 0:
                vaildationError = jsonify(
                    {'error': "The (" + ', '.join(list(emptyFields)).rstrip() + ") field/s can't be empty!"})

            # Check Format.
            else:
                inValidFormat = []
                for rbf in requestBodyFields:
                    if rbf == 'movement_timestamp':
                        try:
                            parse(body[rbf])
                        except:
                            inValidFormat.append('movement_timestamp')

                    elif rbf == 'qty':
                        if(type(body[rbf]) != int):
                            inValidFormat.append('qty')
                        elif body[rbf] <= 0:
                            vaildationError = jsonify(
                                {"error": "Movement quantity must be more than zero !"})

                    else:
                        if(type(body[rbf]) != str):
                            inValidFormat.append(rbf)

                if len(inValidFormat) > 0:
                    vaildationError = jsonify(
                        {"error": "Invalid format for (" + ', '.join(list(inValidFormat)).rstrip() + ") field/s !!"})

                else:

                    if method == 'PUT' and tablename != 'productmovement':
                        equal = len(
                            [rbf for rbf in requestBodyFields if body[rbf] != item[rbf]]) <= 0

                        if equal:
                            vaildationError = jsonify(
                                {"error": "No changes made !"})

                    # New Changes (Removing case)
                    else:
                        if tablename == 'productmovement':
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

                            if 'movement_timestamp' in requestBodyFields:
                                body['movement_timestamp'] = pd.to_datetime(
                                    body['movement_timestamp'], infer_datetime_format=True)
                                body['movement_timestamp'] = body['movement_timestamp'].to_pydatetime(
                                )

                            if to_locationExistAndNotEmpty and from_locationExistAndNotEmpty and (body['to_location'].strip() == body['from_location'].strip()):
                                vaildationError = jsonify(
                                    {"error": "The source and destination locations can't be have the same value !"})

                            elif method == "POST":
                                if to_locationNotExistOrEmpty and from_locationNotExistOrEmpty:
                                    vaildationError = jsonify(
                                        {"error": "You have to enter at least one of source and destination locations !"})

                            elif method == "PUT":

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


def dataValidation(body, method, report, item, connection):
    dataValidationError = ''
    if body:
        requestBodyFields = list(body.keys())
        invalid_locations = []
        for rbf in ['to_location', 'from_location']:
            if rbf in requestBodyFields:
                locations = queries.getAllItems('location', connection)

                validLocation = [loc for loc in locations if not bool(
                    str(body[rbf].strip())) or body[rbf] == loc['city']]

                if not validLocation:
                    invalid_locations.append(body[rbf])

        if len(invalid_locations) > 0:
            return jsonify({"error": "Invalid location/s (" + ','.join(list(
                invalid_locations)) + "). See the valid locations through the (Browsing locations) link !!"})

        else:
            if 'movement_timestamp' in requestBodyFields:
                movement_date = pd.to_datetime(
                    body['movement_timestamp'], infer_datetime_format=True)
                today = pd.to_datetime("today")

                if today > movement_date:
                    return jsonify(
                        {"error": "Movement date must be later than today !"})

        if 'qty' in requestBodyFields:

            Warehouse_is_destination = False

            # Get Location
            if 'from_location' in requestBodyFields:
                location_exist_and_not_empty = bool(
                    str(body['from_location']).strip())
                warehouse = str(body['from_location'])
            elif item and 'from_location' in item.keys() and item['from_location'] != None:
                location_exist_and_not_empty = bool(
                    str(item['from_location']).strip())
                warehouse = str(item['from_location'])
            elif 'to_location' in requestBodyFields:
                location_exist_and_not_empty = bool(
                    str(body['to_location']).strip())
                warehouse = str(body['to_location'])
                Warehouse_is_destination = True
            elif item and 'to_location' in item.keys() and item['to_location'] != None:
                location_exist_and_not_empty = bool(
                    str(item['to_location']).strip())
                warehouse = str(item['to_location'])
                Warehouse_is_destination = True

            # Get Product
            if 'product_id' in requestBodyFields:
                product_id_exist_and_not_empty = bool(
                    str(body['product_id']).strip())
                product_id = str(body['product_id'])
            elif item and 'product_id' in item.keys():
                product_id_exist_and_not_empty = bool(
                    str(item['product_id']).strip())
                product_id = str(item['product_id'])
            else:
                product_id_exist_and_not_empty = False
                product_id = None

            if product_id_exist_and_not_empty:
                product = queries.getItemById(
                    'product', product_id, connection)

                if product and location_exist_and_not_empty:
                    product_name = product['name']
                    product_qty = 0

                    relatedReportRow = [
                        row for row in report if row['product'] == product_name and row['warehouse'] == warehouse]

                    if relatedReportRow and len(relatedReportRow) > 0 and relatedReportRow[0]['qty']:
                        product_qty = relatedReportRow[0]['qty']

                    # Warehouse is Source
                    if not Warehouse_is_destination:
                        if method == "POST":
                            if body['qty'] > product_qty:
                                return jsonify({"error": "The quantity for the product (" + product_name + ") in the (" + warehouse +
                                                ") location which (" + str(product_qty) +
                                                ") is less than the new movement quantity (" +
                                                str(body['qty']) +
                                                ") !!"})
                        elif method == "PUT":
                            orginial_qty = item['qty']
                            if body['qty'] > orginial_qty and body['qty'] - orginial_qty > product_qty:
                                return jsonify({"error": "Not allowed updating because the quantity for the product (" + product_name + ") in the (" + warehouse + ") location less than the increased quantity !!"})

                    # Warehouse is Destination
                    else:
                        if method == "PUT":
                            orginial_qty = item['qty']
                            if orginial_qty > body['qty'] and orginial_qty - body['qty'] > product_qty:
                                return jsonify({"error": "Not allowed updating because the quantity for the product (" + product_name + ") in the (" + warehouse + ") location less than the decreased quantity !!"})

    return dataValidationError
