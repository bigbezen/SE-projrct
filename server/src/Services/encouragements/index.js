"use strict"

let logger                  = require('../../Utils/Logger/logger');
let encouragementModel      = require('../../Models/encouragement');
let dal                     = require('../../DAL/dal');
let permissions             = require('../permissions/index');

let underscore              = require('underscore');

let addEncouragement = async function(sessionId, encouragementDetails) {
    logger.info('Services.Encouragement.index.addEncouragement', {'session-id': sessionId});
    let user = await permissions.validatePermissionForSessionId(sessionId, 'addEncouragement');
    //check if to user have the permissions
    if(user != null) {
        let encouragement = new encouragementModel();
        encouragement.name = encouragementDetails.name;
        encouragement.active = encouragementDetails.active;
        encouragement.numOfProducts = encouragementDetails.numOfProducts;
        encouragement.rate = encouragementDetails.rate;

        //check if all the products id belongs to products
        for (let i = 0; i < encouragementDetails.products.length; i++) {
           let exist = await dal.getProductById(encouragementDetails.products[i]);
           if(exist == null){
               return {'encouragement': null, 'code': 404, 'err': 'product not found'};
           }
        }

        //create id object from the string id
        let products = await dal.getProductsById(encouragementDetails);
        encouragement.products = products;

        let res = await dal.addEncouragement(encouragement);
        return {'encouragement': encouragement, 'code': 200, 'err': null};
    }
    else{
        return {'encouragement': null, 'code': 401, 'err': 'permission denied'};
    }
};

let editEncouragement = async function (sessionId, encouragementDetails) {
    logger.info('Services.Encouragement.index.editEncouragement', {'session-id': sessionId});
    let user = await permissions.validatePermissionForSessionId(sessionId, 'editEncouragement');
    if(user == null)
        return {'encouragement': null, 'code': 401, 'err': 'permission denied'};

    //check if all the products id belongs to products
    for (let i = 0; i < encouragementDetails.products.length; i++) {
        let exist = await dal.getProductById(encouragementDetails.products[i]);
        if(exist == null){
            return {'encouragement': null, 'code': 404, 'err': 'product not found'};
        }
    }

    let res =  await dal.editEncouragement(encouragementDetails);
    if (res.ok == 0 || res.nModified == 0)
        return {'encouragement': res, 'code': 400, 'err': 'cannot edit this encouragement'};

    return {'encouragement': res, 'code': 200, 'err': null};
};

let deleteEncouragement = async function (sessionId, encouragementId) {
    logger.info('Services.Encouragement.index.deleteEncouragement', {'session-id': sessionId});
    let user = await permissions.validatePermissionForSessionId(sessionId, 'deleteEncouragement');
    if(user != null){
        let encouragement =  await dal.deleteEncouragement(encouragementId);
        return {'encouragement': encouragement, 'code': 200, 'err': null};
    }else{
        return {'encouragement': null, 'code': 401, 'err': 'permission denied'}
    }
};

let getAllEncouragements = async function (sessionId) {
    logger.info('Services.Encouragement.index.getAllEncouragements', {'session-id': sessionId});
    let user = await permissions.validatePermissionForSessionId(sessionId, 'getAllEncouragements');
    if(user != null) {
        let encouragements =  await dal.getAllEncouragements();
        return {'encouragements': encouragements, 'code': 200, 'err': null};
    }
    else {
        return {'encouragements': null, 'code': 401, 'err': 'permission denied'};
    }
};

let getEncouragement = async function(sessionId, encouragementId){
    logger.info('Services.Encouragement.index.getEncouragement', {'session-id': sessionId});
    let user = await permissions.validatePermissionForSessionId(sessionId, 'getEncouragement');
    if(user == null)
        return {'code': 401, 'err': 'permission denied'};
    let encouragement = await dal.getEncouragement(encouragementId);
    if(encouragement == null)
        return {'code': 409, 'err': 'no such encouragement'};
    return {'code': 200, 'encouragement': encouragement};
};

let calculateEncouragements = async function(saleReport){
    logger.info('Services.Encouragement.index.calculateEncouragements');

    let encouragements = await dal.getAllEncouragements();
    if(encouragements.length == 0 || saleReport.length == 0)
        return [];

    encouragements = encouragements.map(function(x){
        x = x.toObject();
        x.products = x.products.map(y => y.toString());
        return x;
    });
    encouragements = encouragements.sort(function(a, b){
        return b.numOfProducts - a.numOfProducts;
    });

    let earnedEncs = [];

    let soldProductsIds = saleReport.filter(x => x.sold > 0).map(x => x.productId.toString());
    for(let enc of encouragements){
        // check for encouragements "baskets"
        if(enc.products.length > 1 && enc.products.length <= soldProductsIds.length){
            if(underscore.intersection(enc.products, soldProductsIds).length == enc.products.length)
                earnedEncs.push({'enc': enc, 'num': 1});
        }
        // check for other encouragements
        else if(enc.products.length == 1){
            for(let product of saleReport){
                if(product.productId.toString() == enc.products[0]){
                    // mul is the number of times the salesman has gained the current encouragement
                    let mul = product.sold / enc.numOfProducts;
                    product.sold -= (mul * enc.numOfProducts);
                    // will not add encouragement if mul == 0
                    if(mul > 0)
                        earnedEncs.push({'enc': enc, 'num': mul});
                }
            }
        }
    }

    return earnedEncs;

};

module.exports.addEncouragement = addEncouragement;
module.exports.editEncouragement = editEncouragement;
module.exports.deleteEncouragement = deleteEncouragement;
module.exports.getAllEncouragements = getAllEncouragements;
module.exports.calculateEncouragements = calculateEncouragements;
module.exports.getEncouragement = getEncouragement;









