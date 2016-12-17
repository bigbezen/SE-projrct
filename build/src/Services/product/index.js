function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var logger = require('../../Utils/Logger/logger');
var productModel = require('../../Models/product');
var dal = require('../../DAL/dal');
var permissions = require('../permissions/index');

var addProduct = (() => {
    var _ref = _asyncToGenerator(function* (sessionId, productDetails) {
        logger.info('Services.product.index.addProduct', { 'session-id': sessionId });
        var user = yield permissions.validatePermissionForSessionId(sessionId, 'addProduct');
        if (user != null) {
            var product = yield dal.getProductByNameAndCatagory(productDetails);
            //check if the store existing
            if (product == null) {
                var product = new productModel();
                product.name = productDetails.name;
                product.retailPrice = productDetails.retailPrice;
                product.salePrice = productDetails.salePrice;
                product.category = productDetails.category;
                product.subCategory = productDetails.subCategory;
                product.minRequiredAmount = productDetails.minRequiredAmount;
                product.notifyManager = productDetails.notifyManager;
                dal.addProduct(product);
                return { 'product': product, 'code': 200, 'err': null };
            } else {
                return { 'product': null, 'code': 409, 'err': null };
            }
        } else {
            return { 'product': null, 'code': 401, 'err': 'permission denied' };
        }
    });

    return function addProduct(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

var editProduct = (() => {
    var _ref2 = _asyncToGenerator(function* (sessionId, productDetails) {
        logger.info('Services.product.index.editProduct', { 'session-id': sessionId });
        var user = permissions.validatePermissionForSessionId(sessionId, 'editProduct');
        if (user != null) {
            var product = yield dal.editProduct(productDetails);
            return { 'product': product, 'code': 200, 'err': null };
        } else {
            return { 'product': null, 'code': 401, 'err': 'permission denied' };
        }
    });

    return function editProduct(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
})();

var deleteProduct = (() => {
    var _ref3 = _asyncToGenerator(function* (sessionId, productDetails) {
        logger.info('Services.product.index.deleteProduct', { 'session-id': sessionId });
        var user = yield permissions.validatePermissionForSessionId(sessionId, 'deleteProduct');
        if (user != null) {
            var product = yield dal.deleteProduct(productDetails);
            return { 'product': product, 'code': 200, 'err': null };
        } else {
            return { 'product': null, 'code': 401, 'err': 'permission denied' };
        }
    });

    return function deleteProduct(_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
})();

var getAllProducts = (() => {
    var _ref4 = _asyncToGenerator(function* (sessionId) {
        logger.info('Services.product.index.getAllProduct', { 'session-id': sessionId });
        var user = yield permissions.validatePermissionForSessionId(sessionId, 'getAllProducts');
        if (user != null) {
            var products = yield dal.getAllProducts();
            return { 'products': products, 'code': 200, 'err': null };
        } else {
            return { 'products': null, 'code': 401, 'err': 'permission denied' };;
        }
    });

    return function getAllProducts(_x7) {
        return _ref4.apply(this, arguments);
    };
})();

module.exports.addProduct = addProduct;
module.exports.editProduct = editProduct;
module.exports.deleteProduct = deleteProduct;
module.exports.getAllProducts = getAllProducts;