var logger          = require('../../Utils/Logger/logger');
var productModel    = require('../../Models/product')
var dal             = require('../../DAL/dal');
var permissions     = require('../permissions/index');


var addProduct = function(sessionId, productDetails,cb) {
    permissions.validatePermissionForSessionId(sessionId, 'addProduct', function (err, user) {
        if(user != null){
            var product = new productModel();
            product.name = productDetails.name;
            product.retailPrice = productDetails.retailPrice;
            product.salePrice = productDetails.salePrice;
            product.category = productDetails.category;
            product.subCategory = productDetails.subCategory;
            product.minRequiredAmount = productDetails.minRequiredAmount;
            product.notifyManager = productDetails.notifyManager;
            dal.addProduct(product);
            cb(null, product);
        }
        else {
            cb(err, null);
        }
    });
};

var editProduct = function (sessionId, productDetails, cb) {
    permissions.validatePermissionForSessionId(sessionId, 'editProduct',function (err, user) {
        if(user != null){
            dal.editProduct(productDetails, cb);
        }
        else{
            cb(err)
        }
    });
};

var deleteProduct = function(sessionId, productDetails, cb){
    permissions.validatePermissionForSessionId(sessionId, 'deleteProduct',function (err, user) {
        if(user != null){
            dal.deleteProduct(productDetails, cb)
        }
        else{
            cb(err)
        }
    });
};

var getAllProduct = function(sessionId, cb){
    permissions.validatePermissionForSessionId(sessionId, 'getAllProducts',function (err, user) {
        if(user != null){
            dal.getAllProducts(cb)
        }
        else{
            cb(err, null)
        }
    });
};

module.exports.addProduct = addProduct;
module.exports.editProduct = editProduct;
module.exports.deleteProduct = deleteProduct;
module.exports.getAllProducts = getAllProduct;


