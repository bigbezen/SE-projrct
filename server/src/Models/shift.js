var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var shiftSchema = new Schema({
    'storeId': {type: mongoose.Schema.Types.ObjectId, ref: 'store'},
    'startTime': Date,
    'endTime': Date,
    'status': String,
    'type': String,
    'numOfKM': Number,
    'parkingCost': Number,
    'extraExpenses': Number,
    'salesmanId': {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    'managerComment': String,
    'constraints': [
        {
            'salesmanId': {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
            'isAvailable': Boolean,
            'comment': String
        }
    ],
    'salesReport': [
        {
            'productId': {type: mongoose.Schema.Types.ObjectId, ref: 'product'},
            'stockStartShift': Number,
            'stockEndShift': Number,
            'sold': Number,
            'opened': Number
        }
    ],
    'sales': [
        {
            'productId': {type: mongoose.Schema.Types.ObjectId, ref: 'product'},
            'timeOfSale': Date,
            'quantity': Number
        }
    ],
    'shiftComments': ['String'],
    'encouragements': [{
        'encouragement': {type: mongoose.Schema.Types.ObjectId, ref: 'encouragement'},
        'count': Number
    }]
});

var shift = mongoose.model('shift', shiftSchema);

module.exports = shift;