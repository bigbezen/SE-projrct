from pymongo import MongoClient
import datetime
import dataObj
import os

client = MongoClient('localhost', 27017)

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
    os.system("mongoimport --db IBBLS --collection users --file for_export/users.json |" +
              "mongoimport --db IBBLS --collection products --file for_export/products.json |" +
              "mongoimport --db IBBLS --collection stores --file for_export/stores.json |" +
              "mongoimport --db IBBLS --collection encouragements --file for_export/encouragements.json |" +
              "mongoimport --db IBBLS --collection shifts --file for_export/shifts.json "
              )
    # db.products.insert_many(dataObj.products)
    # db.users.insert_many(dataObj.users)
    # db.stores.insert_many(dataObj.stores)
    # db.encouragements.insert_many(dataObj.encouragements)
    # db.shifts.insert_many(dataObj.shifts)
    return


def addCurrShift():
    start = datetime.datetime.now() + datetime.timedelta(hours=1)
    end = datetime.datetime.now() + datetime.timedelta(hours=2)
    start = start.replace(microsecond=0)
    end = end.replace(microsecond=0)
    shift = {'storeId': {"oid": "586eaf54d17c7562f4dae9c9"}, 'startTime': start.isoformat(), 'endTime': end.isoformat(),
             'type': 'הדרכה',
             'status': 'PUBLISHED', 'salesmanId': {"oid": "58815a99f128241ce852f93c"}}

    db.shifts.insert(shift)
    return
