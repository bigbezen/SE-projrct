var mongoose    = require('mongoose');
var moment      = require('moment');

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

    updateUser: async function(user){
        return userModel.update({'_id': mongoose.Types.ObjectId(user._id)}, user, { upsert: false });
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

    getAllUsers: async function(){
        return userModel.find({});
    },

    getUsersByIds: async function(ids){
        return userModel.find({'_id': {$in: ids}});
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

    getStoresByIds: async function(ids){
        ids = ids.map(x => mongoose.Types.ObjectId(x));
        return storeModel.find({'_id': {$in: ids}});
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

    getEncouragement: async function(id){
        return encouragementModel.findOne({'_id': id});
    },

    getProductById: async function (productId){
        return productModel.findOne({'_id': productId});
    },

    getProductsById: async function(encouragementDetails){
        var products = encouragementDetails.products.map(x => mongoose.Types.ObjectId(x));
        return productModel.find({'_id': {$in: products}});
    },

    getShiftsByIds: async function(shiftIds){
        shiftIds = shiftIds.map(x => mongoose.Types.ObjectId(x));
        return shiftModel.find({'_id': {$in: shiftIds}});
    },

    getShiftsFromDate: async function(fromDate){
        return shiftModel.find({'startTime': {$gte: fromDate}});
    },

    updateShift: async function(shift){
        // shift.salesReport = shift.salesReport.map(function(product){
        //     product.productId = mongoose.Types.ObjectId(product.productId);
        //     return product;
        // });
        return shiftModel.update({'_id': shift._id}, shift, {upsert: false});
    },

    editShift: async function(shiftDetails){
        return storeModel.update({'_id': mongoose.Types.ObjectId(shiftDetails._id)}, shiftDetails, { upsert: false })
    },

    publishShifts: async function(shiftArr){
        var results = [];
        var result;
        for(var shift of shiftArr){
            result = await shiftModel.update({'_id': shift._id}, {'salesmanId': shift.salesmanId, 'status': shift.status});
            if(result.ok != 1)
                results.push(shift._id);
        }
        return results;
    },

    getSalesmanCurrentShift: async function(salesmanId){
        var today = moment().startOf('day');
        var tomorrow = moment(today).add(1, 'days');

        return shiftModel.findOne({$and: [{'salesmanId': salesmanId},
            {'status': 'PUBLISHED'}, {'startTime': {$gte: today.toDate(), $lt: tomorrow.toDate()}}]});
    },

    deleteShift: async function(shiftId){
        return shiftModel.remove({'_id': mongoose.Types.ObjectId(shiftId)});
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

    addShift: async function(shift){
        return shift.save();
    },


    cleanDb: async function () {
        var products = await productModel.find({});
        products.map(x => x.remove());
        var encs = await encouragementModel.find({});
        encs.map(x => x.remove());
        var shifts = await shiftModel.find({});
        shifts.map(x => x.remove());
        var stores = await storeModel.find({});
        stores.map(x => x.remove());
        var users = await userModel.find({});
        users.map(x => x.remove());
        var messages = await messageModel.find({});
        messages.map(x => x.remove());
        var shift = await shiftModel.find({});
        shift.map(x => x.remove());
    }
};

