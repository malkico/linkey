const async = require("async");

const async1  = () => { async.series([
    function(callback) {
        setTimeout(function() {
            console.log("function 1")
            callback(null, 'one');
        }, 200);
    },
    function(callback) {
        setTimeout(function() {
            console.log("function 2")
            callback(null, 'two');
        }, 100);
    }
],// optional callback
function(err, results) {
    // the results array will equal ['one','two'] even though
    // the second function had a shorter timeout.
    console.log(results)
});
}
const async2 = () => { async.parallel( {"one": function(callback){
    console.log("the END")
    callback(null, "heey")
}
}, (req, res) => {
    console.log("the really end")
}) }


async.series( [
    function(callback){
        async1()
        callback(null, "async1")
    },
    function(callback){
        async2()
        callback(null,"async2")
    }
],(err, results) => {
    console.log(results)
})