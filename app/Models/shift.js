var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var shiftSchema = new Schema({
    'storeId': {type: mongoose.Schema.Types.ObjectId, ref: 'stores'},
    'startTime': Date,
    'endTime': Date,
    'status': String,
    'type': String,
    'salesmanId': {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    'constraints': [
        {
            'stewardId': {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
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
    ]
});

var shift = mongoose.model('shift', shiftSchema);

module.exports = shift;