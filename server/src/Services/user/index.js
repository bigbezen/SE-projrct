let logger          = require('../../Utils/Logger/logger');
let mailer          = require('../../Utils/Mailer/index');
let cypher          = require('../../Utils/Cypher/index');
let dal             = require('../../DAL/dal');
let permissions     = require('../permissions/index');

let userModel       = require('../../Models/user');
let inboxModel      = require('../../Models/message');

let hashGenerator   = require('hash-generator');


let setAdminUser = async function(){
    let user = new userModel();
    user.username = 'admin';
    user.password = cypher.encrypt("admin");
    user.startDate = "09-16-2016";
    user.endDate = null;
    user.personal = {
        "id": "0987654321",
        "firstName": "israel",
        "lastName": "israeli",
        "sex": "male",
        "birthday": "01-01-1999"
    };
    user.contact = {
        "address": {
            "street": "st",
            "number": "100",
            "city": "some city",
            "zip": "11111"
        },
        "phone": "054-9999999",
        "email": "w@gmail.com"
    };
    user.jobDetails = {
        "userType": "manager",
        "area": "south",
        "channel": "spirit",
        "encouragements": []
    };


    let isExistUsername = await dal.getUserByUsername("admin");
    let res = null;
    if(isExistUsername == null){
        res = await dal.addUser(user);
        console.log('admin user is now set...');
    }
    else{
        console.log('admin user is already set...');
    }
    return res;
};

let login = async function(username, password){
    logger.info('Services.user.index.login', {'username': username});
    let user = await dal.getUserByUsername(username);

    if(user != null && cypher.decrypt(user.password) == password){
        let newSessionId = await _generateSessionId();
        user.sessionId = newSessionId;
        let res = await dal.editUser(user);
        if(res != null)
            return {'sessionId': newSessionId, 'userType': user.jobDetails.userType};
        else
            return {'code': '500', 'err': 'something went wrong'};
    }
    else{
        return {'code': 409, 'err': 'error while logging in'};
    }
};

let logout = async function(sessionId) {
    logger.info('Services.user.index.logout', {'session-id': sessionId});
    let user = await dal.getUserBySessionId(sessionId);
    if(user == null){
        return {'code': 401, 'err': 'user is not logged in'};
    }

    user.sessionId = undefined;
    let res = await dal.editUser(user);
    if(res != null)
        return {'code': 200};
    else
        return {'code': 500, 'err': 'something went wrong'};
};

let addUser = async function(sessionId, userDetails) {
    logger.info('Services.user.index.addUser', {'session-id': sessionId});
    let isAuthorized = await permissions.validatePermissionForSessionId(sessionId, 'addUser');
    if(isAuthorized == null)
        return {'code': 401, 'err': 'user not authorized'};

    let isExistUsername = await dal.getUserByUsername(userDetails.username);
    let isExistId = await dal.getUserById(userDetails.personal.id);
    if(isExistUsername != null || isExistId != null){
        return {'code': 409, 'err': 'Username or Id already exists'}
    }

    let newUser = new userModel();
    let generatedPassword = Math.random().toString(36).substring(2,10);
    newUser.username = userDetails.username;
    newUser.password =  cypher.encrypt(generatedPassword);
    newUser.startDate = new Date(userDetails.startDate);
    newUser.endDate = userDetails.endDate;
    newUser.personal = userDetails.personal;
    newUser.contact = userDetails.contact;
    newUser.jobDetails = userDetails.jobDetails;
    newUser.inbox = [];
    let res = await dal.addUser(newUser);
    if(res != null){
        newUser = newUser.toObject();
        let content = 'ברוכים הבאים\nהנה פרטי ההתחברות שלך לאפליקציה\n\nשם משתמש: ' + newUser.username;
        content += '\n\n' + 'סיסמא: ' + cypher.decrypt(newUser.password);
        mailer.sendMail([newUser.contact.email], 'Welcome To IBBLS', content);
        delete newUser.password;
        return {'code': 200, 'user': newUser};
    }
    else{
        return {'code': 500, 'err': 'could not insert user to database'};
    }
};

