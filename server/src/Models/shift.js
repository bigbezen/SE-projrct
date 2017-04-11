var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var shiftSchema = new Schema({
    'storeId': {type: mongoose.Schema.Types.ObjectId, ref: 'stores'},
    'startTime': Date,
    'endTime': Date,
    'status': String,
    'type': String,
    'expenses': {
        'numOfKM': Number,
        'parkingCost': Number
    },
    'salesmanId': {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    'constraints': [
        {
            'salesmanId': {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
            'isAvailable': Boolean,
            'comment': String
        }
    ],
    'salesReport': [
        {
            'productId': {type: mongoose.Schema.Types.ObjectId, ref: 'products'},
            'stockStartShift': Number,
            'stockEndShift': Number,
            'sold': Number,
            'opened': Number
        }
    ],
    'sales': [
        {
            'productId': {type: mongoose.Schema.Types.ObjectId, ref: 'products'},
            'timeOfSale': Date,
            'quantity': Number
        }
    ],
    'shiftComments': ['String'],
    'encouragements': [{type: mongoose.Schema.Types.ObjectId, ref: 'encouragement'}]
});

var shift = mongoose.model('shift', shiftSchema);

module.exports = shift;