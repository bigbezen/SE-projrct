var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport('smtps://IBBLSServices%40gmail.com:0192837465@smtp.gmail.com');

var subjects = {
    'retrievePassword': 'IBBLS Services - Retrieved Details'
};


var sendMail = async function(recepientArr, subject, text , filePath) {
    var mailOptions = {
        from: '"IBBLS 👥" <IBBLSServices@gmail.com>', // sender address
        to: recepientArr.join(', '),
        subject: subject,
        text: text,
        attachments:  [{'path': filePath}]
    };
    var result = await transporter.sendMail(mailOptions);
    return (result.accepted.length > 0);
};

module.exports.sendMail = sendMail;
module.exports.subjects = subjects;