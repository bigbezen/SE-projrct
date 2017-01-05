var mongoose    = require('mongoose');

var productModel        = require('../Models/product');
var encouragementModel  = require('../Models/encouragement');
var shiftModel          = require('../Models/shift');
var storeModel          = require('../Models/store');
var userModel           = require('../Models/user');
var messageModel          = require('../Models/message');

module.exports = {
    addUser: async function (user) {
        return user.save();
    },

    editUser: async function (user) {
        return user.save();
    },

    deleteUser: async function(username){
        return userModel.remove({'username': username});
    },

    addStore: async function (store) {
        return store.save();
    },



    getUserBySessionId: async function(sessionId){
        return userModel.findOne({ 'sessionId': sessionId })
    },

    getUserByUsername: async function(username){
        return userModel.findOne({ 'username': username });
    },

    getUserById: async function(Id){
        return userModel.findOne({'personal.id': Id});
    },

    getAllUses: async function(){
        return userModel.find({});
    },

    editStore: async function (storeDetails) {
        return storeModel.update({'_id': mongoose.Types.ObjectId(storeDetails._id)}, storeDetails, { upsert: false })
    },

    deleteStore: async function (storeId) {
        return storeModel.remove({'_id': mongoose.Types.ObjectId(storeId)});
    },

    getAllStores: async function(){
        return storeModel.find({});
    },

    getStoreByNameAndArea: async function (name, area) {
        return storeModel.findOne({'name': name, 'area': area});
    },

    addProduct: async function(product){
        return product.save();
    },

    editProduct: async function(productDetails){
        return productModel.update({'_id': mongoose.Types.ObjectId(productDetails._id)}, productDetails, { upsert: false })
    },

    deleteProduct: async function(ProductId){
        return productModel.remove({'_id': mongoose.Types.ObjectId(ProductId)});
    },

    getAllProducts: async function () {
        return productModel.find({});
    },

    getProductByNameAndCatagory: async function(name,category){
        return productModel.findOne({'name': name, 'category': category});
    },

    addEncouragement: async function(Encouragement){
        return Encouragement.save();
    },

    editEncouragement: async function(EncouragementDetails){
        return encouragementModel.update({'_id': mongoose.Types.ObjectId(EncouragementDetails._id)}, EncouragementDetails, { upsert: false })
    },

    deleteEncouragement: async function(iDencouragement){
        return encouragementModel.remove({'_id': mongoose.Types.ObjectId(iDencouragement)})
    },

    getAllEncouragements: async function () {
        return encouragementModel.find({});
    },

    getProductById: async function (productId){
        return productModel.findOne({'_id': productId});
    },

    getProductsById: async function(encouragementDetails){
        var products = encouragementDetails.products.map(x => mongoose.Types.ObjectId(x));
        return productModel.find({'_id': {$in: products}});
    },

    sendBroadcast: async function(msg){
        var save = await msg.save();
        var update = await userModel.update({'jobDetails.userType': 'salesman'}, {$push: {inbox: msg._id}}, {multi: true});
        return update;
    },


    markMessagesAsRead: async function(userId){
        return userModel.update({'_id': userId}, {$set: {inbox: []}});
    },

    getMessages: async function(messagesIds){
        return messageModel.find({'_id': {$in: messagesIds}});
    },


    cleanDb: async function () {
        var products = await productModel.find({});
        products.map(x => x.remove());
        var encs = await encouragementModel.find({});
        encs.map(x => x.remove());
        var shifts= await shiftModel.find({});
        shifts.map(x => x.remove());
        var stores = await storeModel.find({});
        stores.map(x => x.remove());
        var users = await userModel.find({});
        users.map(x => x.remove());
        var messages = await messageModel.find({});
        messages.map(x => x.remove());
    }
};

