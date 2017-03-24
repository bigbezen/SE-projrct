var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var encouragementSchema = new Schema({
    'name': String,
    'products': [{type: mongoose.Schema.Types.ObjectId, ref: 'product'}],
    'numOfProducts': Number,
    'rate': Number,
    'active': Boolean
});

var encouragement = mongoose.model('encouragement', encouragementSchema);

module.exports = encouragement;