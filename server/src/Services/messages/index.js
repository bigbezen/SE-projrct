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
    msg.date = date;


    var res = await dal.sendBroadcast(msg);
    if (res != null)
        return {'code':200};
    else
        return {'code': 500, 'err': 'could not send broadcast message'};
};


var markAsRead = async function(sessionId){
    logger.info('Services.messages.index.markAsRead', {'sessionId': sessionId});

    var user = await permissions.validatePermissionForSessionId(sessionId, 'getInbox');
    if(user == null)
        return {'code': 401, 'err': 'user not authorized'};
    var result = await dal.markMessagesAsRead(user._id);
    if(result != null)
        return {'code': 200};
    else
        return {'code': 500};

};

var getInbox = async function(sessionId){
    logger.info('Services.messages.index.getInboxt', {'sessionId': sessionId});

    var user = await permissions.validatePermissionForSessionId(sessionId, 'getInbox');
    if(user == null)
        return {'code': 401, 'err': 'user not authorized'};

    var messagesIds = user.inbox.toObject();
    var inbox = await dal.getMessages(messagesIds);
    inbox = inbox.map(x => x.toObject());
    return {'code': 200, 'inbox': inbox};
};

module.exports.sendBroadcast = sendBroadcast;
module.exports.getInbox = getInbox;
module.exports.markAsRead = markAsRead;