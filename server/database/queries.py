import uuid
from flask import jsonify


def addNewItem(tablename, itemDetails, connection):
    tableId = tablename + "_id"
    recordTag = tablename
    if tablename == "productmovement":
        tableId = "movement_id"
        recordTag = "Movement"

    itemDetails[tableId] = tablename + "_" + uuid.uuid4().hex

    cur = connection.cursor()

    insertQueryFields = ','.join(list(itemDetails.keys()))
    insertQueryFieldsIndexs = ','.join(['%s'] * len(itemDetails.keys()))
    insertQueryValues = list(itemDetails.values())
    insertQuery = "INSERT INTO " + tablename + \
        "("+insertQueryFields+") VALUES (" + insertQueryFieldsIndexs + ")"

    cur.execute(insertQuery, insertQueryValues)
    connection.commit()
    return jsonify({'Message': 'The ' + recordTag + ' has been added !!'}), 200


def updateItem(tablename, itemDetails, id, connection):
    tableId = tablename + "_id"
    recordTag = tablename
    if tablename == "productmovement":
        tableId = "movement_id"
        recordTag = "Movement"

    cur = connection.cursor()

    updateQueryFields = '=%s,'.join(list(itemDetails.keys())) + "=%s"
    updateQueryValues = list(itemDetails.values()) + [id]

    updateQuery = "UPDATE " + tablename + " SET " + \
        updateQueryFields + " WHERE " + tableId + "=%s"

    cur.execute(updateQuery, updateQueryValues)
    connection.commit()
    return jsonify({'Message': 'The ' + recordTag + ' has been updated !!'}), 200


def getAllItems(tablename, connection):
    cur = connection.cursor()
    getAllItemsQuery = "SELECT * from "+tablename
    items = cur.execute(getAllItemsQuery)
    return cur.fetchall()


def getItemById(tablename, id, connection):
    tableId = tablename + "_id"
    if tablename == "productmovement":
        tableId = "movement_id"
    cur = connection.cursor()
    getItemByIdQuery = "SELECT * from " + tablename + " WHERE " + tableId + "=%s"
    cur.execute(getItemByIdQuery, [id])
    return cur.fetchone()
