"use strict";

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _genarateMonthlyReport = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var res;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return reportsService.genarateMonthlyUserHoursReport();

                    case 2:
                        res = _context.sent;
                        _context.next = 5;
                        return reportsService.genarateMonthAnalysisReport();

                    case 5:
                        res = _context.sent;

                    case 6:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function _genarateMonthlyReport() {
        return _ref.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var scheduler = require('node-schedule');

var logger = require('./src/Utils/Logger/logger');
var validator = require('./src/Utils/Validators/index');

var storeService = require('./src/Services/store/index');
var userService = require('./src/Services/user/index');
var productService = require('./src/Services/product/index');
var encouragementService = require('./src/Services/encouragements/index');
var messageService = require('./src/Services/messages/index');
var reportsService = require('./src/Services/reports/index');
var shiftService = require('./src/Services/shift/index');
var deletionService = require('./src/Services/deletion/index');

var app = express();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://svjgiyksxg.localtunnel.me');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.set('view engine', 'ejs');
var port = 3000;
app.use(bodyparser.json());
app.listen(process.env.PORT || port);

app.use(express.static(__dirname + '/public'));

var db = 'IBBLS';
if ('DB' in process.env) {
    db = process.env['DB'];
}
app.locals.baseurl = "http://localhost:" + port;
var localdb = 'mongodb://localhost/' + db;
var remotedb = "mongodb://shahafstein:ibbls!234@ibbls-shard-00-00-9au6a.mongodb.net:27017,ibbls-shard-00-01-9au6a.mongodb.net:27017,ibbls-shard-00-02-9au6a.mongodb.net:27017/ibbls?ssl=true&replicaSet=ibbls-shard-0&authSource=admin";
app.locals.mongourl = localdb;

_connectToDb();
_setapApiEndpoints();
var monthlyJob = scheduler.scheduleJob('57 * * * *', _genarateMonthlyReport);

console.log('server is now running on port: ', { 'port': port });
function _connectToDb() {
    mongoose.Promise = global.Promise;
    mongoose.connect(app.locals.mongourl);
    var db = mongoose.connection;
    db.on('error', function () {
        console.error.bind(console, 'connection error:');
        console.log('cant connect to db');
        //throw 'Cant connect to DB...';
    });
    db.once('open', function () {
        console.log('connected to db successfuly');
        userService.setAdminUser();
    });
}

function _setapApiEndpoints() {
    app.use('/scripts', express.static(path.join(__dirname, '/../scripts')));

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '../index.html'));
    });

    //User Services
    app.post('/user/login', function () {
        var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            if (validator.login(req.body)) {
                                _context2.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context2.abrupt('return');

                        case 3:
                            _context2.next = 5;
                            return userService.login(req.body.username, req.body.password);

                        case 5:
                            result = _context2.sent;

                            if (result.sessionId != null) {
                                res.status(200).send(result);
                            } else {
                                res.status(result.code).send(result.err);
                            }

                        case 7:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        return function (_x, _x2) {
            return _ref2.apply(this, arguments);
        };
    }());

    app.post('/user/logout', function () {
        var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            if (validator.sessionId(req.body)) {
                                _context3.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context3.abrupt('return');

                        case 3:
                            _context3.next = 5;
                            return userService.logout(req.body.sessionId);

                        case 5:
                            result = _context3.sent;

                            if (result.code == 200) res.status(200).send('logout succeeded');else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        return function (_x3, _x4) {
            return _ref3.apply(this, arguments);
        };
    }());

    app.post('/user/retrievePassword', function () {
        var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            if (validator.retrievePassword(req.body)) {
                                _context4.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context4.abrupt('return');

                        case 3:
                            _context4.next = 5;
                            return userService.retrievePassword(req.body.username, req.body.email);

                        case 5:
                            result = _context4.sent;

                            if (result.code == 200) res.status(200).send('retrieved password successfully');else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        return function (_x5, _x6) {
            return _ref4.apply(this, arguments);
        };
    }());

    app.post('/user/changePassword', function () {
        var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            if (validator.changePassword(req.body)) {
                                _context5.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context5.abrupt('return');

                        case 3:
                            _context5.next = 5;
                            return userService.changePassword(req.body.sessionId, req.body.oldPass, req.body.newPass);

                        case 5:
                            result = _context5.sent;

                            if (result.code == 200) res.status(200).send('changed password succeeded');else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, this);
        }));

        return function (_x7, _x8) {
            return _ref5.apply(this, arguments);
        };
    }());

    app.get('/user/getProfile', function () {
        var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            if ('sessionid' in req.headers) {
                                _context6.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context6.abrupt('return');

                        case 3:
                            _context6.next = 5;
                            return userService.getProfile(req.headers.sessionid);

                        case 5:
                            result = _context6.sent;

                            if (result.code == 200) res.status(200).send(result.user);else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, this);
        }));

        return function (_x9, _x10) {
            return _ref6.apply(this, arguments);
        };
    }());

    //Salesman Services
    app.post('/salesman/startShift', function () {
        var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            if (validator.startOrEndShift(req.body)) {
                                _context7.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context7.abrupt('return');

                        case 3:
                            _context7.next = 5;
                            return shiftService.startShift(req.body.sessionId, req.body.shift);

                        case 5:
                            result = _context7.sent;

                            if (result.code == 200) res.status(200).send();else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context7.stop();
                    }
                }
            }, _callee7, this);
        }));

        return function (_x11, _x12) {
            return _ref7.apply(this, arguments);
        };
    }());

    app.post('/salesman/finishShift', function () {
        var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            if (validator.startOrEndShift(req.body)) {
                                _context8.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context8.abrupt('return');

                        case 3:
                            _context8.next = 5;
                            return shiftService.endShift(req.body.sessionId, req.body.shift);

                        case 5:
                            result = _context8.sent;

                            if (result.code == 200) res.status(200).send();else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context8.stop();
                    }
                }
            }, _callee8, this);
        }));

        return function (_x13, _x14) {
            return _ref8.apply(this, arguments);
        };
    }());

    app.post('/salesman/reportSale', function () {
        var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee9$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            if (validator.reportSaleOrOpened(req.body)) {
                                _context9.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context9.abrupt('return');

                        case 3:
                            _context9.next = 5;
                            return shiftService.reportSale(req.body.sessionId, req.body.shiftId, req.body.sales);

                        case 5:
                            result = _context9.sent;

                            if (result.code == 200) res.status(200).send();else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context9.stop();
                    }
                }
            }, _callee9, this);
        }));

        return function (_x15, _x16) {
            return _ref9.apply(this, arguments);
        };
    }());

    app.post('/salesman/editSale', function () {
        var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee10$(_context10) {
                while (1) {
                    switch (_context10.prev = _context10.next) {
                        case 0:
                            if (validator.editSale(req.body)) {
                                _context10.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context10.abrupt('return');

                        case 3:
                            _context10.next = 5;
                            return shiftService.editSale(req.body.sessionId, req.body.shiftId, req.body.productId, req.body.saleTime, req.body.quantity);

                        case 5:
                            result = _context10.sent;

                            if (result.code == 200) res.status(200).send();else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context10.stop();
                    }
                }
            }, _callee10, this);
        }));

        return function (_x17, _x18) {
            return _ref10.apply(this, arguments);
        };
    }());

    app.post('/salesman/reportOpened', function () {
        var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee11$(_context11) {
                while (1) {
                    switch (_context11.prev = _context11.next) {
                        case 0:
                            if (validator.reportSaleOrOpened(req.body)) {
                                _context11.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context11.abrupt('return');

                        case 3:
                            _context11.next = 5;
                            return shiftService.reportOpened(req.body.sessionId, req.body.shiftId, req.body.opens);

                        case 5:
                            result = _context11.sent;

                            if (result.code == 200) res.status(200).send();else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context11.stop();
                    }
                }
            }, _callee11, this);
        }));

        return function (_x19, _x20) {
            return _ref11.apply(this, arguments);
        };
    }());

    app.post('/salesman/addShiftComment', function () {
        var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee12$(_context12) {
                while (1) {
                    switch (_context12.prev = _context12.next) {
                        case 0:
                            _context12.next = 2;
                            return shiftService.addShiftComment(req.body.sessionId, req.body.shiftId, req.body.content);

                        case 2:
                            result = _context12.sent;

                            if (result.code == 200) res.status(200).send();else res.status(result.code).send(result.err);

                        case 4:
                        case 'end':
                            return _context12.stop();
                    }
                }
            }, _callee12, this);
        }));

        return function (_x21, _x22) {
            return _ref12.apply(this, arguments);
        };
    }());

    app.get('/salesman/:shiftId/activeShiftEncouragements', function () {
        var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee13$(_context13) {
                while (1) {
                    switch (_context13.prev = _context13.next) {
                        case 0:
                            if ('sessionid' in req.headers) {
                                _context13.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context13.abrupt('return');

                        case 3:
                            _context13.next = 5;
                            return shiftService.getActiveShiftEncouragements(req.body.sessionId, req.params.shiftId);

                        case 5:
                            result = _context13.sent;

                            if (result.code == 200) res.status(200).send(result.encouragements);else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context13.stop();
                    }
                }
            }, _callee13, this);
        }));

        return function (_x23, _x24) {
            return _ref13.apply(this, arguments);
        };
    }());

    app.get('/salesman/encouragements', function (req, res) {
        res.status(200).send('get encouragements list');
    });

    app.get('/salesman/getAllShifts', function () {
        var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee14$(_context14) {
                while (1) {
                    switch (_context14.prev = _context14.next) {
                        case 0:
                            if ('sessionid' in req.headers) {
                                _context14.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context14.abrupt('return');

                        case 3:
                            _context14.next = 5;
                            return shiftService.getSalesmanShifts(req.headers.sessionid);

                        case 5:
                            result = _context14.sent;

                            if (result.code == 200) res.status(200).send(result.shifts);else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context14.stop();
                    }
                }
            }, _callee14, this);
        }));

        return function (_x25, _x26) {
            return _ref14.apply(this, arguments);
        };
    }());

    app.get('/salesman/getCurrentShift', function () {
        var _ref15 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee15(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee15$(_context15) {
                while (1) {
                    switch (_context15.prev = _context15.next) {
                        case 0:
                            if ('sessionid' in req.headers) {
                                _context15.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context15.abrupt('return');

                        case 3:
                            _context15.next = 5;
                            return shiftService.getSalesmanCurrentShift(req.headers.sessionid);

                        case 5:
                            result = _context15.sent;

                            if (result.code == 200) res.status(200).send(result.shift);else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context15.stop();
                    }
                }
            }, _callee15, this);
        }));

        return function (_x27, _x28) {
            return _ref15.apply(this, arguments);
        };
    }());

    app.get('/salesman/getActiveShift', function () {
        var _ref16 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee16(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee16$(_context16) {
                while (1) {
                    switch (_context16.prev = _context16.next) {
                        case 0:
                            if (!(!('sessionid' in req.headers) || !('shiftId' in req.query))) {
                                _context16.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context16.abrupt('return');

                        case 3:
                            _context16.next = 5;
                            return shiftService.getActiveShift(req.headers.sessionid, req.query.shiftId);

                        case 5:
                            result = _context16.sent;

                            if (result.code == 200) res.status(200).send(result.shift);else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context16.stop();
                    }
                }
            }, _callee16, this);
        }));

        return function (_x29, _x30) {
            return _ref16.apply(this, arguments);
        };
    }());

    app.post('/salesman/reportExpenses', function () {
        var _ref17 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee17(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee17$(_context17) {
                while (1) {
                    switch (_context17.prev = _context17.next) {
                        case 0:
                            if ('sessionId' in req.body) {
                                _context17.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context17.abrupt('return');

                        case 3:
                            _context17.next = 5;
                            return shiftService.reportExpenses(req.body.sessionId, req.body.shiftId, req.body.km, req.body.parking);

                        case 5:
                            result = _context17.sent;

                            if (result.code == 200) res.status(200).send(result.shift);else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context17.stop();
                    }
                }
            }, _callee17, this);
        }));

        return function (_x31, _x32) {
            return _ref17.apply(this, arguments);
        };
    }());

    app.post('/salesman/addShiftsConstraints', function (req, res) {
        res.status(200).send('add shifts constraints');
    });

    app.get('/salesman/salesHistory', function (req, res) {
        res.status(200).send('get sales history');
    });

    app.get('/salesman/getBroadcastMessages', function () {
        var _ref18 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee18(req, res) {
            var sessionId, result;
            return _regenerator2.default.wrap(function _callee18$(_context18) {
                while (1) {
                    switch (_context18.prev = _context18.next) {
                        case 0:
                            if ('sessionid' in req.headers) {
                                _context18.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context18.abrupt('return');

                        case 3:
                            sessionId = req.headers.sessionid;
                            _context18.next = 6;
                            return messageService.getInbox(sessionId);

                        case 6:
                            result = _context18.sent;

                            if (result.code == 200) res.status(200).send(result.inbox);else {
                                res.status(result.code).send(result.err);
                                messageService.markAsRead(sessionId);
                            }

                        case 8:
                        case 'end':
                            return _context18.stop();
                    }
                }
            }, _callee18, this);
        }));

        return function (_x33, _x34) {
            return _ref18.apply(this, arguments);
        };
    }());

    app.post('/salesman/shiftRegister', function (req, res) {
        res.status(200).send('registration to shift');
    });

    //Management Services
    app.post('/management/addUser', function () {
        var _ref19 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee19(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee19$(_context19) {
                while (1) {
                    switch (_context19.prev = _context19.next) {
                        case 0:
                            if (validator.addUser(req.body)) {
                                _context19.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context19.abrupt('return');

                        case 3:
                            _context19.next = 5;
                            return userService.addUser(req.body.sessionId, req.body.userDetails);

                        case 5:
                            result = _context19.sent;

                            if (result.code == 200) {
                                res.status(200).send(result.user);
                            } else {
                                res.status(result.code).send(result.err);
                            }

                        case 7:
                        case 'end':
                            return _context19.stop();
                    }
                }
            }, _callee19, this);
        }));

        return function (_x35, _x36) {
            return _ref19.apply(this, arguments);
        };
    }());

    app.post('/management/editUser', function () {
        var _ref20 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee20(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee20$(_context20) {
                while (1) {
                    switch (_context20.prev = _context20.next) {
                        case 0:
                            if (validator.editUser(req.body)) {
                                _context20.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context20.abrupt('return');

                        case 3:
                            _context20.next = 5;
                            return userService.editUser(req.body.sessionId, req.body.username, req.body.userDetails);

                        case 5:
                            result = _context20.sent;

                            if (result.code == 200) {
                                res.status(200).send();
                            } else {
                                res.status(result.code).send(result.err);
                            }

                        case 7:
                        case 'end':
                            return _context20.stop();
                    }
                }
            }, _callee20, this);
        }));

        return function (_x37, _x38) {
            return _ref20.apply(this, arguments);
        };
    }());

    app.post('/management/updateSalesReport', function () {
        var _ref21 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee21(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee21$(_context21) {
                while (1) {
                    switch (_context21.prev = _context21.next) {
                        case 0:
                            _context21.next = 2;
                            return shiftService.updateSalesReport(req.body.sessionId, req.body.shiftId, req.body.productId, req.body.newSold, req.body.newOpened);

                        case 2:
                            result = _context21.sent;

                            if (result.code == 200) res.status(200).send();else res.status(result.code).send(result.err);

                        case 4:
                        case 'end':
                            return _context21.stop();
                    }
                }
            }, _callee21, this);
        }));

        return function (_x39, _x40) {
            return _ref21.apply(this, arguments);
        };
    }());

    app.post('/management/deleteUser', function () {
        var _ref22 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee22(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee22$(_context22) {
                while (1) {
                    switch (_context22.prev = _context22.next) {
                        case 0:
                            if (validator.deleteUser(req.body)) {
                                _context22.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context22.abrupt('return');

                        case 3:
                            _context22.next = 5;
                            return userService.deleteUser(req.body.sessionId, req.body.username);

                        case 5:
                            result = _context22.sent;

                            if (result.code == 200) {
                                res.status(200).send();
                            } else {
                                res.status(result.code).send(result.err);
                            }

                        case 7:
                        case 'end':
                            return _context22.stop();
                    }
                }
            }, _callee22, this);
        }));

        return function (_x41, _x42) {
            return _ref22.apply(this, arguments);
        };
    }());

    app.get('/management/getAllUsers', function () {
        var _ref23 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee23(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee23$(_context23) {
                while (1) {
                    switch (_context23.prev = _context23.next) {
                        case 0:
                            if ('sessionid' in req.headers) {
                                _context23.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context23.abrupt('return');

                        case 3:
                            _context23.next = 5;
                            return userService.getAllUsers(req.headers.sessionid);

                        case 5:
                            result = _context23.sent;

                            if (result.code == 200) {
                                res.status(200).send(result.users);
                            } else {
                                res.status(result.code).send(result.err);
                            }

                        case 7:
                        case 'end':
                            return _context23.stop();
                    }
                }
            }, _callee23, this);
        }));

        return function (_x43, _x44) {
            return _ref23.apply(this, arguments);
        };
    }());

    app.post('/management/addStore', function () {
        var _ref24 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee24(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee24$(_context24) {
                while (1) {
                    switch (_context24.prev = _context24.next) {
                        case 0:
                            if (validator.addOrEditOrDeleteStore(req.body)) {
                                _context24.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context24.abrupt('return');

                        case 3:
                            _context24.next = 5;
                            return storeService.addStore(req.body.sessionId, req.body.storeDetails);

                        case 5:
                            result = _context24.sent;

                            if (result.err != null) {
                                res.status(result.code).send(result.err);
                            } else {
                                res.status(result.code).send(result.store);
                            }

                        case 7:
                        case 'end':
                            return _context24.stop();
                    }
                }
            }, _callee24, this);
        }));

        return function (_x45, _x46) {
            return _ref24.apply(this, arguments);
        };
    }());

    app.post('/management/editStore', function () {
        var _ref25 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee25(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee25$(_context25) {
                while (1) {
                    switch (_context25.prev = _context25.next) {
                        case 0:
                            if (validator.addOrEditOrDeleteStore(req.body)) {
                                _context25.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context25.abrupt('return');

                        case 3:
                            _context25.next = 5;
                            return storeService.editStore(req.body.sessionId, req.body.storeDetails);

                        case 5:
                            result = _context25.sent;

                            if (result.err != null) {
                                res.status(result.code).send(result.err);
                            } else {
                                res.status(result.code).send(result.store);
                            }

                        case 7:
                        case 'end':
                            return _context25.stop();
                    }
                }
            }, _callee25, this);
        }));

        return function (_x47, _x48) {
            return _ref25.apply(this, arguments);
        };
    }());

    app.post('/management/deleteStore', function () {
        var _ref26 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee26(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee26$(_context26) {
                while (1) {
                    switch (_context26.prev = _context26.next) {
                        case 0:
                            if (validator.deleteStore(req.body)) {
                                _context26.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context26.abrupt('return');

                        case 3:
                            _context26.next = 5;
                            return storeService.deleteStroe(req.body.sessionId, req.body.storeId);

                        case 5:
                            result = _context26.sent;

                            if (result.err != null) {
                                res.status(result.code).send(result.err);
                            } else {
                                res.status(result.code).send(result.store);
                            }

                        case 7:
                        case 'end':
                            return _context26.stop();
                    }
                }
            }, _callee26, this);
        }));

        return function (_x49, _x50) {
            return _ref26.apply(this, arguments);
        };
    }());

    app.get('/management/getAllStores', function () {
        var _ref27 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee27(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee27$(_context27) {
                while (1) {
                    switch (_context27.prev = _context27.next) {
                        case 0:
                            if ('sessionid' in req.headers) {
                                _context27.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context27.abrupt('return');

                        case 3:
                            _context27.next = 5;
                            return storeService.getAllStores(req.headers.sessionid);

                        case 5:
                            result = _context27.sent;

                            if (result.err != null) {
                                res.status(result.code).send(result.err);
                            } else {
                                res.status(result.code).send(result.stores);
                            }

                        case 7:
                        case 'end':
                            return _context27.stop();
                    }
                }
            }, _callee27, this);
        }));

        return function (_x51, _x52) {
            return _ref27.apply(this, arguments);
        };
    }());

    app.get('/management/:storeId/getStore', function () {
        var _ref28 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee28(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee28$(_context28) {
                while (1) {
                    switch (_context28.prev = _context28.next) {
                        case 0:
                            if ('sessionid' in req.headers) {
                                _context28.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context28.abrupt('return');

                        case 3:
                            _context28.next = 5;
                            return storeService.getStore(req.headers.sessionid, req.params.storeId);

                        case 5:
                            result = _context28.sent;

                            if (result.err != null) {
                                res.status(result.code).send(result.err);
                            } else {
                                res.status(result.code).send(result.store);
                            }

                        case 7:
                        case 'end':
                            return _context28.stop();
                    }
                }
            }, _callee28, this);
        }));

        return function (_x53, _x54) {
            return _ref28.apply(this, arguments);
        };
    }());

    app.post('/management/addProduct', function () {
        var _ref29 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee29(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee29$(_context29) {
                while (1) {
                    switch (_context29.prev = _context29.next) {
                        case 0:
                            if (validator.addOrEditProduct(req.body)) {
                                _context29.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context29.abrupt('return');

                        case 3:
                            _context29.next = 5;
                            return productService.addProduct(req.body.sessionId, req.body.productDetails);

                        case 5:
                            result = _context29.sent;

                            if (result.err != null) {
                                res.status(result.code).send(result.err);
                            } else {
                                res.status(result.code).send(result.product);
                            }

                        case 7:
                        case 'end':
                            return _context29.stop();
                    }
                }
            }, _callee29, this);
        }));

        return function (_x55, _x56) {
            return _ref29.apply(this, arguments);
        };
    }());

    app.post('/management/editProduct', function () {
        var _ref30 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee30(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee30$(_context30) {
                while (1) {
                    switch (_context30.prev = _context30.next) {
                        case 0:
                            if (validator.addOrEditProduct(req.body)) {
                                _context30.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context30.abrupt('return');

                        case 3:
                            _context30.next = 5;
                            return productService.editProduct(req.body.sessionId, req.body.productDetails);

                        case 5:
                            result = _context30.sent;

                            if (result.err != null) {
                                res.status(result.code).send(result.err);
                            } else {
                                res.status(result.code).send(result.product);
                            }

                        case 7:
                        case 'end':
                            return _context30.stop();
                    }
                }
            }, _callee30, this);
        }));

        return function (_x57, _x58) {
            return _ref30.apply(this, arguments);
        };
    }());

    app.post('/management/deleteProduct', function () {
        var _ref31 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee31(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee31$(_context31) {
                while (1) {
                    switch (_context31.prev = _context31.next) {
                        case 0:
                            if (validator.deleteProduct(req.body)) {
                                _context31.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context31.abrupt('return');

                        case 3:
                            _context31.next = 5;
                            return productService.deleteProduct(req.body.sessionId, req.body.productId);

                        case 5:
                            result = _context31.sent;

                            if (result.err != null) {
                                res.status(result.code).send(result.err);
                            } else {
                                res.status(result.code).send(result.product);
                            }

                        case 7:
                        case 'end':
                            return _context31.stop();
                    }
                }
            }, _callee31, this);
        }));

        return function (_x59, _x60) {
            return _ref31.apply(this, arguments);
        };
    }());

    app.get('/management/getAllProducts', function () {
        var _ref32 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee32(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee32$(_context32) {
                while (1) {
                    switch (_context32.prev = _context32.next) {
                        case 0:
                            if ('sessionid' in req.headers) {
                                _context32.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context32.abrupt('return');

                        case 3:
                            _context32.next = 5;
                            return productService.getAllProducts(req.headers.sessionid);

                        case 5:
                            result = _context32.sent;

                            if (result.err != null) {
                                res.status(result.code).send(result.err);
                            } else {
                                res.status(result.code).send(result.products);
                            }

                        case 7:
                        case 'end':
                            return _context32.stop();
                    }
                }
            }, _callee32, this);
        }));

        return function (_x61, _x62) {
            return _ref32.apply(this, arguments);
        };
    }());

    app.get('/management/:productId/getProduct', function () {
        var _ref33 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee33(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee33$(_context33) {
                while (1) {
                    switch (_context33.prev = _context33.next) {
                        case 0:
                            if ('sessionid' in req.headers) {
                                _context33.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context33.abrupt('return');

                        case 3:
                            _context33.next = 5;
                            return productService.getProduct(req.headers.sessionid, req.params.productId);

                        case 5:
                            result = _context33.sent;

                            if (result.err != null) {
                                res.status(result.code).send(result.err);
                            } else {
                                res.status(result.code).send(result.product);
                            }

                        case 7:
                        case 'end':
                            return _context33.stop();
                    }
                }
            }, _callee33, this);
        }));

        return function (_x63, _x64) {
            return _ref33.apply(this, arguments);
        };
    }());

    app.post('/management/addEncouragement', function () {
        var _ref34 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee34(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee34$(_context34) {
                while (1) {
                    switch (_context34.prev = _context34.next) {
                        case 0:
                            if (validator.addOrEditEncouragement(req.body)) {
                                _context34.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context34.abrupt('return');

                        case 3:
                            _context34.next = 5;
                            return encouragementService.addEncouragement(req.body.sessionId, req.body.encouragementDetails);

                        case 5:
                            result = _context34.sent;

                            if (result.err != null) {
                                res.status(result.code).send(result.err);
                            } else {
                                res.status(result.code).send(result.encouragement);
                            }

                        case 7:
                        case 'end':
                            return _context34.stop();
                    }
                }
            }, _callee34, this);
        }));

        return function (_x65, _x66) {
            return _ref34.apply(this, arguments);
        };
    }());

    app.post('/management/editEncouragement', function () {
        var _ref35 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee35(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee35$(_context35) {
                while (1) {
                    switch (_context35.prev = _context35.next) {
                        case 0:
                            if (validator.addOrEditEncouragement(req.body)) {
                                _context35.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context35.abrupt('return');

                        case 3:
                            _context35.next = 5;
                            return encouragementService.editEncouragement(req.body.sessionId, req.body.encouragementDetails);

                        case 5:
                            result = _context35.sent;

                            if (result.err != null) {
                                res.status(result.code).send(result.err);
                            } else {
                                res.status(result.code).send(result.encouragement);
                            }

                        case 7:
                        case 'end':
                            return _context35.stop();
                    }
                }
            }, _callee35, this);
        }));

        return function (_x67, _x68) {
            return _ref35.apply(this, arguments);
        };
    }());

    app.post('/management/deleteEncouragement', function () {
        var _ref36 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee36(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee36$(_context36) {
                while (1) {
                    switch (_context36.prev = _context36.next) {
                        case 0:
                            if (validator.deleteEncouragement(req.body)) {
                                _context36.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context36.abrupt('return');

                        case 3:
                            _context36.next = 5;
                            return encouragementService.deleteEncouragement(req.body.sessionId, req.body.encouragementId);

                        case 5:
                            result = _context36.sent;

                            if (result.err != null) {
                                res.status(result.code).send(result.err);
                            } else {
                                res.status(result.code).send(result.encouragement);
                            }

                        case 7:
                        case 'end':
                            return _context36.stop();
                    }
                }
            }, _callee36, this);
        }));

        return function (_x69, _x70) {
            return _ref36.apply(this, arguments);
        };
    }());

    app.get('/management/getAllEncouragements', function () {
        var _ref37 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee37(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee37$(_context37) {
                while (1) {
                    switch (_context37.prev = _context37.next) {
                        case 0:
                            if ('sessionid' in req.headers) {
                                _context37.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context37.abrupt('return');

                        case 3:
                            _context37.next = 5;
                            return encouragementService.getAllEncouragements(req.headers.sessionid);

                        case 5:
                            result = _context37.sent;

                            if (result.err != null) {
                                res.status(result.code).send(result.err);
                            } else {
                                res.status(result.code).send(result.encouragements);
                            }

                        case 7:
                        case 'end':
                            return _context37.stop();
                    }
                }
            }, _callee37, this);
        }));

        return function (_x71, _x72) {
            return _ref37.apply(this, arguments);
        };
    }());

    app.get('/management/:encouragementId/getAllEncouragements', function () {
        var _ref38 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee38(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee38$(_context38) {
                while (1) {
                    switch (_context38.prev = _context38.next) {
                        case 0:
                            if ('sessionid' in req.headers) {
                                _context38.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context38.abrupt('return');

                        case 3:
                            _context38.next = 5;
                            return encouragementService.getEncouragement(req.headers.sessionid, req.params.encouragementId);

                        case 5:
                            result = _context38.sent;

                            if (result.err != null) {
                                res.status(result.code).send(result.err);
                            } else {
                                res.status(result.code).send(result.encouragement);
                            }

                        case 7:
                        case 'end':
                            return _context38.stop();
                    }
                }
            }, _callee38, this);
        }));

        return function (_x73, _x74) {
            return _ref38.apply(this, arguments);
        };
    }());

    app.post('/management/addShifts', function () {
        var _ref39 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee39(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee39$(_context39) {
                while (1) {
                    switch (_context39.prev = _context39.next) {
                        case 0:
                            if (validator.addShifts(req.body)) {
                                _context39.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context39.abrupt('return');

                        case 3:
                            _context39.next = 5;
                            return shiftService.addShifts(req.body.sessionId, req.body.shiftArr);

                        case 5:
                            result = _context39.sent;

                            if (result.code == 200) res.status(200).send(result.shiftArr);else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context39.stop();
                    }
                }
            }, _callee39, this);
        }));

        return function (_x75, _x76) {
            return _ref39.apply(this, arguments);
        };
    }());

    app.post('/management/generateShifts', function () {
        var _ref40 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee40(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee40$(_context40) {
                while (1) {
                    switch (_context40.prev = _context40.next) {
                        case 0:
                            if (validator.generateShifts(req.body)) {
                                _context40.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context40.abrupt('return');

                        case 3:
                            _context40.next = 5;
                            return shiftService.automateGenerateShifts(req.body.sessionId, req.body.starttime, req.body.endTime);

                        case 5:
                            result = _context40.sent;

                            if (result.code == 200) res.status(200).send(result.shifts);else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context40.stop();
                    }
                }
            }, _callee40, this);
        }));

        return function (_x77, _x78) {
            return _ref40.apply(this, arguments);
        };
    }());

    app.post('/management/publishShifts', function () {
        var _ref41 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee41(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee41$(_context41) {
                while (1) {
                    switch (_context41.prev = _context41.next) {
                        case 0:
                            if (validator.publishShifts(req.body)) {
                                _context41.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context41.abrupt('return');

                        case 3:
                            _context41.next = 5;
                            return shiftService.publishShifts(req.body.sessionId, req.body.shiftArr);

                        case 5:
                            result = _context41.sent;

                            if (result.code == 200) res.status(200).send();else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context41.stop();
                    }
                }
            }, _callee41, this);
        }));

        return function (_x79, _x80) {
            return _ref41.apply(this, arguments);
        };
    }());

    app.get('/management/getShiftsFromDate', function () {
        var _ref42 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee42(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee42$(_context42) {
                while (1) {
                    switch (_context42.prev = _context42.next) {
                        case 0:
                            if (!(!('sessionid' in req.headers) || !('fromDate' in req.query))) {
                                _context42.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context42.abrupt('return');

                        case 3:
                            _context42.next = 5;
                            return shiftService.getShiftsFromDate(req.headers.sessionid, req.query.fromDate);

                        case 5:
                            result = _context42.sent;

                            if (result.code == 200) res.status(200).send(result.shiftArr);else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context42.stop();
                    }
                }
            }, _callee42, this);
        }));

        return function (_x81, _x82) {
            return _ref42.apply(this, arguments);
        };
    }());

    app.get('/management/getSalesmanFinishedShifts', function () {
        var _ref43 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee43(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee43$(_context43) {
                while (1) {
                    switch (_context43.prev = _context43.next) {
                        case 0:
                            if (!(!('sessionid' in req.headers) || !('salesmanId' in req.query))) {
                                _context43.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context43.abrupt('return');

                        case 3:
                            _context43.next = 5;
                            return shiftService.getSalesmanFinishedShifts(req.headers.sessionid, req.query.salesmanId);

                        case 5:
                            result = _context43.sent;

                            if (result.code == 200) res.status(200).send(result.shifts);else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context43.stop();
                    }
                }
            }, _callee43, this);
        }));

        return function (_x83, _x84) {
            return _ref43.apply(this, arguments);
        };
    }());

    app.get('/management/getSalesmanLiveShift', function () {
        var _ref44 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee44(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee44$(_context44) {
                while (1) {
                    switch (_context44.prev = _context44.next) {
                        case 0:
                            if (!(!('sessionid' in req.headers) || !('salesmanId' in req.query))) {
                                _context44.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context44.abrupt('return');

                        case 3:
                            _context44.next = 5;
                            return shiftService.getSalesmanLiveShift(req.headers.sessionid, req.query.salesmanId);

                        case 5:
                            result = _context44.sent;

                            if (result.code == 200) res.status(200).send(result.shift);else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context44.stop();
                    }
                }
            }, _callee44, this);
        }));

        return function (_x85, _x86) {
            return _ref44.apply(this, arguments);
        };
    }());

    app.post('/management/editShifts', function () {
        var _ref45 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee45(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee45$(_context45) {
                while (1) {
                    switch (_context45.prev = _context45.next) {
                        case 0:
                            if (validator.editShift(req.body)) {
                                _context45.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context45.abrupt('return');

                        case 3:
                            _context45.next = 5;
                            return shiftService.editShift(req.body.sessionId, req.body.shiftDetails);

                        case 5:
                            result = _context45.sent;

                            if (result.code == 200) res.status(200).send();else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context45.stop();
                    }
                }
            }, _callee45, this);
        }));

        return function (_x87, _x88) {
            return _ref45.apply(this, arguments);
        };
    }());

    app.post('/management/deleteShift', function () {
        var _ref46 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee46(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee46$(_context46) {
                while (1) {
                    switch (_context46.prev = _context46.next) {
                        case 0:
                            if (validator.deleteShift(req.body)) {
                                _context46.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context46.abrupt('return');

                        case 3:
                            _context46.next = 5;
                            return shiftService.deleteShift(req.body.sessionId, req.body.shiftId);

                        case 5:
                            result = _context46.sent;

                            if (!(result.err != null)) {
                                _context46.next = 11;
                                break;
                            }

                            res.status(result.code).send(result.err);
                            return _context46.abrupt('return');

                        case 11:
                            res.status(result.code).send(result.store);
                            return _context46.abrupt('return');

                        case 13:
                        case 'end':
                            return _context46.stop();
                    }
                }
            }, _callee46, this);
        }));

        return function (_x89, _x90) {
            return _ref46.apply(this, arguments);
        };
    }());

    app.get('/management/getShiftsOfRange', function () {
        var _ref47 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee47(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee47$(_context47) {
                while (1) {
                    switch (_context47.prev = _context47.next) {
                        case 0:
                            if (!(!('sessionid' in req.headers) || !('startDate' in req.query) || !('endDate' in req.query))) {
                                _context47.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context47.abrupt('return');

                        case 3:
                            _context47.next = 5;
                            return shiftService.getShiftsOfRange(req.headers.sessionid, req.query.startDate, req.query.endDate);

                        case 5:
                            result = _context47.sent;

                            if (result.code == 200) res.status(200).send(result.shifts);else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context47.stop();
                    }
                }
            }, _callee47, this);
        }));

        return function (_x91, _x92) {
            return _ref47.apply(this, arguments);
        };
    }());

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

    app.post('/manager/sendBroadcastMessage', function () {
        var _ref48 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee48(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee48$(_context48) {
                while (1) {
                    switch (_context48.prev = _context48.next) {
                        case 0:
                            if (validator.sendBroadcastMessage(req.body)) {
                                _context48.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context48.abrupt('return');

                        case 3:
                            _context48.next = 5;
                            return messageService.sendBroadcast(req.body.sessionId, req.body.content, req.body.date);

                        case 5:
                            result = _context48.sent;

                            if (result.code == 200) res.status(200).send();else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context48.stop();
                    }
                }
            }, _callee48, this);
        }));

        return function (_x93, _x94) {
            return _ref48.apply(this, arguments);
        };
    }());

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

    app.get('/manager/getSaleReportXl', function () {
        var _ref49 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee49(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee49$(_context49) {
                while (1) {
                    switch (_context49.prev = _context49.next) {
                        case 0:
                            _context49.next = 2;
                            return reportsService.getSaleReportXl(req.headers.sessionid, req.headers.shiftid);

                        case 2:
                            result = _context49.sent;

                            res.status(result.code).send(result.err);

                        case 4:
                        case 'end':
                            return _context49.stop();
                    }
                }
            }, _callee49, this);
        }));

        return function (_x95, _x96) {
            return _ref49.apply(this, arguments);
        };
    }());

    app.post('/manager/getSalaryForHumanResourceReport', function () {
        var _ref50 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee50(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee50$(_context50) {
                while (1) {
                    switch (_context50.prev = _context50.next) {
                        case 0:
                            _context50.next = 2;
                            return reportsService.getSalaryForHumanResourceReport(req.body.sessionId, req.body.year, req.body.month);

                        case 2:
                            result = _context50.sent;

                            res.status(result.code).send(result.err);

                        case 4:
                        case 'end':
                            return _context50.stop();
                    }
                }
            }, _callee50, this);
        }));

        return function (_x97, _x98) {
            return _ref50.apply(this, arguments);
        };
    }());

    app.get('/manager/getSalesmanListXL', function () {
        var _ref51 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee51(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee51$(_context51) {
                while (1) {
                    switch (_context51.prev = _context51.next) {
                        case 0:
                            _context51.next = 2;
                            return reportsService.getSalesmanListXL(req.headers.sessionid);

                        case 2:
                            result = _context51.sent;

                            res.status(result.code).send(result.err);

                        case 4:
                        case 'end':
                            return _context51.stop();
                    }
                }
            }, _callee51, this);
        }));

        return function (_x99, _x100) {
            return _ref51.apply(this, arguments);
        };
    }());

    app.get('/manager/getMonthlyHoursSalesmansReportXl', function () {
        var _ref52 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee52(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee52$(_context52) {
                while (1) {
                    switch (_context52.prev = _context52.next) {
                        case 0:
                            _context52.next = 2;
                            return reportsService.getMonthlyHoursSalesmansReportXl(req.headers.sessionId, req.headers.year, req.headers.month);

                        case 2:
                            result = _context52.sent;

                            res.status(result.code).send(result.err);

                        case 4:
                        case 'end':
                            return _context52.stop();
                    }
                }
            }, _callee52, this);
        }));

        return function (_x101, _x102) {
            return _ref52.apply(this, arguments);
        };
    }());

    app.post('/manager/getMonthAnalysisReportXL', function () {
        var _ref53 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee53(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee53$(_context53) {
                while (1) {
                    switch (_context53.prev = _context53.next) {
                        case 0:
                            _context53.next = 2;
                            return reportsService.getMonthAnalysisReportXL(req.body.sessionId, req.body.year);

                        case 2:
                            result = _context53.sent;

                            res.status(result.code).send(result.err);

                        case 4:
                        case 'end':
                            return _context53.stop();
                    }
                }
            }, _callee53, this);
        }));

        return function (_x103, _x104) {
            return _ref53.apply(this, arguments);
        };
    }());

    app.get('/manager/getMonthlyHoursSalesmansReport', function () {
        var _ref54 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee54(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee54$(_context54) {
                while (1) {
                    switch (_context54.prev = _context54.next) {
                        case 0:
                            _context54.next = 2;
                            return reportsService.getMonthlyUserHoursReport(req.headers.sessionid, req.query.year, req.query.month);

                        case 2:
                            result = _context54.sent;

                            if (result.code == 200) res.status(200).send(result.report);else res.status(result.code).send(result.err);

                        case 4:
                        case 'end':
                            return _context54.stop();
                    }
                }
            }, _callee54, this);
        }));

        return function (_x105, _x106) {
            return _ref54.apply(this, arguments);
        };
    }());

    app.get('/manager/getMonthlyAnalysisReport', function () {
        var _ref55 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee55(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee55$(_context55) {
                while (1) {
                    switch (_context55.prev = _context55.next) {
                        case 0:
                            _context55.next = 2;
                            return reportsService.getMonthlyAnalysisReport(req.headers.sessionid, parseInt(req.query.year));

                        case 2:
                            result = _context55.sent;

                            if (result.code == 200) res.status(200).send(result.report);else res.status(result.code).send(result.err);

                        case 4:
                        case 'end':
                            return _context55.stop();
                    }
                }
            }, _callee55, this);
        }));

        return function (_x107, _x108) {
            return _ref55.apply(this, arguments);
        };
    }());

    app.post('/manager/updateMonthlyAnalysisReport', function () {
        var _ref56 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee56(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee56$(_context56) {
                while (1) {
                    switch (_context56.prev = _context56.next) {
                        case 0:
                            if (validator.updateMonthlyAnalysisReport(req.body)) {
                                _context56.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context56.abrupt('return');

                        case 3:
                            _context56.next = 5;
                            return reportsService.updateMonthlyAnalysisReport(req.body.sessionId, req.body.year, req.body.report);

                        case 5:
                            result = _context56.sent;

                            if (result.code == 200) res.status(200).send(result.report);else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context56.stop();
                    }
                }
            }, _callee56, this);
        }));

        return function (_x109, _x110) {
            return _ref56.apply(this, arguments);
        };
    }());

    app.post('/manager/updateMonthlyHoursReport', function () {
        var _ref57 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee57(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee57$(_context57) {
                while (1) {
                    switch (_context57.prev = _context57.next) {
                        case 0:
                            if (validator.updateMonthlyHoursReport(req.body)) {
                                _context57.next = 3;
                                break;
                            }

                            res.status(404).send('invalid parameters');
                            return _context57.abrupt('return');

                        case 3:
                            _context57.next = 5;
                            return reportsService.updateMonthlySalesmanHoursReport(req.body.sessionId, req.body.year, req.body.month, req.body.report);

                        case 5:
                            result = _context57.sent;

                            if (result.code == 200) res.status(200).send(result.report);else res.status(result.code).send(result.err);

                        case 7:
                        case 'end':
                            return _context57.stop();
                    }
                }
            }, _callee57, this);
        }));

        return function (_x111, _x112) {
            return _ref57.apply(this, arguments);
        };
    }());

    app.post('/manager/exportMonthlyHoursReport', function () {
        var _ref58 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee58(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee58$(_context58) {
                while (1) {
                    switch (_context58.prev = _context58.next) {
                        case 0:
                            _context58.next = 2;
                            return reportsService.getMonthlyHoursSalesmansReportXl(req.body.sessionId, req.body.year, req.body.month);

                        case 2:
                            result = _context58.sent;

                            console.log('bla');
                            if (result.code == 200) res.status(200).send(result.report);else res.status(result.code).send(result.err);

                        case 5:
                        case 'end':
                            return _context58.stop();
                    }
                }
            }, _callee58, this);
        }));

        return function (_x113, _x114) {
            return _ref58.apply(this, arguments);
        };
    }());

    // -----------------------------Section for deletion API---------------------------------------------------
    app.get('/super/cleanDb', function () {
        var _ref59 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee59(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee59$(_context59) {
                while (1) {
                    switch (_context59.prev = _context59.next) {
                        case 0:
                            if (!(req.query.super == "ibblsservice")) {
                                _context59.next = 7;
                                break;
                            }

                            _context59.next = 3;
                            return deletionService.cleanDb();

                        case 3:
                            result = _context59.sent;

                            if (result.result.ok == 1) res.status(200).send("DB is successfully deleted");else res.status(500).send("could not delete db");
                            _context59.next = 8;
                            break;

                        case 7:
                            res.status(404).send("unauthorized");

                        case 8:
                        case 'end':
                            return _context59.stop();
                    }
                }
            }, _callee59, this);
        }));

        return function (_x115, _x116) {
            return _ref59.apply(this, arguments);
        };
    }());

    app.get('/super/cleanUsers', function () {
        var _ref60 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee60(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee60$(_context60) {
                while (1) {
                    switch (_context60.prev = _context60.next) {
                        case 0:
                            if (!(req.query.super == "ibblsservice")) {
                                _context60.next = 7;
                                break;
                            }

                            _context60.next = 3;
                            return deletionService.cleanUsers();

                        case 3:
                            result = _context60.sent;

                            if (result.result.ok == 1) res.status(200).send("Users are successfully deleted");else res.status(500).send("could not delete ");
                            _context60.next = 8;
                            break;

                        case 7:
                            res.status(404).send("unauthorized");

                        case 8:
                        case 'end':
                            return _context60.stop();
                    }
                }
            }, _callee60, this);
        }));

        return function (_x117, _x118) {
            return _ref60.apply(this, arguments);
        };
    }());

    app.get('/super/cleanShifts', function () {
        var _ref61 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee61(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee61$(_context61) {
                while (1) {
                    switch (_context61.prev = _context61.next) {
                        case 0:
                            if (!(req.query.super == "ibblsservice")) {
                                _context61.next = 7;
                                break;
                            }

                            _context61.next = 3;
                            return deletionService.cleanShifts();

                        case 3:
                            result = _context61.sent;

                            if (result.result.ok == 1) res.status(200).send("shifts are successfully deleted");else res.status(500).send("could not delete");
                            _context61.next = 8;
                            break;

                        case 7:
                            res.status(404).send("unauthorized");

                        case 8:
                        case 'end':
                            return _context61.stop();
                    }
                }
            }, _callee61, this);
        }));

        return function (_x119, _x120) {
            return _ref61.apply(this, arguments);
        };
    }());

    app.get('/super/cleanProducts', function () {
        var _ref62 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee62(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee62$(_context62) {
                while (1) {
                    switch (_context62.prev = _context62.next) {
                        case 0:
                            if (!(req.query.super == "ibblsservice")) {
                                _context62.next = 7;
                                break;
                            }

                            _context62.next = 3;
                            return deletionService.cleanProducts();

                        case 3:
                            result = _context62.sent;

                            if (result.result.ok == 1) res.status(200).send("products are successfully deleted");else res.status(500).send("could not delete ");
                            _context62.next = 8;
                            break;

                        case 7:
                            res.status(404).send("unauthorized");

                        case 8:
                        case 'end':
                            return _context62.stop();
                    }
                }
            }, _callee62, this);
        }));

        return function (_x121, _x122) {
            return _ref62.apply(this, arguments);
        };
    }());

    app.get('/super/cleanStores', function () {
        var _ref63 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee63(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee63$(_context63) {
                while (1) {
                    switch (_context63.prev = _context63.next) {
                        case 0:
                            if (!(req.query.super == "ibblsservice")) {
                                _context63.next = 7;
                                break;
                            }

                            _context63.next = 3;
                            return deletionService.cleanStores();

                        case 3:
                            result = _context63.sent;

                            if (result.result.ok == 1) res.status(200).send("stores are successfully deleted");else res.status(500).send("could not delete ");
                            _context63.next = 8;
                            break;

                        case 7:
                            res.status(404).send("unauthorized");

                        case 8:
                        case 'end':
                            return _context63.stop();
                    }
                }
            }, _callee63, this);
        }));

        return function (_x123, _x124) {
            return _ref63.apply(this, arguments);
        };
    }());

    app.get('/super/cleanMessages', function () {
        var _ref64 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee64(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee64$(_context64) {
                while (1) {
                    switch (_context64.prev = _context64.next) {
                        case 0:
                            if (!(req.query.super == "ibblsservice")) {
                                _context64.next = 7;
                                break;
                            }

                            _context64.next = 3;
                            return deletionService.cleanMessages();

                        case 3:
                            result = _context64.sent;

                            if (result.result.ok == 1) res.status(200).send("messages are successfully deleted");else res.status(500).send("could not delete ");
                            _context64.next = 8;
                            break;

                        case 7:
                            res.status(404).send("unauthorized");

                        case 8:
                        case 'end':
                            return _context64.stop();
                    }
                }
            }, _callee64, this);
        }));

        return function (_x125, _x126) {
            return _ref64.apply(this, arguments);
        };
    }());

    app.get('/super/cleanEncs', function () {
        var _ref65 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee65(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee65$(_context65) {
                while (1) {
                    switch (_context65.prev = _context65.next) {
                        case 0:
                            if (!(req.query.super == "ibblsservice")) {
                                _context65.next = 7;
                                break;
                            }

                            _context65.next = 3;
                            return deletionService.cleanEncs();

                        case 3:
                            result = _context65.sent;

                            if (result.result.ok == 1) res.status(200).send("encouragements are successfully deleted");else res.status(500).send("could not delete");
                            _context65.next = 8;
                            break;

                        case 7:
                            res.status(404).send("unauthorized");

                        case 8:
                        case 'end':
                            return _context65.stop();
                    }
                }
            }, _callee65, this);
        }));

        return function (_x127, _x128) {
            return _ref65.apply(this, arguments);
        };
    }());

    app.get('/super/cleanAnalyzeReports', function () {
        var _ref66 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee66(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee66$(_context66) {
                while (1) {
                    switch (_context66.prev = _context66.next) {
                        case 0:
                            if (!(req.query.super == "ibblsservice")) {
                                _context66.next = 7;
                                break;
                            }

                            _context66.next = 3;
                            return deletionService.cleanMAReports();

                        case 3:
                            result = _context66.sent;

                            if (result.result.ok == 1) res.status(200).send("reports are successfully deleted");else res.status(500).send("could not delete");
                            _context66.next = 8;
                            break;

                        case 7:
                            res.status(404).send("unauthorized");

                        case 8:
                        case 'end':
                            return _context66.stop();
                    }
                }
            }, _callee66, this);
        }));

        return function (_x129, _x130) {
            return _ref66.apply(this, arguments);
        };
    }());

    app.get('/super/cleanMonthlyHoursReports', function () {
        var _ref67 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee67(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee67$(_context67) {
                while (1) {
                    switch (_context67.prev = _context67.next) {
                        case 0:
                            if (!(req.query.super == "ibblsservice")) {
                                _context67.next = 7;
                                break;
                            }

                            _context67.next = 3;
                            return deletionService.cleanSMHReports();

                        case 3:
                            result = _context67.sent;

                            if (result.result.ok == 1) res.status(200).send("reports are successfully deleted");else res.status(500).send("could not delete");
                            _context67.next = 8;
                            break;

                        case 7:
                            res.status(404).send("unauthorized");

                        case 8:
                        case 'end':
                            return _context67.stop();
                    }
                }
            }, _callee67, this);
        }));

        return function (_x131, _x132) {
            return _ref67.apply(this, arguments);
        };
    }());

    app.get('/super/initiateProducts', function () {
        var _ref68 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee68(req, res) {
            var result;
            return _regenerator2.default.wrap(function _callee68$(_context68) {
                while (1) {
                    switch (_context68.prev = _context68.next) {
                        case 0:
                            if (!(req.query.super == "ibblsservices")) {
                                _context68.next = 7;
                                break;
                            }

                            _context68.next = 3;
                            return deletionService.initiateProducts();

                        case 3:
                            result = _context68.sent;

                            if (result == true) res.status(200).send("products are initiated in db");else res.status(500).send("could not initiate products db");
                            _context68.next = 8;
                            break;

                        case 7:
                            res.status(404).send("unauthorized");

                        case 8:
                        case 'end':
                            return _context68.stop();
                    }
                }
            }, _callee68, this);
        }));

        return function (_x133, _x134) {
            return _ref68.apply(this, arguments);
        };
    }());
}
//# sourceMappingURL=main.js.map