var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var userSchema = new Schema({
    'username': String,
    'password': String,
    'sessionId': String,
    'startDate': Date,
    'endDate': Date,
    'personal': {
        'id': String,
        'firstName': String,
        'lastName': String,
        'sex': String,
        'birtday': Date
    },
    'contact': {
        'address': {
            'street': String,
            'number': String,
            'city': String,
            'zip': String
        },
        'phone': String,
        'email': String
    },
    'jobDetails': {
        'userType': String,
        'area': String,
        'channel': String,
        'encouragements': [
            {type: mongoose.Schema.Types.ObjectId, ref: 'encouragements'}
        ]
    },
    'inbox': [
        {
            'type': String,
            'sender': String,
            'content': String,
            'date': Date,
            'read': Boolean
        }
    ]
});

var user = mongoose.model('user', userSchema);

module.exports = user;