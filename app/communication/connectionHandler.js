/**
 * Created by aviramad on 12/17/2016.
 */
var axios = require('axios');
var remoteServer = 'https://ibbls.herokuapp.com/';
var ngrok = 'https://7a269114.ngrok.io/';
var localServer = 'http://localhost:3000/';
var serverUrl = localServer;
var sessionId = null;
var name = null;
var userType = null;

function errorMessage(funcName, mess) {
    console.warn('Error in function:' + funcName + ': ' + mess);
}

function returnVal(isOk, info) {
    var retVal = {
        'success': isOk,
        'info': info
    };
    return retVal;
}

var userRequests = {
    login: function(username, password) {
        return axios.post(serverUrl + 'user/login', {
            username:username,
            password:password
        }).then(function (info) {
            sessionId = info.data.sessionId;
            name = username;
            userType = info.data.userType;
            console.log('the user ' + username + ' Was logged in. user type: ' + info.data.userType);
            return returnVal(true ,info.data.userType);
        }).catch(function (err) {
            errorMessage('Error in login', err);
            return returnVal(false, err);
        })
    },

    managerIsLoggedin: function() {
        return ((sessionId != null) && (userType == "manager"));
    },

    salesmanIsLoggedin: function() {
        return ((sessionId != null) && (userType == "salesman"));
    },

    logout: function() {
        return axios.post(serverUrl + 'user/logout', {
            sessionId:sessionId
        }).then(function (info) {
            console.log('the user ' + name + ' Was logged out');
            sessionId = null;
            name = null;
            userType = null;
            return returnVal(true, '');
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    retrievePassword: function(){ //TODO: doesn't
        return axios.post(serverUrl + 'user/retrievePassword', {
            sessionId:sessionId
        }).then(function (info) {
            console.log('the user ' + name + ' retrievePassword.');
            return returnVal(true, info);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    changePassword: function(oldPass, newPass){
        return axios.post(serverUrl + 'user/changePassword', {
            sessionId:sessionId,
            oldPass:oldPass,
            newPass:newPass
        }).then(function (info) {
            console.log('the user ' + name + ' changePassword.');
            return returnVal(true, info);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    getProfile: function(){
        return axios.get(serverUrl + 'user/getProfile', {
            sessionId:sessionId
        }).then(function (info) {
            console.log('the user ' + name + ' getProfile.');
            return returnVal(true, info);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    }
};

var managementRequests = {
    addUser: function(user) {
        return axios.post(serverUrl + 'management/addUser', {
            sessionId:sessionId,
            userDetails:user
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    editUser: function(name, user) {
        return axios.post(serverUrl + 'management/editUser', {
            sessionId:sessionId,
            username:name,
            userDetails:user
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    deleteUser: function(user) {
        return axios.post(serverUrl + 'management/deleteUser', {
            sessionId:sessionId,
            username:user.username
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    getAllUsers: function() {
        return axios.get(serverUrl + 'management/getAllUsers', {
            headers:{
                sessionId:sessionId
            }
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            console.log(err);
            return returnVal(false, err);
        })
    },

    addStore: function(store) {
        return axios.post(serverUrl + 'management/addStore', {
            sessionId:sessionId,
            storeDetails:store
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    editStore: function(store) {
        return axios.post(serverUrl + 'management/editStore', {
            sessionId:sessionId,
            storeDetails:store
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    deleteStore: function(store) {
        return axios.post(serverUrl + 'management/deleteStore', {
            sessionId:sessionId,
            storeId:store._id
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    getAllStores: function() {
        return axios.get(serverUrl + 'management/getAllStores', {
            headers:{
                sessionId:sessionId
            }
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            console.log(err);
            return returnVal(false, err);
        })
    },

    addProduct: function(product) {
        console.log('add product');
        return axios.post(serverUrl + 'management/addProduct', {
            sessionId:sessionId,
            productDetails:product
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    editProduct: function(product) {
        console.log('edit product');
        return axios.post(serverUrl + 'management/editProduct', {
            sessionId:sessionId,
            productDetails:product
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    deleteProduct: function(product) {
        return axios.post(serverUrl + 'management/deleteProduct', {
            sessionId:sessionId,
            productId:product._id
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    getAllProducts: function() {
        return axios.get(serverUrl + 'management/getAllProducts', {
            headers:{
                sessionId:sessionId
            }
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            console.log(err);
            return returnVal(false, err);
        })
    },

    addEncouragement: function() {
        errorMessage('addEncouragement', 'Not implemented yet');
    },

    editEncouragement: function() {
        errorMessage('editEncouragement', 'Not implemented yet');
    },

    deleteEncouragement: function() {
        errorMessage('deleteEncouragement', 'Not implemented yet');
    },

    addShift: function(shift) {
        console.log('add shift');
        var shiftArr = [];
        shiftArr.push(shift);
        return axios.post(serverUrl + 'management/addShifts', {
            sessionId:sessionId,
            shiftArr:shiftArr
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    editShift: function(shift) {
        console.log('add shift');
        return axios.post(serverUrl + 'management/editShifts', {
            sessionId:sessionId,
            shiftsArr:shift
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    deleteShift: function(shift) {
        console.log('delete shift');
        return axios.post(serverUrl + 'management/deleteShift', {
            sessionId:sessionId,
            shiftId:shift._id
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    //TODO:
    getShiftsFromDate: function(firstDate) {
        console.log('get shifts from dates');
        return axios.get(serverUrl + 'management/getShiftsFromDate?fromDate=' + firstDate, {
            headers:{
                sessionId:sessionId
            }
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    publishShifts: function(shift){
        console.log('publish shift');
        var shiftArr = [];
        shiftArr.push(shift);
        return axios.post(serverUrl + 'management/publishShifts', {
            sessionId:sessionId,
            shiftArr:shiftArr
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    AddAllShifts: function(startTime, endTime) {
        return axios.post(serverUrl + 'management/generateShifts', {
            sessionId:sessionId,
            startTime:startTime,
            endTime:endTime
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    }
};

var managerRequests = {
    addNotificationRule: function(){
        errorMessage('addNotificationRule', 'Not implemented yet');
    },

    removeNotificationRule: function(){
        errorMessage('removeNotificationRule', 'Not implemented yet');
    },

    setNotificationRule: function(){
        errorMessage('setNotificationRule', 'Not implemented yet');
    },

    sendBroadcastMessage: function(){
        errorMessage('sendBroadcastMessage', 'Not implemented yet');
    },

    getShiftNotes: function(){
        errorMessage('getShiftNotes', 'Not implemented yet');
    },

    editSalesReport: function(){
        errorMessage('editSalesReport', 'Not implemented yet');
    },

    getRecommendations: function(){
        errorMessage('getRecommendations', 'Not implemented yet');
    },

    getShiftDetails: function(){
        errorMessage('getShiftDetails', 'Not implemented yet');
    },

    getShortages: function(){
        errorMessage('getShortages', 'Not implemented yet');
    },

    getSaleReportXl: function(shift){
        return axios.get(serverUrl + 'manager/getSaleReportXl', {
            headers:{
                sessionId:sessionId,
                shiftId:shift._id
            }
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    }
};

var salesmanRequests = {
    //TODO:
    getCurrentShift: function() {
        return axios.get(serverUrl + 'salesman/getCurrentShift', {
            headers:{
                sessionId:sessionId
            }
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    startShift: function(shift) {
        return axios.post(serverUrl + 'salesman/startShift', {
            sessionId:sessionId,
            shift:shift
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    //TODO:
    finishShift: function(shift) {
        return axios.post(serverUrl + 'salesman/finishShift', {
            sessionId:sessionId,
            shift:shift
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    //TODO:
    getActiveShift: function(shiftId) {
        return axios.get(serverUrl + 'salesman/getActiveShift?shiftId=' +shiftId , {
            headers:{
                sessionId:sessionId
            }
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    reportSale: function(shiftId, products){
        return axios.post(serverUrl + 'salesman/reportSale', {
            sessionId:sessionId,
            shiftId:shiftId,
            sales:products
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    reportOpen: function(shiftId, products){
        return axios.post(serverUrl + 'salesman/reportOpened', {
            sessionId:sessionId,
            shiftId:shiftId,
            opens:products
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    //TODO
    addShiftComment: function(shiftId, content){
        return axios.post(serverUrl + 'salesman/addShiftComment', {
            sessionId:sessionId,
            shiftId:shiftId,
            content:content
        }).then(function (info) {
            return returnVal(true, info.data);
        }).catch(function (err) {
            return returnVal(false, err);
        })
    },

    getShiftNotesBySalesman: function(){
        return axios.get(serverUrl + 'salesman/getShiftNotes', {
            sessionId:sessionId
        }).then(function (info) {
            return returnVal(info);
        }).catch(function (err) {
            errorMessage('getShiftNotes', err);
        })
    },

    encouragements: function(){
        return axios.post(serverUrl + 'salesman/encouragements', {
            sessionId:sessionId
        }).then(function (info) {
            return returnVal(info);
        }).catch(function (err) {
            errorMessage('encouragements', err);
        })
    },

    shifts: function(){
        return axios.post(serverUrl + 'salesman/shifts', {
            sessionId:sessionId
        }).then(function (info) {
            return returnVal(info);
        }).catch(function (err) {
            errorMessage('shifts', err);
        })
    },

    addShiftsConstraints: function(){
        return axios.post(serverUrl + 'salesman/addShiftsConstraints', {
            sessionId:sessionId
        }).then(function (info) {
            return returnVal(info);
        }).catch(function (err) {
            errorMessage('addShiftsConstraints', err);
        })
    },

    salesHistory: function(){
        return axios.post(serverUrl + 'salesman/salesHistory', {
            sessionId:sessionId
        }).then(function (info) {
            return returnVal(info);
        }).catch(function (err) {
            errorMessage('salesHistory', err);
        })
    },

    getBroadcastMessages: function(){
        return axios.post(serverUrl + 'salesman/getBroadcastMessages', {
            sessionId:sessionId
        }).then(function (info) {
            return returnVal(info);
        }).catch(function (err) {
            errorMessage('getBroadcastMessages', err);
        })
    },

    shiftRegister: function(){
        return axios.post(serverUrl + 'salesman/shiftRegister', {
            sessionId:sessionId
        }).then(function (info) {
            return returnVal(info);
        }).catch(function (err) {
            errorMessage('shiftRegister', err);
        })
    }
};

module.exports.managerRequests = managerRequests;
module.exports.managementRequests = managementRequests;
module.exports.userRequests = userRequests;
module.exports.salesmanRequests = salesmanRequests;
