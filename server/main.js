"use strict";

let express         = require('express');
let bodyparser      = require('body-parser');
let path            = require('path');
let mongoose        = require('mongoose');
var scheduler       = require('node-schedule');

let logger          = require('./src/Utils/Logger/logger');
let validator       = require('./src/Utils/Validators/index');

let storeService            = require('./src/Services/store/index');
let userService             = require('./src/Services/user/index');
let productService          = require('./src/Services/product/index');
let encouragementService    = require('./src/Services/encouragements/index');
let messageService          = require('./src/Services/messages/index');
let reportsService          = require('./src/Services/reports/index');
let shiftService            = require('./src/Services/shift/index');
let deletionService         = require('./src/Services/deletion/index');

let app = express();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://svjgiyksxg.localtunnel.me');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.set('view engine', 'ejs');
let port = 3000;
app.use(bodyparser.json());
app.listen(process.env.PORT || port);

app.use(express.static(__dirname + '/public'));

let db = 'IBBLS';
if('DB' in process.env) {
    db = process.env['DB'];
}
app.locals.baseurl = "http://localhost:" + port;
let localdb = 'mongodb://localhost/' + db;
let remotedb = "mongodb://shahafstein:ibbls!234@ibbls-shard-00-00-9au6a.mongodb.net:27017,ibbls-shard-00-01-9au6a.mongodb.net:27017,ibbls-shard-00-02-9au6a.mongodb.net:27017/ibbls?ssl=true&replicaSet=ibbls-shard-0&authSource=admin";
app.locals.mongourl = localdb;


_connectToDb();
_setapApiEndpoints();
let monthlyJob  = scheduler.scheduleJob('46 * * * *', _genarateMonthlyReport);

console.log('server is now running on port: ', {'port': port});
function _connectToDb(){
    mongoose.Promise = global.Promise;
    mongoose.connect(app.locals.mongourl);
    let db = mongoose.connection;
    db.on('error', function(){
        console.error.bind(console, 'connection error:');
        console.log('cant connect to db');
        //throw 'Cant connect to DB...';
    });
    db.once('open', function() {
        console.log('connected to db successfuly');
        userService.setAdminUser();
    });
}

async function _genarateMonthlyReport(){
    let res = await reportsService.genarateMonthlyUserHoursReport();
    res = await reportsService.genarateMonthAnalysisReport();
}


function _setapApiEndpoints() {
    app.use('/scripts', express.static(path.join(__dirname, '/../scripts')));

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '../index.html'));
    });

