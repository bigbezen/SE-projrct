function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport('smtps://IBBLSServices%40gmail.com:0192837465@smtp.gmail.com');

var sendMail = (() => {
    var _ref = _asyncToGenerator(function* (recepientArr, subject, text) {
        var mailOptions = {
            from: '"IBBLS 👥" <IBBLSServices@gmail.com>', // sender address
            to: recepientArr.join(', '),
            subject: subject,
            text: text

        };
        var result = yield transporter.sendMail(mailOptions);
        console.log(result);
    });

    return function sendMail(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
})();

module.exports.sendMail = sendMail;