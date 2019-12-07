// const sgMail = require('@sendgrid/mail');
// const sendgridAPIkey = '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';

// sgMail.setApiKey(sendgridAPIkey);

// sgMail.send({
//     from: 'sale@steam.com',
//     to: 'cacinkknight@gmail.com',
//     subject: 'eyyo',
//     text: 'yo waddup'
// });

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_PASSWORD
    }
});

const sendWelcomeEmail = (email, name) => {
    
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'eyyo',
        text: `welcome mi amor, ${name}`
    };

    transporter.sendMail(mailOptions, function(err, info) {
        if (err) console.log(err);
        console.log('email sent: ' + info);
    });
};

const sendCancelationEmail = (email, name) => {
    
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'why tho',
        text: `Hey ${name}, would you be so kind as to tell us the reason behind you deleting your account?`
    };

    transporter.sendMail(mailOptions, function(err, info) {
        if (err) console.log(err);
        console.log('email sent: ' + info);
    });
};

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}