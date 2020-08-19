
const getController = function (req, res) {
    console.log('Render to main page with GET METHOD');
    res.render('main/');
}


// const getStartedCtrl = require("./getStartdedController")
exports.getController = getController
/* exports.postController = getStartedCtrl.postController
exports.errorController = getStartedCtrl.errorController */