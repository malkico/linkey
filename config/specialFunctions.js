var passwordValidator = require('password-validator');
var schemaPassword = new passwordValidator();
var passwordValidator = require('password-validator');

schemaPassword
    .has().uppercase() // Must have uppercase letters
    .has().lowercase() // Must have lowercase letters
    .has().digits() // Must have digits
    .has().not().spaces() // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

exports.checkSpecialChars = (field) => {
    if (/[\<\>\/\\\'\"]/.exec(field))
        throw new Error("It does not allow special characters like < > ' \" \\ /")

    return true
}

exports.checkPassword = value => {
    const errors = schemaPassword.validate(value, {
        list: true
    })
    errors.forEach(err => {
        switch (err) {
            case "uppercase":
                throw new Error("Must include at least one upper case letter")
                break;
            case "lowercase":
                throw new Error("Must include at least one lower case letter")
                break;
            case "digits":
                throw new Error("Must include at least one numeric character")
                break;
            case "spaces":
                throw new Error("It does not allow blank spaces")
                break;
            default:
                throw new Error('Please enter a valid password %s', err)
        }
    })
    return true;
}
