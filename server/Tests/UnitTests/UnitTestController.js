var userUnitTest = require('./userUnitTest.js');
var storeUnitTest = require('./storeUnitTest.js');
var shiftUnitTest = require('./shiftUnitTest.js');
var reportsUnitTest = require('./reportsUnitTest.js');
var recommendationUnitTest = require('./recommendationUnitTest.js');
var productUnitTest = require('./productUnitTest.js');
var notificationsUnitTest = require('./notificationsUnitTest.js');
var messagesUnitTest = require('./messagesUnitTest.js');
var encouragementsUnitTest = require('./encouragementsUnitTest.js');

var mongoose = require('mongoose');

_connectToTestDb();



function _connectToTestDb(){
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/UnitTestDb');
    var db = mongoose.connection;
    db.on('error', function(){
        console.error.bind(console, 'connection error:');
        throw 'Cant connect to testing DB...';
    });
    db.once('open', function() {
        console.log('connected to testing db successfuly');
    });
}