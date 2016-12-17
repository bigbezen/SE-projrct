function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');

var logger = require('./src/Utils/Logger/logger');

var storeService = require('./src/Services/store/index');
var userService = require('./src/Services/user/index');
var productService = require('./src/Services/product/index');
var encouragementServices = require('./src/Services/encouragements/index');

var app = express();

app.set('view engine', 'ejs');
var port = 3000;
app.use(bodyparser.json());
app.listen(port);
app.locals.baseurl = "http://localhost:" + port;
app.locals.mongourl = 'mongodb://localhost/IBBLS';

_connectToDb();
_setapApiEndpoints();

logger.info('server is now running on port: ', { 'port': port });

function _connectToDb() {
    mongoose.Promise = global.Promise;
    mongoose.connect(app.locals.mongourl);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log('connected to db successfuly');
    });
}

function _setapApiEndpoints() {

    app.use('/scripts', express.static(path.join(__dirname, '/../scripts')));

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '../index.html'));
    });

    //User Services
    app.post('/user/login', (() => {
        var _ref = _asyncToGenerator(function* (req, res) {
            var result = yield userService.login(req.body.username, req.body.password);
            if (result.sessionId != null) {
                res.status(200).send(result);
            } else {
                res.status(401).send();
            }
        });

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    })());

    app.post('/user/logout', (() => {
        var _ref2 = _asyncToGenerator(function* (req, res) {
            var result = yield userService.logout(req.body.sessionId);
            if (result.code == 200) res.status(200).send('logout succeeded');else res.status(result.code).send(result.err);
        });

        return function (_x3, _x4) {
            return _ref2.apply(this, arguments);
        };
    })());

    app.post('/user/retrievePassword', function (req, res) {
        res.status(200).send('retrievePassword');
    });

    app.post('/user/changePassword', (() => {
        var _ref3 = _asyncToGenerator(function* (req, res) {
            var result = yield userService.changePassword(req.body.sessionId, req.body.oldPass, req.body.newPass);
            if (result.code == 200) res.status(200).send('changed password succeeded');else res.status(result.code).send(result.err);
        });

        return function (_x5, _x6) {
            return _ref3.apply(this, arguments);
        };
    })());

    app.get('/user/getProfile', (() => {
        var _ref4 = _asyncToGenerator(function* (req, res) {
            var result = yield userService.getProfile(req.headers.sessionid);
            if (result.code == 200) res.status(200).send(result.user);else res.status(result.code).send(result.err);
        });

        return function (_x7, _x8) {
            return _ref4.apply(this, arguments);
        };
    })());

    //Salesman Services
    app.post('/salesman/enterShift', function (req, res) {
        res.status(200).send('enter shift');
    });

    app.post('/salesman/exitShift', function (req, res) {
        res.status(200).send('exit shift');
    });

    app.post('/salesman/addSale', function (req, res) {
        res.status(200).send('add new sale');
    });

    app.post('/salesman/addShiftNote', function (req, res) {
        res.status(200).send('add shift note');
    });

    app.get('/salesman/encouragements', function (req, res) {
        res.status(200).send('get encouragements list');
    });

    app.get('/salesman/shifts', function (req, res) {
        res.status(200).send('get shifts list');
    });

    app.post('/salesman/addShiftsConstraints', function (req, res) {
        res.status(200).send('add shifts constraints');
    });

    app.get('/salesman/salesHistory', function (req, res) {
        res.status(200).send('get sales history');
    });

    app.get('/salesman/getBroadcastMessages', function (req, res) {
        res.status(200).send('get broadcast messages');
    });

    app.post('/salesman/enterShift', function (req, res) {
        res.status(200).send('enter shift');
    });

    app.post('/salesman/shiftRegister', function (req, res) {
        res.status(200).send('registration to shift');
    });

    //Management Services

    app.post('/management/addUser', (() => {
        var _ref5 = _asyncToGenerator(function* (req, res) {
            var result = yield userService.addUser(req.body.sessionId, req.body.userDetails);
            if (result.code == 200) {
                res.status(200).send(result.user);
            } else {
                res.status(result.code).send(result.err);
            }
        });

        return function (_x9, _x10) {
            return _ref5.apply(this, arguments);
        };
    })());

    app.post('/management/editUser', function (req, res) {
        res.status(200).send('edit user');
    });

    app.post('/management/deleteUser', function (req, res) {
        res.status(200).send('delete user');
    });

    app.post('/management/addStore', (() => {
        var _ref6 = _asyncToGenerator(function* (req, res) {
            var result = yield storeService.addStore(req.body.sessionId, req.body.storeDetails);
            if (result.err != null) {
                res.status(result.code).send(result.err);
            } else {
                res.status(result.code).send(result.store);
            }
        });

        return function (_x11, _x12) {
            return _ref6.apply(this, arguments);
        };
    })());

    app.post('/management/editStore', (() => {
        var _ref7 = _asyncToGenerator(function* (req, res) {
            var result = yield storeService.editStore(req.body.sessionId, req.body.storeDetails);
            if (result.err != null) {
                res.status(result.code).send(result.err);
            } else {
                res.status(result.code).send(result.store);
            }
        });

        return function (_x13, _x14) {
            return _ref7.apply(this, arguments);
        };
    })());

    app.post('/management/deleteStore', (() => {
        var _ref8 = _asyncToGenerator(function* (req, res) {
            var result = yield storeService.deleteStroe(req.body.sessionId, req.body.storeDetails);
            if (result.err != null) {
                res.status(result.code).send(result.err);
            } else {
                res.status(result.code).send(result.store);
            }
        });

        return function (_x15, _x16) {
            return _ref8.apply(this, arguments);
        };
    })());

    app.get('/management/getAllStores', (() => {
        var _ref9 = _asyncToGenerator(function* (req, res) {
            var result = yield storeService.getAllStores(req.headers.sessionid);
            if (result.err != null) {
                res.status(result.code).send(result.err);
            } else {
                res.status(result.code).send(result.stores);
            }
        });

        return function (_x17, _x18) {
            return _ref9.apply(this, arguments);
        };
    })());

    app.post('/management/addProduct', (() => {
        var _ref10 = _asyncToGenerator(function* (req, res) {
            var result = yield productService.addProduct(req.body.sessionId, req.body.productDetails);
            if (result.err != null) {
                res.status(result.code).send(result.err);
            } else {
                res.status(result.code).send(result.product);
            }
        });

        return function (_x19, _x20) {
            return _ref10.apply(this, arguments);
        };
    })());

    app.post('/management/editProduct', (() => {
        var _ref11 = _asyncToGenerator(function* (req, res) {
            var result = yield productService.editProduct(req.body.sessionId, req.body.productDetails);
            if (result.err != null) {
                res.status(result.code).send(result.err);
            } else {
                res.status(result.code).send(result.product);
            }
        });

        return function (_x21, _x22) {
            return _ref11.apply(this, arguments);
        };
    })());

    app.post('/management/deleteProduct', (() => {
        var _ref12 = _asyncToGenerator(function* (req, res) {
            var result = yield productService.deleteProduct(req.body.sessionId, req.body.productDetails);
            if (result.err != null) {
                res.status(result.code).send(result.err);
            } else {
                res.status(result.code).send(result.product);
            }
        });

        return function (_x23, _x24) {
            return _ref12.apply(this, arguments);
        };
    })());

    app.get('/management/getAllProducts', (() => {
        var _ref13 = _asyncToGenerator(function* (req, res) {
            var result = yield productService.getAllProducts(req.headers.sessionid);
            if (result.err != null) {
                res.status(result.code).send(result.err);
            } else {
                res.status(result.code).send(result.products);
            }
        });

        return function (_x25, _x26) {
            return _ref13.apply(this, arguments);
        };
    })());

    app.post('/management/addEncouragement', (() => {
        var _ref14 = _asyncToGenerator(function* (req, res) {
            var result = yield encouragementServices.addEncouragement(req.body.sessionId, req.body.encouragementDetails);
            if (result.err != null) {
                res.status(result.code).send(result.err);
            } else {
                res.status(result.code).send(result.encouragement);
            }
        });

        return function (_x27, _x28) {
            return _ref14.apply(this, arguments);
        };
    })());

    app.post('/management/editEncouragement', (() => {
        var _ref15 = _asyncToGenerator(function* (req, res) {
            var result = yield encouragementServices.editEncouragement(req.body.sessionId, req.body.encouragementDetails);
            if (result.err != null) {
                res.status(result.code).send(result.err);
            } else {
                res.status(result.code).send(result.encouragement);
            }
        });

        return function (_x29, _x30) {
            return _ref15.apply(this, arguments);
        };
    })());

    app.post('/management/deleteEncouragement', (() => {
        var _ref16 = _asyncToGenerator(function* (req, res) {
            var result = yield encouragementServices.deleteEncouragement(req.body.sessionId, req.body.encouragementDetails);
            if (result.err != null) {
                res.status(result.code).send(result.err);
            } else {
                res.status(result.code).send(result.encouragement);
            }
        });

        return function (_x31, _x32) {
            return _ref16.apply(this, arguments);
        };
    })());

    app.get('/management/getAllEncouragements', (() => {
        var _ref17 = _asyncToGenerator(function* (req, res) {
            var result = yield encouragementServices.getAllEncouragements(req.headers.sessionid);
            if (result.err != null) {
                res.status(result.code).send(result.err);
            } else {
                res.status(result.code).send(result.encouragements);
            }
        });

        return function (_x33, _x34) {
            return _ref17.apply(this, arguments);
        };
    })());

    app.post('/management/addShift', function (req, res) {
        res.status(200).send('add new user');
    });

    app.post('/management/editShift', function (req, res) {
        res.status(200).send('edit user');
    });

    app.post('/management/deleteShift', function (req, res) {
        res.status(200).send('delete user');
    });

    //Manager Services

    app.post('/manager/addNotificationRule', function (req, res) {
        res.status(200).send('add new notification rule');
    });

    app.post('/manager/removeNotificationRule', function (req, res) {
        res.status(200).send('remove notification rule');
    });

    app.post('/manager/setNotificationRule', function (req, res) {
        res.status(200).send('set new notification rule');
    });

    app.post('/manager/sendBroadcastMessage', function (req, res) {
        res.status(200).send('send a broadcast message');
    });

    app.get('/manager/getShiftNotes', function (req, res) {
        res.status(200).send('get shift notes');
    });

    app.post('/manager/editSalesReport', function (req, res) {
        res.status(200).send('edit sales report');
    });

    app.get('/manager/getRecommendations', function (req, res) {
        res.status(200).send('TODO - not yet implemented');
    });

    app.get('/manager/getShiftDetails', function (req, res) {
        res.status(200).send('get a specific shift details');
    });

    app.get('/manager/getShortages', function (req, res) {
        res.status(200).send('get shortages');
    });

    app.post('/manager/publishShifts', function (req, res) {
        res.status(200).send('publish shifts');
    });

    app.get('/manager/getReports', function (req, res) {
        res.status(200).send('get reports of some kind');
    });
}