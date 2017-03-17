let logger          = require('../../Utils/Logger/logger');
let dal             = require('../../DAL/dal');
let permissions     = require('../permissions/index');

let messageModel       = require('../../Models/message');


let sendBroadcast = async function(sessionId, content, date){
    logger.info('Services.messages.index.sendBroadcast', {'sessionId': sessionId});

    let sender = await permissions.validatePermissionForSessionId(sessionId, 'sendBroadcast');
    if(sender == null)
        return {'code': 401, 'err': 'user not authorized'};

    let msg = new messageModel();
    msg.sender = sender.username;
    msg.content = content;
    msg.type = 'broadcast';
    msg.date = date;


    let res = await dal.sendBroadcast(msg);
    if (res != null)
        return {'code':200};
    else
        return {'code': 500, 'err': 'could not send broadcast message'};
};


let markAsRead = async function(sessionId){
    logger.info('Services.messages.index.markAsRead', {'sessionId': sessionId});

    let user = await permissions.validatePermissionForSessionId(sessionId, 'getInbox');
    if(user == null)
        return {'code': 401, 'err': 'user not authorized'};
    let result = await dal.markMessagesAsRead(user._id);
    if(result != null)
        return {'code': 200};
    else
        return {'code': 500};

};

let getInbox = async function(sessionId){
    logger.info('Services.messages.index.getInboxt', {'sessionId': sessionId});

    let user = await permissions.validatePermissionForSessionId(sessionId, 'getInbox');
    if(user == null)
        return {'code': 401, 'err': 'user not authorized'};

    let messagesIds = user.inbox.toObject();
    let inbox = await dal.getMessages(messagesIds);
    inbox = inbox.map(x => x.toObject());
    return {'code': 200, 'inbox': inbox};
};

module.exports.sendBroadcast = sendBroadcast;
module.exports.getInbox = getInbox;
module.exports.markAsRead = markAsRead;