const nodemailer = require('nodemailer');
const config = {
    "subject": "Сообщение с сайта",
    "smtp": {
        "host": "smtp.gmail.com",
        "port": 465,
        "secure": true,
        "auth": {
            "user": "webinar.loftschool@gmail.com",
            "pass": "loft2018"
        }
    }
}

exports.sendMail = (req) => new Promise((resolve, reject) => {

    // Generate SMTP service account from ethereal.email
    nodemailer.createTestAccount((err, account) => {
        if (err) {
            console.error('Failed to create a testing account. ' + err.message);
            reject({
                code: 409,
                message: 'Email not sended'
            });
        }

        console.log('Credentials obtained, sending message...');

        // Create a SMTP transporter object
        let transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });

        // Message object
        let message = {
            from: `${req.body.name} - ${req.body.email}`,
            to: config.smtp.auth.user,
            subject: config.subject,
            text: req.body.message.trim().slice(0, 500),
            html: '<p><b>Hello</b> to myself!</p>'
        };

        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred. ' + err.message);
                reject({
                    code: 409,
                    message: 'Email not sended'
                });
            }

            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            resolve({result: true})
        });
    });
})
