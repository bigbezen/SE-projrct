products = [
  {
    "_id": { "oid": "586e7754d17c7562f4dae96d" },
    "notifyManager": 'false',
    "minRequiredAmount": 12,
    "subCategory": "סינגל מאלט סקוטי",
    "category": "ספיריט",
    "salePrice": 0,
    "retailPrice": 150,
    "name": "גלנליווט",
    "__v": 0
  },
  {
    "_id": { "oid": "586e795fd17c7562f4dae972" },
    "notifyManager": 'true',
    "minRequiredAmount": 10,
    "subCategory": "בלנד סקוטי",
    "category": "ספיריט",
    "salePrice": 0,
    "retailPrice": 70,
    "name": "בלו לייבל",
    "__v": 0
  },
  {
    "_id": { "oid": "587a3e2961dc3f5b3cc2584d" },
    "notifyManager": 'true',
    "minRequiredAmount": 0,
    "subCategory": "הר",
    "category": "יין",
    "salePrice": 0,
    "retailPrice": 40,
    "name": "יין תבור פנינים",
    "__v": 0
  },
  {
    "_id": { "oid": "587a3f2f33d13356104f55d1" },
    "notifyManager": 'true',
    "minRequiredAmount": 4,
    "subCategory": "אפרטיף-ביטר",
    "category": "ספיריט",
    "salePrice": 0,
    "retailPrice": 60,
    "name": "קמפארי",
    "__v": 0
  },
  {
    "_id": { "oid": "587a4942d86d5360e4c87c2d" },
    "notifyManager":'true',
    "minRequiredAmount": 10,
    "subCategory": "L.E",
    "category": "יין",
    "salePrice": 150,
    "retailPrice": 80,
    "name": "יין סדרה 11000",
    "__v": 0
  },
  {
    "_id": { "oid": "588176277c98e445a4166c6b" },
    "notifyManager": 'false',
    "minRequiredAmount": 20,
    "subCategory": "בלנד סקוטי",
    "category": "ספיריט",
    "salePrice": 150,
    "retailPrice": 100,
    "name": "בלאק לייבל",
    "__v": 0
  },
  {
    "_id": { "oid": "588176417c98e445a4166c6e" },
    "notifyManager": 'false',
    "minRequiredAmount": 10,
    "subCategory": "ארבעת הלבנים",
    "category": "ספיריט",
    "salePrice": 100,
    "retailPrice": 60,
    "name": "קטל וואן",
    "__v": 0
  },
  {
    "_id": { "oid": "588176847c98e445a4166c74" },
    "notifyManager": 'true',
    "minRequiredAmount": 5,
    "subCategory": "סינגל מאלט סקוטי",
    "category": "ספיריט",
    "salePrice": 300,
    "retailPrice": 200,
    "name": "מקאלן",
    "__v": 0
  },
  {
    "_id": { "oid": "588176b27c98e445a4166c77" },
    "notifyManager": 'true',
    "minRequiredAmount": 15,
    "subCategory": "תבור אדמה",
    "category": "יין",
    "salePrice": 150,
    "retailPrice": 100,
    "name": "תבור אדמה בציר 2014",
    "__v": 0
  },
  {
    "_id": { "oid": "588176ca7c98e445a4166c7a" },
    "notifyManager": 'false',
    "minRequiredAmount": 10,
    "subCategory": "ארבעת הלבנים",
    "category": "ספיריט",
    "salePrice": 110,
    "retailPrice": 80,
    "name": "סמירנוף בלאק",
    "__v": 0
  },
  {
    "_id": { "oid": "588176f37c98e445a4166c7d" },
    "notifyManager": 'true',
    "minRequiredAmount": 12,
    "subCategory": "ארבעת הלבנים",
    "category": "ספיריט",
    "salePrice": 120,
    "retailPrice": 100,
    "name": "קטל וואן ציטרון",
    "__v": 0
  },
  {
    "_id": { "oid": "58bbf1480c78622ef8480618" },
    "notifyManager": 'true',
    "minRequiredAmount": 5,
    "subCategory": "סינגל מאלט סקוטי",
    "category": "ספיריט",
    "salePrice": 170,
    "retailPrice": 120,
    "name": "גלנפידיך",
    "__v": 0
  }
]

