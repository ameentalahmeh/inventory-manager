import database.queries as queries
from database.connection import create_connection as connector
from validation.validator import requestValidation as requestValidator
from validation.validator import dataValidation as dataValidator
from flask import Flask, request, jsonify
import sys
import yaml
import pandas as pd
import datetime

# import custom functions
sys.path.append("/server")

# Flask App initlization
app = Flask(__name__)

# load database configuration params
db = yaml.full_load(open('db.yaml'))

# Create Connection
connection = connector(
    db['mysql_host'], db['mysql_user'], db['mysql_password'], db['mysql_database'])

# Vars declartion
acceptedRequestMethods = ["GET", "POST", "PUT"]
vaildResources = ["product", "location", "productmovement", "report"]


# Prepare Report
def prepare_report():
    report = []
    done = []
    movements = queries.getAllItems(
        'productmovement', connection)
    locations = queries.getAllItems(
        'location', connection)

    for movement in movements:
        product_id = movement['product_id']
        if product_id not in done:
            done.append(product_id)
            product = queries.getItemById(
                'product', product_id, connection)
            if product:
                product_name = product['name']
                product_movements = [
                    mov for mov in movements if mov['product_id'] == product_id]

                for location in locations:
                    warehouse = location['city']
                    importedQty = 0
                    exportedQty = 0
                    totalQty = 0

                    for pm in product_movements:
                        if pm['to_location'] == warehouse:
                            importedQty += pm['qty']
                        elif pm['from_location'] == warehouse:
                            exportedQty += pm['qty']

                    totalQty = importedQty - exportedQty

                    if totalQty > 0:
                        report.append({
                            'product': product_name,
                            "warehouse": warehouse,
                            "qty": totalQty
                        })
    return report

# Routing


@ app.route("/api/<string:resource>", methods=["GET", "POST"], defaults={'id': None})
@ app.route("/api/<string:resource>/<string:id>", methods=["GET", "PUT"])
def routing(resource, id):
    resource = resource.strip()
    if request.method in acceptedRequestMethods:
        if resource in vaildResources:
            report = prepare_report()
            if not id:
                if resource == 'report':
                    return jsonify({"data": report})
                else:
                    items = queries.getAllItems(resource, connection)
                    if request.method == "GET":
                        if items and len(items) > 0:
                            return jsonify({"data": items})
                        else:
                            return jsonify({"error": "There is no stored data"})

                    elif request.method == "POST":
                        vaildationError = requestValidator(
                            resource, 'POST', request.json, None)
                        if vaildationError:
                            return vaildationError
                        else:
                            dataValidationError = dataValidator(
                                request.json, 'POST', report, None, connection)
                            if dataValidationError:
                                return dataValidationError
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
                        vaildationError = requestValidator(
                            resource, 'PUT', request.json, item)
                        if vaildationError:
                            return vaildationError
                        else:
                            dataValidationError = dataValidator(
                                request.json, 'PUT', report, item, connection)
                            if dataValidationError:
                                return dataValidationError
                            else:
                                if resource == "productmovement" and 'movement_timestamp' not in request.json.keys():
                                    request.json['movement_timestamp'] = item['movement_timestamp']
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
