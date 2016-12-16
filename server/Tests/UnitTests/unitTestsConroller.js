var userUnitTest            = require( './userUnitTest.js');
var storeUnitTest           = require( './storeUnitTest.js');
var shiftUnitTest           = require( './shiftUnitTest.js');
var reportsUnitTest         = require( './reportsUnitTest.js');
var recommendationUnitTest  = require( './recommendationUnitTest.js');
var productUnitTest         = require( './productUnitTest.js');
var notificationsUnitTest   = require( './notificationsUnitTest.js');
var messagesUnitTest        = require( './messagesUnitTest.js');
var encouragementsUnitTest  = require( './encouragementsUnitTest.js');

var express                 = require('express');
var mongoose                = require('mongoose');

function _connectToDb(){
    var app= express();
    app.locals.mongourl= 'mongodb://localhost/IBBLSUnitTests';
    mongoose.connect(app.locals.mongourl);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('connected to db successfuly');
    });
}

describe('unit tests', function () {
    //initial database for tests
    _connectToDb();

    userUnitTest;
    storeUnitTest;
    shiftUnitTest;
    reportsUnitTest;
    recommendationUnitTest;
    productUnitTest;
    notificationsUnitTest;
    messagesUnitTest;
    encouragementsUnitTest;
});