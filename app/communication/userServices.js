/**
 * Created by lihiverchik on 14/12/2016.
 */
var connection = require('../communication/connectionHandler')

var helpers = {
    login: function(username, password){
        console.log('userServices- Login function: username:' +username + ', pass' + password);
        //return connection.login(username, password);
        return connection.login('aviramad', '111111');
    },

    logout: function(){
        console.log('userServices- Logout function');
        return connection.logout();
    },

    retrievePassword: function(){
        console.log('userServices- retrievePassword function');
        return connection.retrievePassword();
    },

    changePassword: function(){
        console.log('userServices- changePassword function');
        return connection.changePassword();
    },

    getProfile: function(){
        console.log('userServices- getProfile function');
        return connection.getProfile();
    }
};

module.exports = helpers;