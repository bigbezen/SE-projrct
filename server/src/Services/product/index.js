var logger          = require('../../Utils/Logger/logger');
var productModel    = require('../../Models/product')
var dal             = require('../../DAL/dal');
var permissions     = require('../permissions/index');


var addProduct = async function(sessionId, productDetails) {
    logger.info('Services.product.index.addProduct', {'session-id': sessionId});
    var user = await permissions.validatePermissionForSessionId(sessionId, 'addProduct');
    if(user != null){
        var product = await dal.getProductByNameAndCatagory(productDetails.name, productDetails.category);
        //check if the store existing
        if(product == null){
            var product = new productModel();
            product.name = productDetails.name;
            product.retailPrice = productDetails.retailPrice;
            product.salePrice = productDetails.salePrice;
            product.category = productDetails.category;
            product.subCategory = productDetails.subCategory;
            product.minRequiredAmount = productDetails.minRequiredAmount;
            product.notifyManager = productDetails.notifyManager;
            var res = await dal.addProduct(product);
            return {'product': product, 'code': 200, 'err': null};
        }
        else{
            return {'product': null, 'code': 409, 'err': 'product already exist'};
        }
    }
    else {
        return {'product': null, 'code': 401, 'err': 'permission denied'};
    }
};

var editProduct = async function (sessionId, productDetails) {
    logger.info('Services.product.index.editProduct', {'session-id': sessionId});
    var user = await permissions.validatePermissionForSessionId(sessionId, 'editProduct');
    if(user != null){
        var product = await dal.editProduct(productDetails);
        return {'product': product, 'code':200, 'err': null};
    }
    else{
        return {'product': null, 'code': 401, 'err': 'permission denied'};
    }
};

var deleteProduct = async function(sessionId, ProductId){
    logger.info('Services.product.index.deleteProduct', {'session-id': sessionId});
    var user = await permissions.validatePermissionForSessionId(sessionId, 'deleteProduct');
    if(user != null){
        var product = await dal.deleteProduct(ProductId);
        return {'product': product, 'code':200, 'err': null};
    }
    else {
        return {'product': null, 'code': 401, 'err': 'permission denied'};
    }
};

var getAllProducts = async function(sessionId){
    logger.info('Services.product.index.getAllProduct', {'session-id': sessionId});
    var user = await permissions.validatePermissionForSessionId(sessionId, 'getAllProducts');
    if(user != null) {
        var products =  await dal.getAllProducts();
        return {'products': products, 'code': 200, 'err': null};
    }
    else {
        return {'products': null, 'code': 401, 'err': 'permission denied'};;
    }
};

module.exports.addProduct = addProduct;
module.exports.editProduct = editProduct;
module.exports.deleteProduct = deleteProduct;
module.exports.getAllProducts = getAllProducts;


