var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    'name': String,
    'retailPrice': Number,
    'salePrice': Number,
    'category': String,
    'subCategory': String,
    'minRequiredAmount': Number,
    'notifyManager': Boolean
});

var product = mongoose.model('product', productSchema);

module.exports = product;