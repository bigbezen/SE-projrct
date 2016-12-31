var mongoose    = require('mongoose');

var productModel        = require('../Models/product');
var encouragementModel  = require('../Models/encouragement');
var shiftModel          = require('../Models/shift');
var storeModel          = require('../Models/store');
var userModel           = require('../Models/user');
var inboxModel          = require('../Models/message');

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

    addStore: function (store) {
        store.save();
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
        return storeModel.update({'_id': mongoose.Types.ObjectId(storeDetails._id)}, storeDetails, { upsert: true })
    },

    deleteStore: async function (storeDetails) {
        return storeModel.remove({'_id': mongoose.Types.ObjectId(storeDetails._id)});
    },

    getAllStores: async function(){
        return storeModel.find({});
    },

    getStoreByNameAndArea: async function (storeDetails) {
        return storeModel.findOne({'name': storeDetails.name, 'area': storeDetails.area});
    },

    addProduct: function(product){
        product.save();
    },

    editProduct: async function(productDetails){
        return productModel.update({'_id': mongoose.Types.ObjectId(productDetails._id)}, productDetails, { upsert: true })
    },

    deleteProduct: async function(productDetails){
        return productModel.remove({'_id': mongoose.Types.ObjectId(productDetails._id)});
    },

    getAllProducts: async function () {
        return productModel.find({});
    },

    getProductByNameAndCatagory: async function(productDetails){
        return productModel.findOne({'name': productDetails.name, 'category': productDetails.category});
    },

    addEncouragement: function(Encouragement){
        Encouragement.save();
    },

    editEncouragement: async function(EncouragementDetails){
        return encouragementModel.update({'_id': mongoose.Types.ObjectId(productDetails._id)}, EncouragementDetails, { upsert: true })
    },

    deleteEncouragement: async function(EncouragementDetails){
        return encouragementModel.remove({'_id': mongoose.Types.ObjectId(EncouragementDetails._id)})
    },

    getAllEncouragements: async function () {
        return encouragementModel.find({});
    },

    getProductsById: async function(encouragementDetails){
        var products = encouragementDetails.products.map(x => mongoose.Types.ObjectId(x));
        return productModel.find({'_id': {$in: products}});
    },

    sendBroadcast: async function(msg){
        userMode.update({'jobDetails.userType': 'salesman'}, {$push: {inbox: msg._id}}, {multi: true});
        return msg.save();
    },

    createInbox: async function(userObjectId){
        newInbox = new inboxModel();
        newInbox.reciever = userObjectId;
        newInbox.save();
    },

    getInbox: async function(userId){
        return inboxModel.findOne({$and: [{'reciever': userId}, {'messages.read': false}]});
    },

    markMessagesAsRead: async function(userId){
        return inboxMode.update({'reciever': userId}, {'messages.read': true});
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
    }

};