shifts = [
  {
    "_id": { "oid": "58fc4805033e521420e3d460" },
    "parkingCost": 0,
    "type": "הדרכה",
    "status": "FINISHED",
    "endTime": { "date": "2017-04-23T14:00:00.000Z" },
    "startTime": { "date": "2017-04-23T11:00:00.000Z" },
    "salesmanId": { "oid": "58815a99f128241ce852f93c" },
    "storeId": { "oid": "586eaf54d17c7562f4dae9c9" },
    "encouragements": [ ],
    "shiftComments": [ "הערה" ],
    "sales": [
      {
        "productId": { "oid": "586e7754d17c7562f4dae96d" },
        "timeOfSale": { "date": "2017-04-23T06:26:38.419Z" },
        "quantity": 3,
        "_id": { "oid": "58fc491e033e521420e3d4aa" }
      }
    ],
    "salesReport": [
      {
        "productId": { "oid": "586e7754d17c7562f4dae96d" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 3,
        "opened": 3,
        "_id": { "oid": "58fc4805033e521420e3d46c" }
      },
      {
        "productId": { "oid": "586e795fd17c7562f4dae972" },
        "stockStartShift": 1,
        "stockEndShift": 1,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "58fc4805033e521420e3d46b" }
      },
      {
        "productId": { "oid": "587a3e2961dc3f5b3cc2584d" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "58fc4805033e521420e3d46a" }
      },
      {
        "productId": { "oid": "587a3f2f33d13356104f55d1" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "58fc4805033e521420e3d469" }
      },
      {
        "productId": { "oid": "587a4942d86d5360e4c87c2d" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "58fc4805033e521420e3d468" }
      },
      {
        "productId": { "oid": "588176277c98e445a4166c6b" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "58fc4805033e521420e3d467" }
      },
      {
        "productId": { "oid": "588176417c98e445a4166c6e" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "58fc4805033e521420e3d466" }
      },
      {
        "productId": { "oid": "588176847c98e445a4166c74" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "58fc4805033e521420e3d465" }
      },
      {
        "productId": { "oid": "588176b27c98e445a4166c77" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "58fc4805033e521420e3d464" }
      },
      {
        "productId": { "oid": "588176ca7c98e445a4166c7a" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "58fc4805033e521420e3d463" }
      },
      {
        "productId": { "oid": "588176f37c98e445a4166c7d" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "58fc4805033e521420e3d462" }
      },
      {
        "productId": { "oid": "58bbf1480c78622ef8480618" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "58fc4805033e521420e3d461" }
      }
    ],
    "constraints": [ ],
    "__v": 0
  },
  {
    "_id": { "oid": "58fcb87700fec82c70f936e3" },
    "parkingCost": 0,
    "type": "הדרכה",
    "status": "PUBLISHED",
    "endTime": { "date": "2017-04-23T20:00:00.000Z" },
    "startTime": { "date": "2017-04-23T19:00:00.000Z" },
    "salesmanId": { "oid": "587f97648557c6158411eacd" },
    "storeId": { "oid": "587a399561dc3f5b3cc25830" },
    "encouragements": [ ],
    "shiftComments": [ ],
    "sales": [ ],
    "salesReport": [
      {
        "productId": { "oid": "586e7754d17c7562f4dae96d" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "58fcb87700fec82c70f936ef" }
      },
      {
        "productId": { "oid": "586e795fd17c7562f4dae972" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "58fcb87700fec82c70f936ee" }
      },
      {
        "productId": { "oid": "587a3e2961dc3f5b3cc2584d" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "58fcb87700fec82c70f936ed" }
      },
      {
        "productId": { "oid": "587a3f2f33d13356104f55d1" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "58fcb87700fec82c70f936ec" }
      },
      {
        "productId": { "oid": "587a4942d86d5360e4c87c2d" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "58fcb87700fec82c70f936eb" }
      },
      {
        "productId": { "oid": "588176277c98e445a4166c6b" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "58fcb87700fec82c70f936ea" }
      },
      {
        "productId": { "oid": "588176417c98e445a4166c6e" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "58fcb87700fec82c70f936e9" }
      },
      {
        "productId": { "oid": "588176847c98e445a4166c74" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "58fcb87700fec82c70f936e8" }
      },
      {
        "productId": { "oid": "588176b27c98e445a4166c77" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "58fcb87700fec82c70f936e7" }
      },
      {
        "productId": { "oid": "588176ca7c98e445a4166c7a" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "58fcb87700fec82c70f936e6" }
      },
      {
        "productId": { "oid": "588176f37c98e445a4166c7d" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "58fcb87700fec82c70f936e5" }
      },
      {
        "productId": { "oid": "58bbf1480c78622ef8480618" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "58fcb87700fec82c70f936e4" }
      }
    ],
    "constraints": [ ],
    "__v": 0
  },
  {
    "_id": { "oid": "5901ac107547fd2f80989dff" },
    "parkingCost": 0,
    "type": "טעימה",
    "status": "PUBLISHED",
    "endTime": { "date": "2017-04-28T12:00:00.000Z" },
    "startTime": { "date": "2017-04-28T10:00:00.000Z" },
    "salesmanId": { "oid": "587a62a9dff67f14d0901e5f" },
    "storeId": { "oid": "587a399561dc3f5b3cc25830" },
    "encouragements": [ ],
    "shiftComments": [ ],
    "sales": [ ],
    "salesReport": [
      {
        "productId": { "oid": "586e7754d17c7562f4dae96d" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "5901ac107547fd2f80989e0b" }
      },
      {
        "productId": { "oid": "586e795fd17c7562f4dae972" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "5901ac107547fd2f80989e0a" }
      },
      {
        "productId": { "oid": "587a3e2961dc3f5b3cc2584d" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "5901ac107547fd2f80989e09" }
      },
      {
        "productId": { "oid": "587a3f2f33d13356104f55d1" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "5901ac107547fd2f80989e08" }
      },
      {
        "productId": { "oid": "587a4942d86d5360e4c87c2d" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "5901ac107547fd2f80989e07" }
      },
      {
        "productId": { "oid": "588176277c98e445a4166c6b" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "5901ac107547fd2f80989e06" }
      },
      {
        "productId": { "oid": "588176417c98e445a4166c6e" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "5901ac107547fd2f80989e05" }
      },
      {
        "productId": { "oid": "588176847c98e445a4166c74" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "5901ac107547fd2f80989e04" }
      },
      {
        "productId": { "oid": "588176b27c98e445a4166c77" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "5901ac107547fd2f80989e03" }
      },
      {
        "productId": { "oid": "588176ca7c98e445a4166c7a" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "5901ac107547fd2f80989e02" }
      },
      {
        "productId": { "oid": "588176f37c98e445a4166c7d" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "5901ac107547fd2f80989e01" }
      },
      {
        "productId": { "oid": "58bbf1480c78622ef8480618" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "5901ac107547fd2f80989e00" }
      }
    ],
    "constraints": [ ],
    "__v": 0
  },
  {
    "_id": { "oid": "59023958bb5d19179085dae6" },
    "parkingCost": 0,
    "type": "טעימה",
    "status": "FINISHED",
    "endTime": { "date": "2017-04-27T20:00:00.000Z" },
    "startTime": { "date": "2017-04-27T19:00:00.000Z" },
    "salesmanId": { "oid": "58815a99f128241ce852f93c" },
    "storeId": { "oid": "586eaf54d17c7562f4dae9c9" },
    "encouragements": [
      {
        "encouragement": { "oid": "5902393abb5d19179085dadd" },
        "count": 1,
        "_id": { "oid": "59023c91bb5d19179085db27" }
      }
    ],
    "shiftComments": [ "הערה" ],
    "sales": [
      {
        "productId": { "oid": "586e7754d17c7562f4dae96d" },
        "timeOfSale": { "date": "2017-04-27T18:39:33.799Z" },
        "quantity": 4,
        "_id": { "oid": "59023ae5bb5d19179085db01" }
      },
      {
        "productId": { "oid": "586e795fd17c7562f4dae972" },
        "timeOfSale": { "date": "2017-04-27T18:39:33.802Z" },
        "quantity": 3,
        "_id": { "oid": "59023ae5bb5d19179085db02" }
      },
      {
        "productId": { "oid": "586e7754d17c7562f4dae96d" },
        "timeOfSale": { "date": "2017-04-27T18:40:13.106Z" },
        "quantity": 3,
        "_id": { "oid": "59023b0dbb5d19179085db0a" }
      },
      {
        "productId": { "oid": "586e795fd17c7562f4dae972" },
        "timeOfSale": { "date": "2017-04-27T18:40:40.760Z" },
        "quantity": 2,
        "_id": { "oid": "59023b28bb5d19179085db11" }
      },
      {
        "productId": { "oid": "587a3f2f33d13356104f55d1" },
        "timeOfSale": { "date": "2017-04-27T18:40:40.761Z" },
        "quantity": 10,
        "_id": { "oid": "59023b28bb5d19179085db12" }
      }
    ],
    "salesReport": [
      {
        "productId": { "oid": "586e7754d17c7562f4dae96d" },
        "stockStartShift": 1,
        "stockEndShift": 1,
        "sold": 7,
        "opened": 0,
        "_id": { "oid": "59023958bb5d19179085daf2" }
      },
      {
        "productId": { "oid": "586e795fd17c7562f4dae972" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 5,
        "opened": 0,
        "_id": { "oid": "59023958bb5d19179085daf1" }
      },
      {
        "productId": { "oid": "587a3e2961dc3f5b3cc2584d" },
        "stockStartShift": 1,
        "stockEndShift": 1,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "59023958bb5d19179085daf0" }
      },
      {
        "productId": { "oid": "587a3f2f33d13356104f55d1" },
        "stockStartShift": 1,
        "stockEndShift": 1,
        "sold": 10,
        "opened": 0,
        "_id": { "oid": "59023958bb5d19179085daef" }
      },
      {
        "productId": { "oid": "587a4942d86d5360e4c87c2d" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "59023958bb5d19179085daee" }
      },
      {
        "productId": { "oid": "588176277c98e445a4166c6b" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "59023958bb5d19179085daed" }
      },
      {
        "productId": { "oid": "588176417c98e445a4166c6e" },
        "stockStartShift": 0,
        "stockEndShift": 1,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "59023958bb5d19179085daec" }
      },
      {
        "productId": { "oid": "588176847c98e445a4166c74" },
        "stockStartShift": 1,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "59023958bb5d19179085daeb" }
      },
      {
        "productId": { "oid": "588176b27c98e445a4166c77" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "59023958bb5d19179085daea" }
      },
      {
        "productId": { "oid": "588176ca7c98e445a4166c7a" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "59023958bb5d19179085dae9" }
      },
      {
        "productId": { "oid": "588176f37c98e445a4166c7d" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "59023958bb5d19179085dae8" }
      },
      {
        "productId": { "oid": "58bbf1480c78622ef8480618" },
        "stockStartShift": 0,
        "stockEndShift": 0,
        "sold": 0,
        "opened": 0,
        "_id": { "oid": "59023958bb5d19179085dae7" }
      }
    ],
    "constraints": [ ],
    "__v": 0
  }
]

