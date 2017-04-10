/**
 * Created by lihiverchik on 14/12/2016.
 */
var connection = require('../communication/connectionHandler')
//var connection = require('../communication/connectionHandlerStub')

var helpers = {
    getSessionId : function() {
        return connection.userRequests.getSessionId();
    },
    setSessionId : function(newSessionid) {
        connection.userRequests.setSessionId(newSessionid);
    },

    login: function(username, password){
        console.log('userServices- Login function: username: ' +username + ', pass: ' + password);
        return connection.userRequests.login(username, password);
    },

    logout: function(){
        console.log('userServices- Logout function');
        return connection.userRequests.logout();
    },

    managerIsLoggedin: function() {
        return  connection.userRequests.managerIsLoggedin();
    },

    salesmanIsLoggedin: function() {
        return  connection.userRequests.salesmanIsLoggedin();
    },

    retrievePassword: function(username, email){
        console.log('userServices- retrievePassword function');
        return connection.userRequests.retrievePassword(username, email);
    },

    changePassword: function(oldPass, newPass){
        console.log('userServices- changePassword function');
        return connection.userRequests.changePassword(oldPass, newPass);
    },

    getProfile: function(){
        console.log('userServices- getProfile function');
        return connection.userRequests.getProfile();
    },
    getUsername: function () {
        return connection.userRequests.getUsername();
    }
};

module.exports = helpers;