const passwordValidator = require('password-validator');
const schemaPassword = new passwordValidator();
const i18n = require("i18n")

schemaPassword
    // .has().uppercase() // Must have uppercase letters
    // .has().lowercase() // Must have lowercase letters
    // .has().digits() // Must have digits
    .is().min(4) // Minimum length 8
    .is().max(30) // Maximum length 100
    .has().not().spaces() // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

exports.checkPassword = value => {
    const errors = schemaPassword.validate(value, {
        list: true
    })
    errors.forEach(err => {
        switch (err) {
            case "min":
                throw new Error("The password is shorter than the minimum allowed length (4)")
            case "max":
                throw new Error("The password is longer than the maximum allowed length (30)")
            case "uppercase":
                throw new Error("Must include at least one upper case letter")
            case "lowercase":
                throw new Error("Must include at least one lower case letter")
            case "digits":
                throw new Error("Must include at least one numeric character")
            case "spaces":
                throw new Error("It does not allow blank spaces")
            default:
                throw new Error('Please enter a valid password')
        }
    })
    return true;
}

exports.checkSpecialChars = (field) => {
    // eslint-disable-next-line no-useless-escape
    if (/[\<\>\/\\\'\"]/.exec(field))
        throw new Error(i18n.__("generals.errors.special_chars"))

    return true
}

exports.catchErrors = (errors, myErrors) => {
    if (errors) {
        Object.keys(errors).forEach((key) => {
            myErrors[errors[key].path] = errors[key].message
            console.log("%s => %s ", errors[key].path, errors[key].message)
        })
    }
}

/*
 exports.updateCookies = (res.cookie, res.locals.cookies) => {
     res.cookie("follower_id", result._id)
 } */