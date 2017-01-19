"use strict"

let logger          = require('../../Utils/Logger/logger');
let productModel    = require('../../Models/product');
let dal             = require('../../DAL/dal');
let permissions     = require('../permissions/index');


let addProduct = async function(sessionId, productDetails) {
    logger.info('Services.product.index.addProduct', {'session-id': sessionId});
    let user = await permissions.validatePermissionForSessionId(sessionId, 'addProduct');
    if(user != null){
        let product = await dal.getProductByNameAndCatagory(productDetails.name, productDetails.category);
        //check if the store existing
        if(product == null){
            let product = new productModel();
            product.name = productDetails.name;
            product.retailPrice = productDetails.retailPrice;
            product.salePrice = productDetails.salePrice;
            product.category = productDetails.category;
            product.subCategory = productDetails.subCategory;
            product.minRequiredAmount = productDetails.minRequiredAmount;
            product.notifyManager = productDetails.notifyManager;
            let res = await dal.addProduct(product);
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

let editProduct = async function (sessionId, productDetails) {
    logger.info('Services.product.index.editProduct', {'session-id': sessionId});
    let user = await permissions.validatePermissionForSessionId(sessionId, 'editProduct');
    if(user != null){
        let product = await dal.editProduct(productDetails);
        return {'product': product, 'code':200, 'err': null};
    }
    else{
        return {'product': null, 'code': 401, 'err': 'permission denied'};
    }
};

let deleteProduct = async function(sessionId, ProductId){
    logger.info('Services.product.index.deleteProduct', {'session-id': sessionId});
    let user = await permissions.validatePermissionForSessionId(sessionId, 'deleteProduct');
    if(user != null){
        let product = await dal.deleteProduct(ProductId);
        return {'product': product, 'code':200, 'err': null};
    }
    else {
        return {'product': null, 'code': 401, 'err': 'permission denied'};
    }
};

let getAllProducts = async function(sessionId){
    logger.info('Services.product.index.getAllProduct', {'session-id': sessionId});
    let user = await permissions.validatePermissionForSessionId(sessionId, 'getAllProducts');
    if(user != null) {
        let products =  await dal.getAllProducts();
        return {'products': products, 'code': 200, 'err': null};
    }
    else {
        return {'products': null, 'code': 401, 'err': 'permission denied'};;
    }
};

let getProduct = async function(sessionId, productId){
    logger.info('Services.Encouragement.index.getEncouragement', {'session-id': sessionId});
    let user = await permissions.validatePermissionForSessionId(sessionId, 'getProduct');
    if(user == null)
        return {'code': 401, 'err': 'permission denied'};
    let product = await dal.getProductById(productId);
    if(product == null)
        return {'code': 409, 'err': 'no such product'};
    return {'code': 200, 'product': product.toObject()};
};

module.exports.addProduct = addProduct;
module.exports.editProduct = editProduct;
module.exports.deleteProduct = deleteProduct;
module.exports.getAllProducts = getAllProducts;
module.exports.getProduct = getProduct;


