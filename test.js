const async = require("async");

async.series({
    one: function (callback) {
        setTimeout(function () {
            console.log("one")
            callback(null, true);
        }, 200);
    },
    two: function (callback) {
        setTimeout(function () {
            console.log("twi")
            callback(null, true);
        }, 100);
    }
}, function (err, results) {
    // results is now equal to: {one: 1, two: 2}
});