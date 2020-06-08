const Search = require("../models/search")
const specialFuncts = require("../config/specialFunctions")
const i18n = require("i18n")
module.exports = (data, callback) => {
            data.keyword = data.keyword.replace(/ +/g, " ").trim()
            if(data.keyword === ""){
                callback({message : i18n.__("follower_page.search_form.result.tape_key")})
                return 
            }
            try{
                specialFuncts.checkSpecialChars(data.keyword)
            }catch(err){
                callback({message : err.message})
                return
            }

            const search = new Search({
                keyword: data.keyword,
                influencer: data.influencer_id,
                follower: data.follower_id
            })

            search.save().then( result => {
                if(Object.keys(result).length){
                    callback({confirm: true, search_id: result._id.toString()})
                    return
                }
                else{
                    callback({message: "Can't find the keywords we just saved!"})
                    return
                }
            }).catch(err => {
                callback({message : "An error producing while saving search kewords"})
                console.log("err => %s", err)
                return
            })



}