"use strict";

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
        encouragement.name = encouragementDetails.name;
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

    let encExists = await dal.getEncouragement(encouragementDetails._id);
    if(!encExists){
        return {code: 400, err: 'encouragement does not exist'};
    }
    //check if all the products id belongs to products
    for (let i = 0; i < encouragementDetails.products.length; i++) {
        let exist = await dal.getProductById(encouragementDetails.products[i]);
        if(exist == null){
            return {'encouragement': null, 'code': 404, 'err': 'product not found'};
        }
    }

    let res =  await dal.editEncouragement(encouragementDetails);
    if (res.ok != 1)
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
        for(let encIndex in encouragements){
            encouragements[encIndex].products = await dal.getProductsById(encouragements[encIndex]);
        }
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

let calculateEncouragements = async function(salesReport){
    logger.info('Services.Encouragement.index.calculateEncouragements');

    let encouragements = await dal.getAllEncouragements();
    if(encouragements.length == 0 || salesReport.length == 0)
        return [];
    encouragements = encouragements
        .sort((enc1, enc2) => enc2.numOfProducts - enc1.numOfProducts)
        .map(function(x){
            x = x.toObject();
            x.products = x.products.map(y => y.toString());
            return x;
    });

    let earnedEncs = [];

    for(let enc of encouragements){
        var prodsInEnc = salesReport
            .filter(function(product){
            return ( underscore.contains(enc.products, product.productId.toString()));
        });
        let totalSold = prodsInEnc
            .map(function(product) {
            return product.sold;
        }).reduce((sold1, sold2) => sold1 + sold2, 0);

        var numOfAchivedEnc = parseInt(totalSold / enc.numOfProducts);
        if (numOfAchivedEnc > 0){
            earnedEncs.push({
                'encouragement': enc._id,
                'count': numOfAchivedEnc
            });

            let numOfProductsToReduce = numOfAchivedEnc * enc.numOfProducts;
            for(let prod of prodsInEnc) {
                if(numOfProductsToReduce > 0 && prod.sold > 0) {
                    let amountToReduce = (numOfProductsToReduce > prod.sold) ? prod.sold : numOfProductsToReduce;
                    prod.sold -= amountToReduce;
                    numOfProductsToReduce -= amountToReduce;
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