//User Services
    app.post('/user/login', async function (req, res) {
        if (!validator.login(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await userService.login(req.body.username, req.body.password);
        if(result.sessionId != null){
            res.status(200).send(result);
        }
        else{
            res.status(result.code).send(result.err);
        }
    });

    app.post('/user/logout', async function (req, res) {
        if (!validator.sessionId(req.body)){
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await userService.logout(req.body.sessionId);
        if(result.code == 200)
            res.status(200).send('logout succeeded');
        else
            res.status(result.code).send(result.err);
    });

    app.post('/user/retrievePassword', async function (req, res) {
        if (!validator.retrievePassword(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await userService.retrievePassword(req.body.username, req.body.email);
        if(result.code == 200)
            res.status(200).send('retrieved password successfully');
        else
            res.status(result.code).send(result.err);
    });

    app.post('/user/changePassword', async function (req, res) {
        if (!validator.changePassword(req.body)){
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await userService.changePassword(req.body.sessionId, req.body.oldPass, req.body.newPass);
        if(result.code == 200)
            res.status(200).send('changed password succeeded');
        else
            res.status(result.code).send(result.err);
    });

    app.get('/user/getProfile', async function (req, res) {
        if(!('sessionid' in req.headers)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await userService.getProfile(req.headers.sessionid);
        if(result.code == 200)
            res.status(200).send(result.user);
        else
            res.status(result.code).send(result.err);
    });

//Salesman Services
    app.post('/salesman/startShift', async function (req, res) {
        if(!validator.startOrEndShift(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await shiftService.startShift(req.body.sessionId, req.body.shift);
        if(result.code == 200)
            res.status(200).send();
        else
            res.status(result.code).send(result.err);
    });

    app.post('/salesman/finishShift', async function (req, res) {
        if(!validator.startOrEndShift(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await shiftService.endShift(req.body.sessionId, req.body.shift);
        if(result.code == 200)
            res.status(200).send();
        else
            res.status(result.code).send(result.err);
    });

    app.post('/salesman/reportSale', async function (req, res) {
        if(!validator.reportSaleOrOpened(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await shiftService.reportSale(req.body.sessionId, req.body.shiftId, req.body.sales);
        if(result.code == 200)
            res.status(200).send();
        else
            res.status(result.code).send(result.err);
    });

    app.post('/salesman/editSale', async function (req, res) {
        if(!validator.editSale(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await shiftService.editSale(req.body.sessionId, req.body.shiftId, req.body.productId, req.body.saleTime, req.body.quantity);
        if(result.code == 200)
            res.status(200).send();
        else
            res.status(result.code).send(result.err);
    });

    app.post('/salesman/reportOpened', async function (req, res) {
        if(!validator.reportSaleOrOpened(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await shiftService.reportOpened(req.body.sessionId, req.body.shiftId, req.body.opens);
        if(result.code == 200)
            res.status(200).send();
        else
            res.status(result.code).send(result.err);
    });

    app.post('/salesman/addShiftComment', async function (req, res) {
        /*if(!validator.addShiftComment(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }*/
        let result = await shiftService.addShiftComment(req.body.sessionId, req.body.shiftId, req.body.content);
        if(result.code == 200)
            res.status(200).send();
        else
            res.status(result.code).send(result.err);
    });

    app.get('/salesman/:shiftId/activeShiftEncouragements', async function (req, res) {
        if(!('sessionid' in req.headers)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await shiftService.getActiveShiftEncouragements(req.body.sessionId, req.params.shiftId);
        if(result.code == 200)
            res.status(200).send(result.encouragements);
        else
            res.status(result.code).send(result.err);
    });

    app.get('/salesman/encouragements', function (req, res) {
        res.status(200).send('get encouragements list');
    });

    app.get('/salesman/getAllShifts', async function (req, res) {
        if(!('sessionid' in req.headers)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await shiftService.getSalesmanShifts(req.headers.sessionid);
        if(result.code == 200)
            res.status(200).send(result.shifts);
        else
            res.status(result.code).send(result.err);
    });

    app.get('/salesman/getCurrentShift', async function (req, res) {
        if(!('sessionid' in req.headers)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await shiftService.getSalesmanCurrentShift(req.headers.sessionid);
        if(result.code == 200)
            res.status(200).send(result.shift);
        else
            res.status(result.code).send(result.err);
    });

    app.get('/salesman/getActiveShift', async function (req, res) {
        if(!('sessionid' in req.headers) || (!('shiftId' in req.query))) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await shiftService.getActiveShift(req.headers.sessionid, req.query.shiftId);
        if(result.code == 200)
            res.status(200).send(result.shift);
        else
            res.status(result.code).send(result.err);
    });

    app.post('/salesman/reportExpenses', async function(req, res){
        if(!('sessionId' in req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await shiftService.reportExpenses(req.body.sessionId, req.body.shiftId, req.body.km, req.body.parking);
        if(result.code == 200)
            res.status(200).send(result.shift);
        else
            res.status(result.code).send(result.err);
    });

    app.post('/salesman/addShiftsConstraints', function (req, res) {
        res.status(200).send('add shifts constraints');
    });

    app.get('/salesman/salesHistory', function (req, res) {
        res.status(200).send('get sales history');
    });

    app.get('/salesman/getBroadcastMessages', async function (req, res) {
        if(!('sessionid' in req.headers)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let sessionId = req.headers.sessionid;
        let result = await messageService.getInbox(sessionId);
        if(result.code == 200)
            res.status(200).send(result.inbox);
        else {
            res.status(result.code).send(result.err);
            messageService.markAsRead(sessionId);
        }
    });

    app.post('/salesman/shiftRegister', function (req, res) {
        res.status(200).send('registration to shift');
    });

//Management Services
    app.post('/management/addUser', async function (req, res) {
        if (!validator.addUser(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await userService.addUser(req.body.sessionId, req.body.userDetails);
        if(result.code == 200){
            res.status(200).send(result.user);
        }
        else{
            res.status(result.code).send(result.err);
        }
    });

    app.post('/management/editUser', async function (req, res) {
        if (!validator.editUser(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await userService.editUser(req.body.sessionId, req.body.username, req.body.userDetails);
        if(result.code == 200){
            res.status(200).send();
        }
        else{
            res.status(result.code).send(result.err);
        }
    });

    app.post('/management/updateSalesReport', async function(req, res){
        let result = await shiftService.updateSalesReport(req.body.sessionId, req.body.shiftId,
            req.body.productId, req.body.newSold, req.body.newOpened);
        if(result.code == 200)
            res.status(200).send();
        else
            res.status(result.code).send(result.err);

    });

    app.post('/management/deleteUser', async function (req, res) {
        if (!validator.deleteUser(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await userService.deleteUser(req.body.sessionId, req.body.username);
        if(result.code == 200){
            res.status(200).send();
        }
        else{
            res.status(result.code).send(result.err);
        }
    });

    app.get('/management/getAllUsers', async function(req, res){
        if(!('sessionid' in req.headers)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await userService.getAllUsers(req.headers.sessionid);
        if(result.code == 200){
            res.status(200).send(result.users);
        }
        else{
            res.status(result.code).send(result.err);
        }
    });

    app.post('/management/addStore', async function (req, res) {
        if (!validator.addOrEditOrDeleteStore(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await storeService.addStore(req.body.sessionId, req.body.storeDetails);
        if (result.err != null)
        {
            res.status(result.code).send(result.err);
        }
        else
        {
            res.status(result.code).send(result.store);
        }
    });

    app.post('/management/editStore', async function (req, res) {
        if (!validator.addOrEditOrDeleteStore(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await storeService.editStore(req.body.sessionId, req.body.storeDetails);
        if (result.err != null)
        {
            res.status(result.code).send(result.err);
        }
        else
        {
            res.status(result.code).send(result.store);
        }
    });

    app.post('/management/deleteStore', async function (req, res) {
        if (!validator.deleteStore(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await storeService.deleteStroe(req.body.sessionId, req.body.storeId);
        if (result.err != null)
        {
            res.status(result.code).send(result.err);
        }
        else
        {
            res.status(result.code).send(result.store);
        }
    });

    app.get('/management/getAllStores', async function (req, res) {
        if(!('sessionid' in req.headers)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await storeService.getAllStores(req.headers.sessionid);
        if (result.err != null) {
            res.status(result.code).send(result.err);
        }
        else {
            res.status(result.code).send(result.stores);
        }
    });

    app.get('/management/:storeId/getStore', async function (req, res) {
        if(!('sessionid' in req.headers)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await storeService.getStore(req.headers.sessionid, req.params.storeId);
        if (result.err != null) {
            res.status(result.code).send(result.err);
        }
        else {
            res.status(result.code).send(result.store);
        }
    });

    app.post('/management/addProduct', async function (req, res) {
        if (!validator.addOrEditProduct(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await productService.addProduct(req.body.sessionId, req.body.productDetails);
        if (result.err != null) {
            res.status(result.code).send(result.err);
        }
        else {
            res.status(result.code).send(result.product);
        }
    });

    app.post('/management/editProduct', async function (req, res) {
        if (!validator.addOrEditProduct(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await productService.editProduct(req.body.sessionId, req.body.productDetails);
        if (result.err != null) {
            res.status(result.code).send(result.err);
        }
        else {
            res.status(result.code).send(result.product);
        }
    });

    app.post('/management/deleteProduct', async function (req, res) {
        if (!validator.deleteProduct(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await productService.deleteProduct(req.body.sessionId, req.body.productId);
        if (result.err != null) {
            res.status(result.code).send(result.err);
        }
        else {
            res.status(result.code).send(result.product);
        }
    });

    app.get('/management/getAllProducts', async function (req, res) {
        if(!('sessionid' in req.headers)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await productService.getAllProducts(req.headers.sessionid);
        if (result.err != null) {
            res.status(result.code).send(result.err);
        }
        else {
            res.status(result.code).send(result.products);
        }
    });

    app.get('/management/:productId/getProduct', async function (req, res) {
        if(!('sessionid' in req.headers)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await productService.getProduct(req.headers.sessionid, req.params.productId);
        if (result.err != null) {
            res.status(result.code).send(result.err);
        }
        else {
            res.status(result.code).send(result.product);
        }
    });

    app.post('/management/addEncouragement', async function (req, res) {
        if (!validator.addOrEditEncouragement(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await encouragementService.addEncouragement(req.body.sessionId, req.body.encouragementDetails);
        if (result.err != null) {
            res.status(result.code).send(result.err);
        }
        else {
            res.status(result.code).send(result.encouragement);
        }
    });

    app.post('/management/editEncouragement', async function (req, res) {
        if (!validator.addOrEditEncouragement(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await encouragementService.editEncouragement(req.body.sessionId ,req.body.encouragementDetails);
        if (result.err != null) {
            res.status(result.code).send(result.err);
        }
        else {
            res.status(result.code).send(result.encouragement);
        }
    });

    app.post('/management/deleteEncouragement', async function (req, res) {
        if (!validator.deleteEncouragement(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await encouragementService.deleteEncouragement(req.body.sessionId ,req.body.encouragementId);
        if (result.err != null) {
            res.status(result.code).send(result.err);
        }
        else {
            res.status(result.code).send(result.encouragement);
        }
    });

    app.get('/management/getAllEncouragements', async function (req, res) {
        if(!('sessionid' in req.headers)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await encouragementService.getAllEncouragements(req.headers.sessionid);
        if (result.err != null) {
            res.status(result.code).send(result.err);
        }
        else {
            res.status(result.code).send(result.encouragements);
        }
    });

    app.get('/management/:encouragementId/getAllEncouragements', async function (req, res) {
        if(!('sessionid' in req.headers)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await encouragementService.getEncouragement(req.headers.sessionid, req.params.encouragementId);
        if (result.err != null) {
            res.status(result.code).send(result.err);
        }
        else {
            res.status(result.code).send(result.encouragement);
        }
    });

    app.post('/management/addShifts', async function (req, res) {
        if (!validator.addShifts(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await shiftService.addShifts(req.body.sessionId, req.body.shiftArr);
        if(result.code == 200)
            res.status(200).send(result.shiftArr);
        else
            res.status(result.code).send(result.err);
    });

    app.post('/management/generateShifts', async function(req, res){
        if (!validator.generateShifts(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await shiftService.automateGenerateShifts(req.body.sessionId, req.body.starttime, req.body.endTime);
        if(result.code == 200)
            res.status(200).send(result.shifts);
        else
            res.status(result.code).send(result.err);
    });

    app.post('/management/publishShifts', async function (req, res) {
        if (!validator.publishShifts(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await shiftService.publishShifts(req.body.sessionId, req.body.shiftArr);
        if(result.code == 200)
            res.status(200).send();
        else
            res.status(result.code).send(result.err);
    });

    app.get('/management/getShiftsFromDate', async function(req, res){
        if(!('sessionid' in req.headers) || (!('fromDate' in req.query))) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await shiftService.getShiftsFromDate(req.headers.sessionid, req.query.fromDate);
        if(result.code == 200)
            res.status(200).send(result.shiftArr);
        else
            res.status(result.code).send(result.err);
    });

    app.get('/management/getSalesmanFinishedShifts', async function(req, res){
        if(!('sessionid' in req.headers) || (!('salesmanId' in req.query))) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await shiftService.getSalesmanFinishedShifts(req.headers.sessionid, req.query.salesmanId);
        if(result.code == 200)
            res.status(200).send(result.shifts);
        else
            res.status(result.code).send(result.err);
    });

    app.get('/management/getSalesmanLiveShift', async function(req, res){
        if(!('sessionid' in req.headers) || (!('salesmanId' in req.query))) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await shiftService.getSalesmanLiveShift(req.headers.sessionid, req.query.salesmanId);
        if(result.code == 200)
            res.status(200).send(result.shift);
        else
            res.status(result.code).send(result.err);
    });

    app.post('/management/editShifts', async function (req, res) {
        if (!validator.editShift(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await shiftService.editShift(req.body.sessionId, req.body.shiftDetails);
        if(result.code == 200)
            res.status(200).send();
        else
            res.status(result.code).send(result.err);
    });

    app.post('/management/deleteShift', async function (req, res) {
        if (!validator.deleteShift(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await shiftService.deleteShift(req.body.sessionId, req.body.shiftId);
        if (result.err != null)
        {
            res.status(result.code).send(result.err);
            return;
        }
        else
        {
            res.status(result.code).send(result.store);
            return;
        }
    });

    app.get('/management/getShiftsOfRange', async function(req, res){
        if(!('sessionid' in req.headers) || (!('startDate' in req.query)) || (!('endDate' in req.query))){
            res.status(404).send('invalid parameters');
            return;
        }

        let result = await shiftService.getShiftsOfRange(req.headers.sessionid, req.query.startDate, req.query.endDate);
        if(result.code == 200)
            res.status(200).send(result.shifts);
        else
            res.status(result.code).send(result.err);
    });

//Manager Services
    app.post('/manager/addNotificationRule', function (req, res) {
        res.status(200).send('add new notification rule');
    });

    app.post('/manager/removeNotificationRule', function (req, res) {
        res.status(200).send('remove notification rule');
    });

    app.post('/manager/setNotificationRule', function (req, res) {
        res.status(200).send('set new notification rule');
    });

    app.post('/manager/sendBroadcastMessage', async function (req, res) {
        if (!validator.sendBroadcastMessage(req.body)) {
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await messageService.sendBroadcast(req.body.sessionId, req.body.content, req.body.date);
        if(result.code == 200)
            res.status(200).send();
        else
            res.status(result.code).send(result.err);
    });

    app.get('/manager/getShiftNotes', function (req, res) {
        res.status(200).send('get shift notes');
    });

    app.post('/manager/editSalesReport', function (req, res) {
        res.status(200).send('edit sales report');
    });

    app.get('/manager/getRecommendations', function (req, res) {
        res.status(200).send('TODO - not yet implemented');
    });

    app.get('/manager/getShiftDetails', function (req, res) {
        res.status(200).send('get a specific shift details');
    });

    app.get('/manager/getShortages', function (req, res) {
        res.status(200).send('get shortages');
    });

    app.post('/manager/publishShifts', function (req, res) {
        res.status(200).send('publish shifts');
    });

    app.get('/manager/getSaleReportXl', async function (req, res) {
        var result = await reportsService.getSaleReportXl(req.headers.sessionid, req.headers.shiftid);
        res.status(result.code).send(result.err);
    });

    app.post('/manager/getSalaryForHumanResourceReport', async function (req, res) {
        var result = await reportsService.getSalaryForHumanResourceReport(req.body.sessionId ,req.body.year,req.body.month);
        res.status(result.code).send(result.err);
    });

    app.get('/manager/getSalesmanListXL', async function (req, res) {
        var result = await reportsService.getSalesmanListXL(req.headers.sessionid);
        res.status(result.code).send(result.err);
    });

    app.get('/manager/getMonthlyHoursSalesmansReportXl', async function (req, res) {
        var result = await reportsService.getMonthlyHoursSalesmansReportXl(req.headers.sessionId, req.headers.year, req.headers.month);
        res.status(result.code).send(result.err);
    });

    app.post('/manager/getMonthAnalysisReportXL', async function (req, res) {
        var result = await reportsService.getMonthAnalysisReportXL(req.body.sessionId, req.body.year);
        res.status(result.code).send(result.err);
    });

    app.get('/manager/getMonthlyHoursSalesmansReport', async function (req, res) {
        let result = await reportsService.getMonthlyUserHoursReport(req.headers.sessionid, req.query.year, req.query.month);
        if(result.code == 200)
            res.status(200).send(result.report);
        else
            res.status(result.code).send(result.err);
    });

    app.get('/manager/getMonthlyAnalysisReport', async function (req, res) {
        // if ((!('sessionid' in req.headers)) || (!validator.getMonthlyAnalysisReport(req.query))) {
        //     res.status(404).send('invalid parameters');
        //     return;
        // }
        let result = await reportsService.getMonthlyAnalysisReport(req.headers.sessionid, parseInt(req.query.year));
        if(result.code == 200)
            res.status(200).send(result.report);
        else
            res.status(result.code).send(result.err);
    });

    app.post('/manager/updateMonthlyAnalysisReport', async function(req, res) {
        if(!validator.updateMonthlyAnalysisReport(req.body)){
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await reportsService.updateMonthlyAnalysisReport(req.body.sessionId, req.body.year, req.body.report);
        if(result.code == 200)
            res.status(200).send(result.report);
        else
            res.status(result.code).send(result.err);
    });

    app.post('/manager/updateMonthlyHoursReport', async function(req, res){
        if(!validator.updateMonthlyHoursReport(req.body)){
            res.status(404).send('invalid parameters');
            return;
        }
        let result = await reportsService.updateMonthlySalesmanHoursReport(req.body.sessionId, req.body.year, req.body.month,
            req.body.report);
        if(result.code == 200)
            res.status(200).send(result.report);
        else
            res.status(result.code).send(result.err);
    });

    app.post('/manager/exportMonthlyHoursReport', async function(req, res){
        // if(!validator.exportMonthlyHoursReport(req.body)){
        //     res.status(404).send('invalid parameters');
        //     return;
        // }
        let result = await reportsService.getMonthlyHoursSalesmansReportXl(req.body.sessionId, req.body.year, req.body.month);
        console.log('bla');
        if(result.code == 200)
            res.status(200).send(result.report);
        else
            res.status(result.code).send(result.err);
    });

    // -----------------------------Section for deletion API---------------------------------------------------
    app.get('/super/cleanDb', async function(req, res){
        if(req.query.super == "ibblsservice"){
            let result = await deletionService.cleanDb();
            if(result.result.ok == 1)
                res.status(200).send("DB is successfully deleted");
            else
                res.status(500).send("could not delete db");
        }
        else
            res.status(404).send("unauthorized");
    });

    app.get('/super/cleanUsers', async function(req, res){
        if(req.query.super == "ibblsservice"){
            let result = await deletionService.cleanUsers();
            if(result.result.ok == 1)
                res.status(200).send("Users are successfully deleted");
            else
                res.status(500).send("could not delete ");
        }
        else
            res.status(404).send("unauthorized");
    });

    app.get('/super/cleanShifts', async function(req, res){
        if(req.query.super == "ibblsservice"){
            let result = await deletionService.cleanShifts();
            if(result.result.ok == 1)
                res.status(200).send("shifts are successfully deleted");
            else
                res.status(500).send("could not delete");
        }
        else
            res.status(404).send("unauthorized");
    });

    app.get('/super/cleanProducts', async function(req, res){
        if(req.query.super == "ibblsservice"){
            let result = await deletionService.cleanProducts();
            if(result.result.ok == 1)
                res.status(200).send("products are successfully deleted");
            else
                res.status(500).send("could not delete ");
        }
        else
            res.status(404).send("unauthorized");
    });

    app.get('/super/cleanStores', async function(req, res){
        if(req.query.super == "ibblsservice"){
            let result = await deletionService.cleanStores();
            if(result.result.ok == 1)
                res.status(200).send("stores are successfully deleted");
            else
                res.status(500).send("could not delete ");
        }
        else
            res.status(404).send("unauthorized");
    });

    app.get('/super/cleanMessages', async function(req, res){
        if(req.query.super == "ibblsservice"){
            let result = await deletionService.cleanMessages();
            if(result.result.ok == 1)
                res.status(200).send("messages are successfully deleted");
            else
                res.status(500).send("could not delete ");
        }
        else
            res.status(404).send("unauthorized");
    });

    app.get('/super/cleanEncs', async function(req, res){
        if(req.query.super == "ibblsservice"){
            let result = await deletionService.cleanEncs();
            if(result.result.ok == 1)
                res.status(200).send("encouragements are successfully deleted");
            else
                res.status(500).send("could not delete");
        }
        else
            res.status(404).send("unauthorized");
    });

    app.get('/super/cleanAnalyzeReports', async function(req, res){
        if(req.query.super == "ibblsservice"){
            let result = await deletionService.cleanMAReports();
            if(result.result.ok == 1)
                res.status(200).send("reports are successfully deleted");
            else
                res.status(500).send("could not delete");
        }
        else
            res.status(404).send("unauthorized");
    });

    app.get('/super/cleanMonthlyHoursReports', async function(req, res){
        if(req.query.super == "ibblsservice"){
            let result = await deletionService.cleanSMHReports();
            if(result.result.ok == 1)
                res.status(200).send("reports are successfully deleted");
            else
                res.status(500).send("could not delete");
        }
        else
            res.status(404).send("unauthorized");
    });

    app.get('/super/initiateProducts', async function(req, res){
        if(req.query.super == "ibblsservices"){
            let result = await deletionService.initiateProducts();
            if(result == true)
                res.status(200).send("products are initiated in db");
            else
                res.status(500).send("could not initiate products db");
        }
        else
            res.status(404).send("unauthorized");
    })


}