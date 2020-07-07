// const mongoose = require("mongoose")
const Click = require("../models/click")
const asynnc = require("async")
const Search = require("../models/search")

module.exports = (data, callback) => {
    let click_id
    asynnc.series({
        save_click: (async_cb) => {
            console.log("save the new click %s", data.link_id)
            const click = new Click({
                link: data.link_id,
                follower: data.follower_id
            })

            console.log("click to save : %s", click)
            click.save().then(result => {
                if (Object.keys(result).length) {
                    click_id = result._id
                    async_cb(null, true)
                } else{
                    callback({
                        confirm: false,
                        message: "Can't find the click saved!"
                    })
                    return
                }
            }).catch(err => {
                callback({
                    confirm: false,
                    message: ("%s Can't save the click", JSON.stringify(err))
                })
                return
            })
        },
        push_to_search : (async_cb) => {
            console.log("search id : %s", data.search_id)
            if(data.search_id !== undefined){
                console.log("push_to_search")
                Search.updateOne({
                    _id: data.search_id
                },
                {
                     $push : {
                       clicks: click_id
                    }
                }).then(result => {
                    if(Object.keys(result).length){
                        async_cb(null, true)
                    } else{
                        callback({message: "Can't push the click on the search"})
                        return
                    }
                }).catch(err => {
                    console.log('err : %s',err)
                    callback({message: "An error occurred while pushing click id to search"})
                })
            } else            
                async_cb(null, true)

        }

    }, (err, results) => {
        if(err)
            callback({message: "An error occurred while redirecting to the link"})
        else if(results.save_click && results.push_to_search){
            callback({
                confirm: true
            })
        } else {
            callback({message: "Something is wrong!"})
        }
    })


}