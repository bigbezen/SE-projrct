/**
 * Created by aviramad on 12/17/2016.
 */
var axios = require('axios');
var serverUrl = 'http://localhost:3000/';
var sessionId = 0;

function errorMessage(funcName, mess) {
    console.warn('Error in function:' + funcName + ': ' + mess);
}

var userRequests = {
    login: function(username, password) {
        return axios.post(serverUrl + 'user/login', {
            username:username,
            password:password
        }).then(function (info) {
            sessionId = info.data.sessionId;
            console.log('the user ' + username + ' Was logged in, with sessionId: ' + sessionId);
            return info;
            })
            .catch(function (err) {
                errorMessage('login', err);
        })
    },

    logout: function(){
        //TODO: call the relevant function
    },

    retrievePassword: function(){
        //TODO: call the relevant function
    },

    changePassword: function(){
        //TODO: call the relevant function
    },

    getProfile: function(){
        //TODO: call the relevant function
    },

    getProductByID: function(){
        //TODO: call the relevant function
    },

    getAllUsers: function(){
        //TODO: call the relevant function
    },

    getUserByID: function(userID){
        //TODO: call the relevant function
    }
};

module.exports = userRequests;