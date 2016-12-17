var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport('smtps://IBBLSServices%40gmail.com:0192837465@smtp.gmail.com');



var sendMail = async function(recepientArr, subject, text) {
    var mailOptions = {
        from: '"IBBLS 👥" <IBBLSServices@gmail.com>', // sender address
        to: recepientArr.join(', '),
        subject: subject,
        text: text

    };
    var result = await transporter.sendMail(mailOptions);
    console.log(result);
};

module.exports.sendMail = sendMail;