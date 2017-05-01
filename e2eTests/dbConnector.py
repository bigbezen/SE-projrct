from pymongo import MongoClient

client = MongoClient()
client = MongoClient('localhost', 27017)
import dataObj

db = client.IBBLS


# delete all db
def deleteDb():
    db.products.delete_many({})
    db.users.delete_many({})
    db.stores.delete_many({})
    db.encouragements.delete_many({})
    db.shifts.delete_many({})
    db.logs.delete_many({})
    db.mounthlyuserhoursreports.delete_many({})
    db.monthanalysisreports.delete_many({})
    return


# init all data
def initDb():
    db.products.insert_many(dataObj.products)
    db.users.insert_many(dataObj.users)
    db.stores.insert_many(dataObj.stores)
    db.encouragements.insert_many(dataObj.encouragements)
    db.shifts.insert_many(dataObj.shifts)
    return
