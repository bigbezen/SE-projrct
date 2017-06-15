var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport('smtps://IBBLSServices%40gmail.com:ibbls!234@smtp.gmail.com');

var subjects = {
    'retrievePassword': 'IBBLS Services - Retrieved Details'
};


var sendMail = async function(recepientArr, subject, text) {
    var mailOptions = {
        from: '"IBBLS 👥" <IBBLSServices@gmail.com>', // sender address
        to: recepientArr.join(', '),
        subject: subject,
        text: text,
    };
    var result = await transporter.sendMail(mailOptions);
    return result;
};

var sendMailWithFile = async function(recepientArr, subject, text , filePath) {
    var mailOptions = {
        from: '"IBBLS 👥" <IBBLSServices@gmail.com>', // sender address
        subject: subject,
        text: text,
        attachments:  [{'path': filePath}]
    };
    for(let recepient of recepientArr) {
        mailOptions["to"] = recepient;
        try {
                var result = await transporter.sendMail(mailOptions);
        }
        catch(err) {
            console.log(err);
        }
    }
    return result;
};


var sendDummyMail = function(){
    var mailOptions = {
        from: '"IBBLS 👥" <IBBLSServices@gmail.com>', // sender address
        to: 'shahafstein@gmail.com',
        subject: 'test mail',
        text: 'test',
    };
    transporter.sendMail(mailOptions);
};


module.exports.sendMail = sendMail;
module.exports.sendMailWithFile = sendMailWithFile;
module.exports.dummyMail = sendDummyMail;
module.exports.subjects = subjects;