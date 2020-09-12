const Search = require("../models/search")
const addSearch = (obj) => {
    console.log("SearchDao.addSearch => %s", obj)
    return obj.save()
}
exports.addSearch = addSearch

const addClick = (click_id, search_id) => {
    const obj = {
        where: {
            _id: search_id
        },
        set: {
            $push: {
                clicks: click_id
            }
        },
    }
    console.log("SearchDao.addClick => %s", obj)
    return Search.updateOne(obj.where, obj.set)
}
exports.addClick = addClick