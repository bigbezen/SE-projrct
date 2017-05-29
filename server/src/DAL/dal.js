var mongoose    = require('mongoose');
var moment      = require('moment');

var productModel        = require('../Models/product');
var encouragementModel  = require('../Models/encouragement');
var shiftModel          = require('../Models/shift');
var storeModel          = require('../Models/store');
var userModel           = require('../Models/user');
var messageModel          = require('../Models/message');
var monthlySalesmanHoursReportModel = require('../Models/Reports/SummaryMonthlyHoursReport');
var monthAnalysisReportModel = require('../Models/Reports/monthAnalysisReport');

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

    setStoreDefaultUser: async function(storeId, salesmanId){
        return storeModel.update({'_id': mongoose.Types.ObjectId(storeId)}, {$set: {'defaultSalesman': mongoose.Types.ObjectId(salesmanId)}});
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

    getUserByobjectId(userId){
        return userModel.findOne({'_id': userId});
    },

    getAllSalesman: async function(){
        return userModel.find({$or:[{'jobDetails.userType': 'salesman'},{'jobDetails.userType': 'event'}]});
    },

    getAllUsers: async function(){
        return userModel.find({});
    },

    getUsersByIds: async function(ids){
        return userModel.find({'_id': {$in: ids}});
    },

    getManagers: async function(){
        return userModel.find({'jobDetails.userType': 'manager'});
    },

    //----------------------------------------------------- STORES ----------------------------------------------

    editStore: async function (storeDetails) {
        return storeModel.update({'_id': mongoose.Types.ObjectId(storeDetails._id)}, storeDetails, { upsert: false })
    },

    deleteStore: async function (storeId) {
        return storeModel.remove({'_id': mongoose.Types.ObjectId(storeId)});
    },

    getAllStores: async function(){
        return storeModel.find({}).populate('defaultSalesman');
    },

    getStoresByIds: async function(ids){
        ids = ids.map(x => mongoose.Types.ObjectId(x));
        return storeModel.find({'_id': {$in: ids}});
    },

    getStoreByNameAndArea: async function (name, address, city) {
        return storeModel.findOne({'name': name, 'address': address, 'city': city});
    },

    // ------------------------------------------------ PRODUCTS ------------------------------------------------

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

    getProductById: async function (productId){
        return productModel.findOne({'_id': productId});
    },

    getProductsById: async function(encouragementDetails){
        var products = encouragementDetails.products.map(x => mongoose.Types.ObjectId(x));
        return productModel.find({'_id': {$in: products}});
    },

    // ---------------------------------------------- ENCOURAGEMENTS ---------------------------------------

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

    // ------------------------------------------------- SHIFTS --------------------------------------------

    addShift: async function(shift){
        return shift.save();
    },

    getShiftsByIds: async function(shiftIds){
        shiftIds = shiftIds.map(x => mongoose.Types.ObjectId(x));
        return shiftModel.find({'_id': {$in: shiftIds}});
    },

    getShiftsByIdsWithStores: async function(shiftIds){
        shiftIds = shiftIds.map(x => mongoose.Types.ObjectId(x));
        return shiftModel.find({'_id': {$in: shiftIds}}, {'salesReport': 0})
            .populate('storeId')
            .populate('salesmanId');
    },

    getShiftsFromDate: async function(fromDate, salesmanId){
        return shiftModel.find({$and: [{'startTime': {$gte: fromDate}}, {'salesmanId': salesmanId}]})
            .populate('salesmanId')
            .populate('storeId');
    },

    getShiftsOfRangeForSalesman: async function(startDate, endDate, salesmanId){
        startDate = new Date((new Date(startDate)).setHours(0));
        endDate = new Date((new Date(endDate)).setHours(23, 59));
        return shiftModel.findOne({$and: [{'startTime': {$gte: startDate}}, {'salesmanId': salesmanId}, {'endTime': {$lte: new Date(endDate)}}]})
    },

    getShiftsByStatus: function(status){
        return shiftModel.find({'status': status}, {'salesReport': 0})
            .populate('storeId');
    },

    updateShift: async function(shift){
        return shiftModel.update({'_id': shift._id}, shift, {upsert: false});
    },

    editShift: async function(shiftDetails){
        return shiftModel.update({'_id': mongoose.Types.ObjectId(shiftDetails._id)}, shiftDetails, { upsert: false })
    },

    getEventShifts: async function(year, month){
        var startMonth = new Date(year, month, 1);
        var endMonth = new Date(year, month, 1).setMonth(startMonth.getMonth() + 1);
        return shiftModel.find({$and: [{'status': 'FINISHED'}, {'startTime': {$gte: startMonth, $lt: endMonth}}, {'type': {$regex : ".*אירוע.*"}}]}).populate('storeId').populate('salesmanId');
    },

    editSalesReport: async function(shiftId, salesReport, encouragements){
        return shiftModel.update({'_id': shiftId}, {'salesReport': salesReport, 'encouragements': encouragements}, { upsert: false })
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

    getSalesmanCurrentShift: async function(salesmanId, date){
        // let publishedShifts = await shiftModel.find({
        //     $and: [{'salesmanId': salesmanId}, {$or: [{'status': 'PUBLISHED'}, {'status': 'STARTED'}]}]
        // });
        // console.log('bla');
        // if(!publishedShifts)
        //     return null;
        // if(publishedShifts.length == 0)
        //     return null;
        // let HALF_HOUR_IN_MS = 1800000;
        // let currentShifts = publishedShifts.filter((shift) =>
        //         (((new Date(date)).getTime() >= ((new Date(shift.startTime)).getTime() - HALF_HOUR_IN_MS)) &&
        //         ((new Date(shift.endTime)).getTime() >= (new Date(date).getTime()))))
        //     .sort((shift1, shift2) => (new Date(shift1.startTime)).getTime() - (new Date(shift2.startTime)).getTime());
        // console.log('bla');
        // return currentShifts[0];

        let startOfDay = new Date((new Date(date)).setHours(0, 0, 0));
        let endOfDay = new Date((new Date(startOfDay)).setDate(startOfDay.getDate() + 1));

        return shiftModel.findOne({$and: [{'salesmanId': salesmanId},
            {$or: [{'status': 'PUBLISHED'}, {'status': 'STARTED'}]}, {'startTime': {$gte: startOfDay, $lt: endOfDay}}]});
    },

    deleteShift: async function(shiftId){
        return shiftModel.remove({'_id': mongoose.Types.ObjectId(shiftId)});
    },

    getMonthShifts: async function(year, month){
        var startMonth = new Date(year, month, 1);
        var endMonth = new Date(year, month, 1).setMonth(startMonth.getMonth() + 1);
        return shiftModel.find({$and: [{'status': 'FINISHED'}, {'startTime': {$gte: startMonth, $lt: endMonth}}]}).populate('encouragements.encouragement');
    },

    getSalesmanMonthShifts: async function(salesmanId, year, month){
        var startMonth = new Date(year, month, 1);
        var endMonth = new Date(year, month, 1).setMonth(startMonth.getMonth() + 1);
        return shiftModel.find({$and: [{'salesmanId': salesmanId},{'status': 'FINISHED'}, {'startTime': {$gte: startMonth, $lt: endMonth}}]}).populate('encouragements.encouragement');
    },

    getShiftsOfRange: async function(startDate, endDate){
        startDate = new Date((new Date(startDate)).setHours(0, 0, 0));
        endDate = new Date((new Date(endDate)).setHours(23, 59, 59));
        return shiftModel.find({$and: [{'startTime': {$gte: startDate}}, {'endTime': {$lte: new Date(endDate)}}]})
            .populate('salesmanId')
            .populate('storeId');
    },

    getSalesmanShifts: async function(salesmanId){
        return shiftModel.find({'salesmanId': salesmanId});
    },

    getSalesmanStartedShift: async function(salesmanId){
        return shiftModel.findOne({$and: [{'salesmanId': salesmanId}, {'status': 'STARTED'}]})
            .populate('salesmanId')
            .populate('storeId')
            .populate('salesReport.productId');
    },

    removeConstraints: function(date, area, salesmanId){
        return shiftModel.find({'startTime': date, 'status': 'CREATED'})
            .populate('storeId', null, {'area': area})
            .update({}, {$pull: {'constraints': {'salesmanId': salesmanId}}});
    },
//, {$pullAll: {'constraints.salesmanId': salesmanId}}
    setConstraints: function(date, area, constraint){
        return shiftModel.find({'startTime': date, 'status': 'CREATED'})
            .populate('storeId', null, {'area': area})
            .update({}, {$push: {'constraints': constraint}});
    },

    // ------------------------------------------------- MESSAGES -----------------------------------------------

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

    // ------------------------------------------------- REPORTS -----------------------------------------------

    addMonthlySalesmanReport: async function(report){
        return report.save()
    },

    addMonthAnalysisReport: async function(report){
        return report.save();
    },

    getMonthAnalysisReport(year){
        return monthAnalysisReportModel.findOne({'year': year}).populate('monthData.monthlyEncoragement.encouragement');
    },

    editMonthAnalysisReport(report){
        return monthAnalysisReportModel.update({'_id': report._id}, report, { upsert: false});
    },

    editMonthlyUserHoursReport(report){
        return monthlySalesmanHoursReportModel.update({'_id': report._id}, report, { upsert: false});
    },

    getMonthlyUserHoursReport: async function(year, month){
        return monthlySalesmanHoursReportModel.findOne({$and: [{'year': year}, {'month': month}]})
            .populate('salesmansData.user');
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
        var MonthlySalesmanReports = await monthlySalesmanHoursReportModel.find({});
        MonthlySalesmanReports.map(x => x.remove());
        var reports = await monthAnalysisReportModel.find({});
        reports.map(x => x.remove());
    }
};

