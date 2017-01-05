/**
 * Created by lihiverchik on 14/12/2016.
 */
var connection = require('../communication/connectionHandler')
//var connection = require('../communication/connectionHandlerStub')

var helpers = {
    login: function(username, password){
        console.log('userServices- Login function: username: ' +username + ', pass: ' + password);
        return connection.userRequests.login(username, password);
    },

    logout: function(){
        console.log('userServices- Logout function');
        return connection.userRequests.logout();
    },

    retrievePassword: function(){
        console.log('userServices- retrievePassword function');
        return connection.userRequests.retrievePassword();
    },

    changePassword: function(oldPass, newPass){
        console.log('userServices- changePassword function');
        return connection.userRequests.changePassword(oldPass, newPass);
    },

    getProfile: function(){
        console.log('userServices- getProfile function');
        return connection.userRequests.getProfile();
    }
};

module.exports = helpers;