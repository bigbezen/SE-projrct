

var shift = {
    'storeId': String,
    'startTime': Date,
    'endTime': Date,
    'status': String,
    'type': String,
    'salesmanId': String,
    'constraints': [
        {
            'stewardId': String,
            'isAvailable': Boolean,
            'comment': String
        }
    ],
    'salesReport': [
        {
            'productId': String,
            'stockStartShift': Number,
            'stockEndShift': Number,
            'sold': Number,
            'opened': Number
        }
    ],
    'sales': [
        {
            'productId': String,
            'timeOfSale': Date,
            'quantity': Number
        }
    ]
};


module.exports = shift;