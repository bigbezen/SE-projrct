/**
 * Created by lihiverchik on 14/12/2016.
 */
var connection = require('../communication/connectionHandler')
//var connection = require('../communication/connectionHandlerStub')

var helpers = {
    login: function(username, password){
        console.log('userServices- Login function: username: ' +username + ', pass: ' + password);
        return connection.login(username, password);
    },

    logout: function(){
        console.log('userServices- Logout function');
        return connection.logout();
    },

    retrievePassword: function(){
        console.log('userServices- retrievePassword function');
        return connection.retrievePassword();
    },

    changePassword: function(oldPass, newPass){
        console.log('userServices- changePassword function');
        return connection.changePassword(oldPass, newPass);
    },

    getProfile: function(){
        console.log('userServices- getProfile function');
        return connection.getProfile();
    }
};

module.exports = helpers;