from flask import jsonify


def addNewItem(tablename, itemDetails, itemsCount, connection):
    tableId = tablename + "_id"
    recordTag = tablename
    if tablename == "productmovement":
        tableId = "movement_id"
        recordTag = "Movement"

    try:
        itemDetails[tableId] = str(itemsCount)
        cur = connection.cursor()

        insertQueryFields = ','.join(list(itemDetails.keys()))
        insertQueryFieldsIndexs = ','.join(['%s'] * len(itemDetails.keys()))
        insertQueryValues = list(itemDetails.values())

        insertQuery = "INSERT INTO " + tablename + \
            "("+insertQueryFields+") VALUES (" + insertQueryFieldsIndexs + ")"

        cur.execute(insertQuery, insertQueryValues)
        connection.commit()
        return jsonify({'message': 'The ' + recordTag + ' has been added !!'}), 200,

    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)})


def updateItem(tablename, itemDetails, id, connection):
    tableId = tablename + "_id"
    recordTag = tablename
    if tablename == "productmovement":
        tableId = "movement_id"
        recordTag = "Movement"
    try:
        cur = connection.cursor()

        updateQueryFields = '=%s,'.join(list(itemDetails.keys())) + "=%s"
        updateQueryValues = list(itemDetails.values()) + [id]

        updateQuery = "UPDATE " + tablename + " SET " + \
            updateQueryFields + " WHERE " + tableId + "=%s"

        cur.execute(updateQuery, updateQueryValues)
        connection.commit()
        return jsonify({'message': 'The ' + recordTag + ' has been updated !!'}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)})


def getAllItems(tablename, connection):
    try:
        cur = connection.cursor(dictionary=True)
        getAllItemsQuery = "SELECT * from "+tablename
        items = cur.execute(getAllItemsQuery)
        return cur.fetchall()
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)})


def getItemById(tablename, id, connection):
    tableId = tablename + "_id"
    if tablename == "productmovement":
        tableId = "movement_id"
    try:
        cur = connection.cursor(dictionary=True)
        getItemByIdQuery = "SELECT * from " + tablename + " WHERE " + tableId + "=%s"
        cur.execute(getItemByIdQuery, [id])
        return cur.fetchone()
    except Exception as e:
        return jsonify({'error': str(e)})
