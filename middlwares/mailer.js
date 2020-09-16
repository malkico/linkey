const nodemailer = require('nodemailer');
const helper = require("../config/registerHelper")
var transporter
const myEmail = process.env.email
const from = process.env.plateform_name + ' <' + myEmail + '>' // sender address


/* ***************** INIT MAILER **************** */
const init = async (subscriber) => {
    console.log("sending mail to %s ", subscriber.email)

    // if (process.env.NODE_ENV == "production" || 1 == 1 ) {
    if (process.env.NODE_ENV == "production") {
        console.log("Sending from %s ...",myEmail)
        transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: myEmail,
                pass: process.env.email_password
            },
            rejectUnauthorized: false
        });
    } else if (process.env.NODE_ENV == "development") {
        console.log("Sending from ethereal Test Account...")
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
    }
}

/* ******************* SEND Confirmation code ******************** */
exports.send = async (subscriber, influencer, confirm_code, next) => {
    await init(subscriber)
    const confirmation_URL = process.env.domain + "/account/confirmation/" + confirm_code
    console.log("confirmation_URL ==> %s ", confirmation_URL)
    const mailOptions = {
        from: from,
        to: subscriber.email,
        // to: "mister.epay@gmail.com",
        subject: helper.translate("mailer.welcome.title"),
        html: "<pre>" + helper.translate("mailer.welcome.1", subscriber.first_name, subscriber.email, influencer.password) +
            "<a href='" + confirmation_URL + "'>" + confirmation_URL + "</a>" +
            helper.translate("mailer.welcome.2") + "." +
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

    const reset_URL = process.env.domain + "/reset-password/" + password + "/" + influencer._id
    console.log("confirmation_URL %s ==> %s ", influencer.subscriber.first_name, reset_URL)
    const mailOptions = {
        from: from,
        to: influencer.subscriber.email,
        // to : "khkjhkjkjh@hgj.ih",
        subject: 'Password reset request | ' + process.env.plateform_name,
        html: "<pre>" + helper.translate("mailer.reset_password.1", influencer.subscriber.first_name) + "<b>" + password + "</b>" +
            "\n\n" + helper.translate("mailer.reset_password.2", ) + ". \n" + reset_URL +
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