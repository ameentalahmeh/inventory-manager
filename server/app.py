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


# Routing

@app.route("/api/<string:resource>", methods=["GET", "POST"], defaults={'id': None})
@app.route("/api/<string:resource>/<string:id>", methods=["GET", "PUT"])
def routing(resource, id):
    try:
        resource = resource.strip()
        if request.method in acceptedRequestMethods:
            if resource in vaildResources['View'] and request.method == "GET":
                items = queries.getAllItems(resource[:-1], connection)
                if items and len(items) > 0:
                    return jsonify({"data": items}), 200
                else:
                    return jsonify({"error": "There is no stored data"})
            elif resource in vaildResources['AddAndEdit'] and request.method == "POST" and id == None:
                items = queries.getAllItems(resource, connection)
                return queries.addNewItem(resource, request.json, len(items)+1, connection)
            elif resource in vaildResources["AddAndEdit"] and request.method != "POST":
                if id:
                    item = queries.getItemById(resource, id, connection)
                    if item:
                        if request.method == "PUT":
                            return queries.updateItem(resource, request.json, id, connection)
                        else:
                            return jsonify({"data": item}), 200
                    else:
                        return jsonify({'error': "No " + resource + " related with the requested id: " + id})
                else:
                    return jsonify({'error': "ID parameter are missing !!"}), 404
            else:
                return jsonify({'error': 'Invaild Endpoint'}), 404
        else:
            return jsonify({'error': 'Unexpected HTTP Method'}), 502
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 502


if __name__ == "__main__":
    app.run(debug=True)
