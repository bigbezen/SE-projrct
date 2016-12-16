function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mongoose = require('mongoose');

var productModel = require('../Models/product');
var encouragementModel = require('../Models/encouragement');
var shiftModel = require('../Models/shift');
var storeModel = require('../Models/store');
var userModel = require('../Models/user');

module.exports = {
    addUser: function (user) {
        user.save();
    },

    addStore: function (store) {
        store.save();
    },

    getUserBySessionId: (() => {
        var _ref = _asyncToGenerator(function* (sessionId) {
            return userModel.findOne({ 'sessionId': sessionId });
        });

        return function getUserBySessionId(_x) {
            return _ref.apply(this, arguments);
        };
    })(),

    getUserByUsername: (() => {
        var _ref2 = _asyncToGenerator(function* (username) {
            return userModel.findOne({ 'username': username });
        });

        return function getUserByUsername(_x2) {
            return _ref2.apply(this, arguments);
        };
    })()

};