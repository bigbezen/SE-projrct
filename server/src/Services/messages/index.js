var logger          = require('../../Utils/Logger/logger');
var dal             = require('../../DAL/dal');
var permissions     = require('../permissions/index');

var messageModel       = require('../../Models/message');


var sendBroadcast = async function(sessionId, content, date){
    logger.info('Services.messages.index.sendBroadcast', {'sessionId': sessionId});

    var sender = await permissions.validatePermissionForSessionId(sessionId, 'sendBroadcast');
    if(sender == null)
        return {'code': 401, 'err': 'user not authorized'};

    var msg = new messageModel();
    msg.sender = sender.username;
    msg.content = content;
    msg.type = 'broadcast';
    msg.date = new Date(date);


    var res = await dal.sendBroadcast(msg);
    if (res != null)
        return {'code':200};
    else
        return {'code': 500, 'err': 'could not send broadcast message'};




};

//var createInbox = async function()

var markAsRead = async function(){


};

var getInbox = async function(sessionId){
    logger.info('Services.messages.index.getInboxt', {'sessionId': sessionId});

    var user = await permissions.validatePermissionForSessionId(sessionId, 'getInbox');
    if(user == null)
        return {'code': 401, 'err': 'user not authorized'};

    var inbox = await dal.getInbox(user._id);
    if(inbox != null)
        return {'code': 200, 'inbox': inbox.messages};
    else
        return {'code': 500, 'err': 'could not get user inbox'};
};

module.exports.sendBroadcast = sendBroadcast;
module.exports.getInbox = getInbox;