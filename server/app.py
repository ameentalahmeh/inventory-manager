import database.queries as queries
from database.connection import create_connection
from flask import Flask, request, jsonify, render_template
import sys
import yaml

# import custom functions
sys.path.append("/server/database")

# Flask App initlization.
app = Flask(__name__, static_folder="../client/build/static",
            template_folder="../client/build")

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

@app.route("/")
def index():
    return render_template("index.html")


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
                    return jsonify({"Message": "There is no stored data"}), 200
            elif resource in vaildResources['AddAndEdit'] and request.method == "POST" and id == None:
                return queries.addNewItem(resource, request.json, connection)
            elif resource in vaildResources["AddAndEdit"] and request.method != "POST":
                if id:
                    item = queries.getItemById(resource, id, connection)
                    if item:
                        if request.method == "PUT":
                            return queries.updateItem(resource, request.json, id, connection)
                        else:
                            return jsonify({"data": item}), 200
                    else:
                        return jsonify({'Message': "No " + resource + " related with the requested id: " + id}), 200
                else:
                    return jsonify({'Error': "ID parameter are missing !!"}), 404
            else:
                return jsonify({'Error': 'Invaild Endpoint'}), 404
        else:
            return jsonify({'Error': 'Unexpected HTTP Method'}), 502
    except Exception as e:
        return jsonify({'error': str(e)}), 502


if __name__ == "__main__":
    app.run(debug=True)
