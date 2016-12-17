function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mongoose = require('mongoose');

var productModel = require('../Models/product');
var encouragementModel = require('../Models/encouragement');
var shiftModel = require('../Models/shift');
var storeModel = require('../Models/store');
var userModel = require('../Models/user');

module.exports = {
    addUser: (() => {
        var _ref = _asyncToGenerator(function* (user) {
            return user.save();
        });

        return function addUser(_x) {
            return _ref.apply(this, arguments);
        };
    })(),

    addStore: function (store) {
        store.save();
    },

    editUser: (() => {
        var _ref2 = _asyncToGenerator(function* (user) {
            return user.save();
        });

        return function editUser(_x2) {
            return _ref2.apply(this, arguments);
        };
    })(),

    getUserBySessionId: (() => {
        var _ref3 = _asyncToGenerator(function* (sessionId) {
            return userModel.findOne({ 'sessionId': sessionId });
        });

        return function getUserBySessionId(_x3) {
            return _ref3.apply(this, arguments);
        };
    })(),

    getUserByUsername: (() => {
        var _ref4 = _asyncToGenerator(function* (username) {
            return userModel.findOne({ 'username': username });
        });

        return function getUserByUsername(_x4) {
            return _ref4.apply(this, arguments);
        };
    })(),

    getUserById: (() => {
        var _ref5 = _asyncToGenerator(function* (Id) {
            return userModel.findOne({ 'personal.id': Id });
        });

        return function getUserById(_x5) {
            return _ref5.apply(this, arguments);
        };
    })(),

    editStore: (() => {
        var _ref6 = _asyncToGenerator(function* (storeDetails) {
            return storeModel.update({ '_id': mongoose.Types.ObjectId(storeDetails._id) }, storeDetails, { upsert: true });
        });

        return function editStore(_x6) {
            return _ref6.apply(this, arguments);
        };
    })(),

    deleteStore: (() => {
        var _ref7 = _asyncToGenerator(function* (storeDetails) {
            return storeModel.remove({ '_id': mongoose.Types.ObjectId(storeDetails._id) });
        });

        return function deleteStore(_x7) {
            return _ref7.apply(this, arguments);
        };
    })(),

    getAllStores: (() => {
        var _ref8 = _asyncToGenerator(function* () {
            return storeModel.find({});
        });

        return function getAllStores() {
            return _ref8.apply(this, arguments);
        };
    })(),

    getStoreByNameAndArea: (() => {
        var _ref9 = _asyncToGenerator(function* (storeDetails) {
            return storeModel.findOne({ 'name': storeDetails.name, 'area': storeDetails.area });
        });

        return function getStoreByNameAndArea(_x8) {
            return _ref9.apply(this, arguments);
        };
    })(),

    addProduct: function (product) {
        product.save();
    },

    editProduct: (() => {
        var _ref10 = _asyncToGenerator(function* (productDetails) {
            return productModel.update({ '_id': mongoose.Types.ObjectId(productDetails._id) }, productDetails, { upsert: true });
        });

        return function editProduct(_x9) {
            return _ref10.apply(this, arguments);
        };
    })(),

    deleteProduct: (() => {
        var _ref11 = _asyncToGenerator(function* (productDetails) {
            return productModel.remove({ '_id': mongoose.Types.ObjectId(productDetails._id) });
        });

        return function deleteProduct(_x10) {
            return _ref11.apply(this, arguments);
        };
    })(),

    getAllProducts: (() => {
        var _ref12 = _asyncToGenerator(function* () {
            return productModel.find({});
        });

        return function getAllProducts() {
            return _ref12.apply(this, arguments);
        };
    })(),

    getProductByNameAndCatagory: (() => {
        var _ref13 = _asyncToGenerator(function* (productDetails) {
            return productModel.findOne({ 'name': productDetails.name, 'category': productDetails.category });
        });

        return function getProductByNameAndCatagory(_x11) {
            return _ref13.apply(this, arguments);
        };
    })(),

    addEncouragement: function (Encouragement) {
        Encouragement.save();
    },

    editEncouragement: (() => {
        var _ref14 = _asyncToGenerator(function* (EncouragementDetails) {
            return encouragementModel.update({ '_id': mongoose.Types.ObjectId(productDetails._id) }, EncouragementDetails, { upsert: true });
        });

        return function editEncouragement(_x12) {
            return _ref14.apply(this, arguments);
        };
    })(),

    deleteEncouragement: (() => {
        var _ref15 = _asyncToGenerator(function* (EncouragementDetails) {
            return encouragementModel.remove({ '_id': mongoose.Types.ObjectId(EncouragementDetails._id) });
        });

        return function deleteEncouragement(_x13) {
            return _ref15.apply(this, arguments);
        };
    })(),

    getAllEncouragements: (() => {
        var _ref16 = _asyncToGenerator(function* () {
            return encouragementModel.find({});
        });

        return function getAllEncouragements() {
            return _ref16.apply(this, arguments);
        };
    })(),

    getProductsById: (() => {
        var _ref17 = _asyncToGenerator(function* (encouragementDetails) {
            var products = encouragementDetails.products.map(function (x) {
                return mongoose.Types.ObjectId(x);
            });
            return productModel.find({ '_id': { $in: products } });
        });

        return function getProductsById(_x14) {
            return _ref17.apply(this, arguments);
        };
    })(),

    dropDb: function (cb) {
        mongoose.collection.remove({}, cb);
    }
};