users = [
  {
    "_id": { "oid": "587a62a9dff67f14d0901e5f" },
    "endDate":"null",
    "startDate": { "date": "2017-01-19T00:00:00.000Z" },
    "password": "b4d313a459fa44bd",
    "username": "lihiver",
    "inbox": [ ],
    "jobDetails": {
      "userType": "salesman",
      "area": "area",
      "channel": "channel",
      "salary": 30
    },
    "contact": {
      "address": {
        "street": "",
        "number": "",
        "city": "",
        "zip": ""
      },
      "phone": "",
      "email": "kjkj@kjkj.com"
    },
    "personal": {
      "id": "4543533",
      "firstName": "ליהיא",
      "lastName": "ורציק",
      "sex": "זכר",
      "birthday": { "date": "2017-03-05T00:00:00.000Z" }
    },
    "__v": 0
  },
  {
    "_id": { "oid": "587a63f6dff67f14d0901e69" },
    "endDate": "null",
    "startDate": { "date": "2015-12-31T00:00:00.000Z" },
    "password": "a4da05ac54ad06a3",
    "username": "shahaf",
    "inbox": [ ],
    "jobDetails": {
      "userType": "manager",
      "area": "צפון",
      "channel": "מסחרי"
    },
    "contact": {
      "address": {
        "street": "",
        "number": "",
        "city": "",
        "zip": ""
      },
      "phone": "",
      "email": "sds@dsfds.com"
    },
    "personal": {
      "id": "34343",
      "firstName": "שחף",
      "lastName": "שטיין",
      "sex": "נקבה",
      "birthday": { "date": "2017-03-05T00:00:00.000Z" }
    },
    "__v": 0
  },
  {
    "_id": { "oid": "587a6804418d1f0fc81a1d2c" },
    "endDate": "null",
    "startDate": { "date": "2012-12-31T00:00:00.000Z" },
    "password": "afc90bff52e90ba9",
    "username": "bezen",
    "inbox": [ ],
    "jobDetails": {
      "userType": "agent",
      "area": "צפון",
      "channel": "קלאסי"
    },
    "contact": {
      "address": {
        "street": "",
        "number": "",
        "city": "",
        "zip": ""
      },
      "phone": "",
      "email": "fdds@dfd.com"
    },
    "personal": {
      "id": "9876976",
      "firstName": "מתן",
      "lastName": "בזן",
      "sex": "זכר",
      "birtday": "null"
    },
    "__v": 0
  },
  {
    "_id": { "oid": "587f97648557c6158411eacd" },
    "endDate": "null",
    "startDate": { "date": "2017-01-10T00:00:00.000Z" },
    "password": "b5960dad40f904ef",
    "username": "mor",
    "inbox": [ ],
    "jobDetails": {
      "userType": "salesman",
      "area": "area",
      "channel": "channel",
      "salary": 27
    },
    "contact": {
      "address": {
        "street": "",
        "number": "",
        "city": "",
        "zip": ""
      },
      "phone": "",
      "email": "kjhjkh@kjhkjh.com"
    },
    "personal": {
      "id": "42343242",
      "firstName": "מור",
      "lastName": "כוג'סטה",
      "sex": "נקבה",
      "birthday": "null"
    },
    "__v": 0
  },
  {
    "_id": { "oid": "58815a99f128241ce852f93c" },
    "endDate": "null",
    "startDate": { "date": "2017-01-19T00:00:00.000Z" },
    "password": "acc600e507ec4ab3",
    "username": "avadir",
    "inbox": [ ],
    "jobDetails": {
      "userType": "salesman",
      "area": "area",
      "channel": "channel",
      "salary": 30
    },
    "contact": {
      "address": {
        "street": "",
        "number": "",
        "city": "",
        "zip": ""
      },
      "phone": "",
      "email": "aviramad@post.bgu.ac.il"
    },
    "personal": {
      "id": "302991468",
      "firstName": "אבירם",
      "lastName": "אדירי",
      "sex": "זכר",
      "birthday": "null"
    },
    "__v": 0
  },
  {
    "_id": { "oid": "585a69b5e4d78c05fc0eb891" },
    "endDate": "null",
    "startDate": { "date": "2016-08-16T00:00:00.000Z" },
    "password": "ec925ba501ac",
    "username": "aviram",
    "inbox": [ ],
    "jobDetails": {
      "userType": "manager",
      "area": "south",
      "channel": "spirit",
      "encouragements": [ ]
    },
    "contact": {
      "address": {
        "street": "rager",
        "number": "150",
        "city": "someCity",
        "zip": "11111"
      },
      "phone": "054-9999999",
      "email": "adiri.aviram@gmail.com"
    },
    "personal": {
      "id": "22345",
      "firstName": "אברום",
      "lastName": "המנהל",
      "sex": "male",
      "birthday": { "date": "2017-01-20T00:00:00.000Z" }
    },
    "__v": 3
  },
  {
    "_id": { "oid": "58d67c510f067836382167d3" },
    "endDate": "null",
    "startDate": { "date": "2016-09-15T21:00:00.000Z" },
    "password": "bcc707fd5e",
    "username": "admin",
    "inbox": [ ],
    "jobDetails": {
      "userType": "manager",
      "area": "south",
      "channel": "spirit",
      "encouragements": [ ]
    },
    "contact": {
      "address": {
        "street": "st",
        "number": "100",
        "city": "some city",
        "zip": "11111"
      },
      "phone": "054-9999999",
      "email": "w@gmail.com"
    },
    "personal": {
      "id": "0987654321",
      "firstName": "israel",
      "lastName": "israeli",
      "sex": "male",
      "birthday": { "date": "1998-12-31T22:00:00.000Z" }
    },
    "__v": 0,
    "sessionId": "ujx5icpngzc7abcfsmsvspvqp89h9a3pygx82v8da2a731yardr941pm53lsmtcdk1ssj34h2cpry0go71ky9mgqbkkn63l2w2o96wh9fs7lthuhrrva9bqleolq8m81"
  },
  {
    "_id": { "oid": "58edde083d01cf293c75f40c" },
    "startDate": { "date": "2017-04-11T00:00:00.000Z" },
    "password": "eed500a645f100ba",
    "username": "john",
    "inbox": [ ],
    "jobDetails": {
      "userType": "salesman",
      "area": "area",
      "channel": "channel",
      "salary": 25
    },
    "contact": {
      "address": {
        "street": "",
        "number": "",
        "city": "",
        "zip": ""
      },
      "phone": "052333333",
      "email": "bla@bla.com"
    },
    "personal": {
      "id": "34377734343",
      "firstName": "ג'ון",
      "lastName": "ג'וני",
      "sex": "זכר",
      "birthday": "null"
    },
    "__v": 0
  },
  {
    "_id": { "oid": "59024365da77730ac882e34c" },
    "startDate": { "date": "2017-04-07T00:00:00.000Z" },
    "password": "ec925ba501ac02ea",
    "username": "testAdmin",
    "inbox": [ ],
    "jobDetails": {
      "userType": "manager",
      "area": "area",
      "channel": "channel",
      "salary": "null"
    },
    "contact": {
      "address": {
        "street": "",
        "number": "",
        "city": "",
        "zip": ""
      },
      "phone": "052222222",
      "email": "testAdmin@bla.bla"
    },
    "personal": {
      "id": "11111111",
      "firstName": "מנהל",
      "lastName": "חדש",
      "sex": "זכר",
      "birthday": "null"
    },
    "__v": 0,
    "sessionId": "cs620w890yeuxtku7g5uwnu11klc01j5ko7hmp62jkmvq6xx2eu6dvx463001qteasxn0kxdrrekroja747quz2y5y7y8jn1kfdg7w83ljeds6hkw4lwdl15h7r9fzbc"
  },
  {
    "_id": { "oid": "5902561eda77730ac882e414" },
    "startDate": { "date": "2016-12-31T00:00:00.000Z" },
    "password": "ec915ba601af02e9",
    "username": "newUser",
    "inbox": [ ],
    "jobDetails": {
      "userType": "salesman",
      "area": "area",
      "channel": "channel",
      "salary": 21
    },
    "contact": {
      "address": {
        "street": "",
        "number": "",
        "city": "",
        "zip": ""
      },
      "phone": "0432222222",
      "email": "blabla@bla.bla"
    },
    "personal": {
      "id": "12121212",
      "firstName": "שםחדש",
      "lastName": "משפחהחדש",
      "sex": "זכר",
      "birthday": "null"
    },
    "__v": 0
  }
]

