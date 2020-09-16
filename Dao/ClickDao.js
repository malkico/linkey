
const addClick =  (obj) => {
    console.log("ClickDao.addClick => %s",obj)
    return obj.save()
}
exports.addClick = addClick