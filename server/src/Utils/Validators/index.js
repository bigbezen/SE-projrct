var checkParams = function(params, param_arr, type_arr){
    for(var i=0; i<param_arr.length; i++){
        if(!(param_arr[i] in params && typeof(params[param_arr[i]]) == type_arr[i]))
            return false;
        if(type_arr[i] == 'string' && param_arr[i] == "")
            return false;
    }
    return true;
};


module.exports = {


    login: function(params){
        return checkParams(params, ['username', 'password'],
            ['string', 'string']);
    },

    sessionId: function(params){
        return checkParams(params, ['sessionId'], ['string']);
    },

    changePassword: function(params){
        return checkParams(params, ['sessionId', 'newPass', 'oldPass'],
            ['string', 'string', 'string']);
    },

    addUser: function(params){
        return checkParams(params, ['sessionId', 'userDetails'],
                    ['string', 'object']) &&
                checkParams(params.userDetails, ['username', 'password', 'startDate', 'personal', 'contact', 'jobDetails'],
                    ['string', 'string', 'string', 'object', 'object', 'object',]) &&
                checkParams(params.userDetails.personal, ['id', 'firstName', 'lastName', 'sex', 'birthday'],
                    ['string', 'string', 'string', 'string', 'string']) &&
                checkParams(params.userDetails.contact, ['address', 'phone', 'email'],
                    ['object', 'string', 'string',]) &&
                checkParams(params.userDetails.contact.address, ['street', 'number', 'city', 'zip'],
                    ['string', 'string', 'string', 'string',]) &&
                checkParams(params.userDetails.jobDetails, ['userType'],
                    ['string']);
    },

    editUser: function(params){
        return checkParams(params, ['sessionId', 'username', 'userDetails'],
                ['string', 'string', 'object']) &&
            checkParams(params.userDetails, ['username', 'startDate', 'personal', 'contact', 'jobDetails'],
                ['string', 'string', 'object', 'object', 'object',]) &&
            checkParams(params.userDetails.personal, ['id', 'firstName', 'lastName', 'sex', 'birthday'],
                ['string', 'string', 'string', 'string', 'string']) &&
            checkParams(params.userDetails.contact, ['address', 'phone', 'email'],
                ['object', 'string', 'string',]) &&
            checkParams(params.userDetails.contact.address, ['street', 'number', 'city', 'zip'],
                ['string', 'string', 'string', 'string',]) &&
            checkParams(params.userDetails.jobDetails, ['userType'],
                ['string']);
    },

    deleteUser: function(params){
        return checkParams(params, ['sessionId', 'username'],
            ['string', 'string']);
    },

    addOrEditOrDeleteStore: function(params){
        return checkParams(params, ['sessionId', 'storeDetails'],
            ['string', 'object']) &&
            checkParams(params.storeDetails, ['name', 'managerName', 'phone', 'city', 'address', 'area', 'channel'],
                ['string', 'string', 'string', 'string', 'string', 'string', 'string']);
    },

    deleteStore: function(params){
        return checkParams(params, ['sessionId', 'storeId'],
            ['string', 'string']);
    },

    addOrEditProduct: function(params){
        return checkParams(params, ['sessionId', 'productDetails'],
                ['string', 'object']) &&
                checkParams(params.productDetails, ['name', 'retailPrice', 'salePrice', 'category', 'subCategory', 'minRequiredAmount', 'notifyManager'],
                    ['string', 'Number', 'Number', 'string', 'string', 'Number', 'boolean']);
    },

    deleteProduct: function(params){
        return checkParams(params, ['sessionId', 'productId'],
            ['string', 'string']);
    },

    addOrEditEncouragement: function(params){
        return checkParams(params, ['sessionId', 'encouragementDetails'],
                ['string', 'object']) &&
            checkParams(params.encouragementDetails, ['active', 'numOfProducts', 'rate', 'products'],
                ['boolean', 'Number', 'Number', 'object']);
    },

    deleteEncouragement: function(params){
        return checkParams(params, ['sessionId', 'encuragementId'], ['string', 'string']);
    },

    sendBroadcastMessage: function(params){
        return checkParams(params, ['sessionId', 'content', 'date'], ['string', 'string', 'string'])
    },

    addOrPublishShifts: function(params){
        var res = checkParams(params, ['sessionId', 'shiftsArr'], ['string', 'object']);
        for(shift of params.shiftsArr){
            if(res)
                res = res && checkParams(shift, ['storeId', 'startTime', 'endTime', 'type'], ['string', 'string', 'string', 'string'])
        }
        return res;
    },

    startOrEndShift: function(params){

    },

    reportSaleOrOpened: function(params){

    }



};