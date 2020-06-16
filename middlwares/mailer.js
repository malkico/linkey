const nodemailer = require('nodemailer');
const helper = require("../config/registerHelper")
exports.send = async (subscriber, influencer, next) => {
    console.log("sending mail to %s ", subscriber.email)
    // let testAccount = await nodemailer.createTestAccount();
    /* let testAccount = {
        user : "cory73@ethereal.email",
        pass : "xU1sxrP84cmq9tkgsu"
    } */
    /* let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: testAccount.smtp.secure || false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    }); */
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hichamlmalki@gmail.com',
            pass: 'fiat1685'
        },
        rejectUnauthorized: false
    });

    const mailOptions = {
        to: subscriber.email,
        subject: 'Sending Email using Node.js',
        html: "<pre>" + helper.translate("mailer.welcome", subscriber.first_name, influencer.login, influencer.password) + "</pre>"
    };

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Email not send : " + error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        next()
    });
}