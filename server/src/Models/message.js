var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var messageSchema = new Schema({
    'type': String,
    'sender': String,
    'content': String,
    'date': Date,
});

var message = mongoose.model('message', messageSchema);

module.exports = message;