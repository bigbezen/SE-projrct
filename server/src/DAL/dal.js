var mongoose    = require('mongoose');

var productModel         = require('../Models/product');
var encouragementModel   = require('../Models/encouragement');
var shiftModel           = require('../Models/shift');
var storeModel           = require('../Models/store');
var userModel            = require('../Models/user');

module.exports = {
    addUser: function (user) {
        user.save();
    },

    addStore: function (store) {
        store.save();
    },

    getUserBySessionId: async function(sessionId) {
        return userModel.findOne({'sessionId': sessionId});
    },

    getUserByUsername: async function(username){
        return userModel.findOne({'username': username});
    }


};

