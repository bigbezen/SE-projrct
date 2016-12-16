var mongoose    = require('mongoose');

var productModel         = require('../Models/product');
var encouragementModel   = require('../Models/encouragement');
var shiftModel           = require('../Models/shift');
var storeModel           = require('../Models/store');
var userModel            = require('../Models/user');

module.exports = {
    addUser: async function (user) {
        return user.save();
    },

    editUser: async function (user) {
        return user.save();
    },

    addStore: function (store) {
        store.save();
    },

    getUserBySessionId: async function(sessionId) {
        return userModel.findOne({'sessionId': sessionId});
    },

    getUserByUsername: async function(username){
        return userModel.findOne({'username': username});
    },

    getUserById: async function(Id){
        return userModel.findOne({'personal.id': Id});
    },

    editeStore: function (storeDetails, cb) {
        storeModel.update({'_id': mongoose.Types.ObjectId(storeDetails._id)}, storeDetails, { upsert: true }, cb)
    },

    deleteStore: function (storeDetails, cb) {
        storeModel.remove({'_id': mongoose.Types.ObjectId(storeDetails._id)},cb);
    },

    getAllStores: function (cb) {
        storeModel.find({}, cb);
    },

    getStoreByNameAndArea: function (storeDetails, cb) {
        storeModel.find({'name': storeDetails.name, 'area': storeDetails.area}, cb);
    },

    addProduct: function(product){
        product.save();
    },

    editProduct: function(productDetails, cb){
        productModel.update({'_id': mongoose.Types.ObjectId(productDetails._id)}, productDetails, { upsert: true }, cb)
    },

    deleteProduct: function(productDetails, cb){
        productModel.remove({'_id': mongoose.Types.ObjectId(productDetails._id)},cb)
    },

    getAllProducts: function (cb) {
        productModel.find({}, cb);
    },

    dropDb: function (cb) {
        mongoose.collection.remove({}, cb)
    }
};

