// const Visit = require("../models/visit")
const saveOne = (obj) => {
    console.log("VisitDao.saveOne => %s", obj)
    return obj.save()
}
exports.saveOne = saveOne