let editUser = async function(sessionId, username, userDetails){
    logger.info('Services.user.index.editUser', {'sessionId': sessionId});

    let isAuthorized = await permissions.validatePermissionForSessionId(sessionId, 'editUser', null);
    if(isAuthorized == null)
        return {'code': 401, 'err': 'user not authorized'};

    let user = await dal.getUserByUsername(username);
    if(user == null) {
        return {'code': 409, 'err': 'edited user does not exist'};
    }
    user = user.toObject();
    if(userDetails.username != user.username) {
        let isExistUsername = await dal.getUserByUsername(userDetails.username);
        if (isExistUsername != null) {
            return {'code': 409, 'err': 'Username already exists'}
        }
    }
    if(userDetails.personal.id != user.personal.id){
        let isExistId = await dal.getUserById(userDetails.personal.id);
        if(isExistId != null){
            return {'code': 409, 'err': 'Id already exists'}
        }
    }

    userDetails._id = user._id;
    let res = await dal.updateUser(userDetails);
    if(res.ok == 1){
        return {'code': 200};
    }
    else{
        return {'code': 500, 'err': 'could not insert user to database'};
    }
};

let deleteUser = async function(sessionId, username) {
    let isAuthorized = await permissions.validatePermissionForSessionId(sessionId, 'editUser', null);
    if (isAuthorized == null)
        return {'code': 401, 'err': 'user not authorized'};

    let user = await dal.getUserByUsername(username);
    if (user == null)
        return {'code': 409, 'err': 'problem occurred with one of the parameters'};

    let res = await dal.deleteUser(username);
    //TODO: check return value of remove from mongo
    return {'code': 200};
};

let changePassword = async function(sessionId, oldPass, newPass) {
    logger.info('Services.user.index.changePassword', {'session-id': sessionId});

    let user = await dal.getUserBySessionId(sessionId);
    if(user == null){
        return {'code': 401, 'err': 'unauthorized request'};
    }

    if(user.password != cypher.encrypt(oldPass)){
        return {'code': 409, 'err': 'problem occurred with one of the parameters'};
    }

    user.password = cypher.encrypt(newPass);
    let res = await dal.editUser(user);
    if(res != null)
        return {'code': 200};
    else
        return {'code': 500, 'err': 'something went wrong'};
};

let retrievePassword = async function(sessionId) {
    logger.info('Services.user.index.retrievePassword', {'sessionId': sessionId});
    let user = await dal.getUserBySessionId(sessionId);
    if(user == null)
        return {'code': 401, 'err': 'user is not logged in'};

    if (mailer.sendMail([user.contact.email], mailer.subjects.retrievePassword,
            'Your password is: ' + cypher.decrypt(user.password)))
        return {'code': 200};
    else
        return {'code': 500, 'err': 'failed sending email'};


};

let getProfile = async function(sessionId) {
    logger.info('Services.user.index.getProfile', {'sessionId': sessionId});
    let user = await dal.getUserBySessionId(sessionId);
    if(user == null){
        return {'code': 401, 'err': 'user is not logged in'};
    }

    user = user.toObject();
    delete user.password;
    delete user.sessionId;
    return {'code': 200, 'user': user};
};

let getAllUsers = async function(sessionId){
    logger.info('Services.user.index.getAllUsers', {'sessionId': sessionId});
    let isAuthorized = await permissions.validatePermissionForSessionId(sessionId, 'getAllUsers', null);
    if(isAuthorized == null)
        return {'code': 401, 'err': 'user not authorized'};

    let users = await dal.getAllUsers();
    if(users != null) {
        let usersAsObjects = [];
        for(let user of users){
            user = user.toObject();
            delete user.password;
            delete user.sessionId;
            usersAsObjects.push(user);
        }
        return {'code': 200, 'users': usersAsObjects};
    }
    else
        return {'code': 500, 'err': 'something went wrong'};
};

let _generateSessionId = async function() {
    let isDuplicateSessionId = true;
    let sessionId, isIdInUse;
    while(isDuplicateSessionId){
        sessionId = hashGenerator(128);
        isIdInUse = await dal.getUserBySessionId(sessionId);
        if(isIdInUse == null){
            isDuplicateSessionId = false;
        }
    }
    return sessionId;
};


module.exports.login = login;
module.exports.logout = logout;
module.exports.addUser = addUser;
module.exports.editUser = editUser;
module.exports.deleteUser = deleteUser;
module.exports.changePassword = changePassword;
module.exports.getProfile = getProfile;
module.exports.retrievePassword = retrievePassword;
module.exports.getAllUsers = getAllUsers;
module.exports.setAdminUser = setAdminUser;