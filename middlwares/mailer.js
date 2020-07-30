const nodemailer = require('nodemailer');
const helper = require("../config/registerHelper")
var transporter

/* ***************** INIT MAILER **************** */
const init = async (subscriber) => {
    console.log("sending mail to %s ", subscriber.email)

    let testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: testAccount.smtp.secure || false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        }, 
    }); 

    /* transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'hichamlmalki@gmail.com',
            pass: 'fiat1685..'
        },
        rejectUnauthorized: false
    });  */
}

/* ******************* SEND Confirmation code ******************** */
exports.send = async (subscriber, influencer, confirm_code, next) => {
    await init(subscriber)
    const confirmation_URL = process.env.domain + "/account/confirmation/" + confirm_code
    console.log("confirmation_URL ==> %s ", confirmation_URL)
    const mailOptions = {
        to: subscriber.email,
        subject: 'Sending Email using Node.js',
        html: "<pre>" + helper.translate("mailer.welcome.1", subscriber.first_name, influencer.login, influencer.password) +
            "<a href='" + confirmation_URL + "'>" + confirmation_URL + "</a>" +
            helper.translate("mailer.welcome.2") +
            "</pre>"
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

/* ************************** SEND RESET PASSWORD LINK  *************** */
exports.resetPass = async (influencer, res, next, page) => {
    const generator = require('generate-password');
    const password = generator.generate({
        length: 10,
        numbers: true
    });

    await init(influencer.subscriber);

    const reset_URL = process.env.domain + "/reset-password/" + password +"/"+influencer._id
    console.log("confirmation_URL %s ==> %s ",influencer.subscriber.first_name, reset_URL)
    const mailOptions = {
        to: influencer.subscriber.email,
        // to : "khkjhkjkjh@hgj.ih",
        subject: 'Password reset request | ' + process.env.plateform_name,
        html: "<pre>" + helper.translate("mailer.reset_password.1", influencer.subscriber.first_name) + "<b>" + password + "</b>" +
            "\n\n" + helper.translate("mailer.reset_password.2", reset_URL) +
            "\n\n" +
            helper.translate("mailer.reset_password.3") +
            "</pre>"
    };

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Email not send : " + error);
            res.locals.result = "Can't send the reset link to this email, please try again."
            res.locals.success = false
            res.render(page)
            return

        } else {
            console.log('Email sent: M' + info.response);
            next()
        }

    });
}