stores = [
  {
    "_id": { "oid": "586eaf54d17c7562f4dae9c9" },
    "channel": "מסחרי",
    "area": "דרום",
    "address": "האורגים 12",
    "city": "באר שבע",
    "phone": "052222266",
    "managerName": "מירי מסיקה",
    "name": "דרינק אנד קו",
    "__v": 0
  },
  {
    "_id": { "oid": "587a399561dc3f5b3cc25830" },
    "channel": "קלאסי",
    "area": "דרום",
    "address": "המרד 57",
    "city": "כרכור",
    "phone": "0523908209",
    "managerName": "שחף",
    "name": "החנות של שחף",
    "__v": 0
  },
  {
    "_id": { "oid": "587a4d6b46a2664bd887dda4" },
    "channel": "מסחרי",
    "area": "מרכז",
    "address": "משהו בנתניה",
    "city": "נתניה",
    "phone": "0523908209",
    "managerName": "בוריס",
    "name": "טיב טעם",
    "__v": 0
  }
]

encouragements = [
  {
    "_id": { "oid": "5902393abb5d19179085dadd" },
    "rate": 20,
    "numOfProducts": 10,
    "active": "true",
    "name": "תמריץ",
    "products": [
      { "oid": "587a3f2f33d13356104f55d1" },
      { "oid": "588176417c98e445a4166c6e" }
    ],
    "__v": 0
  }
]