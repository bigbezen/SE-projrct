var checkParams = function(params, param_arr, type_arr){
    for(var i=0; i<param_arr.length; i++){
        if(!(param_arr[i] in params && typeof(params[param_arr[i]]) == type_arr[i]))
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

    deleteUser: function(params){
        return checkParams(params, ['sessionId', 'username'],
            ['string', 'string']);
    }



};