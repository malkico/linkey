const Email_status = require("../models/email_status")

const setTrue = (code) => {
    const obj = {
        _id: code,
        set: {
            status: true
        }
    }
    console.log("EmailStatusDao.setTrue => %s", obj)
    return Email_status.findByIdAndUpdate(obj._id, obj.set)
}
exports.setTrue = setTrue

const saveOne = (email_status) => {
    console.log("EmailStatusDao.saveOne => %s", email_status)
    return email_status.save()
}
exports.saveOne = saveOne