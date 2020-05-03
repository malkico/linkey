var LinkModel = require('../models/link')
const Link = LinkModel.LinkSchema
const validator = require('express-validator');

// Console.log(Link.link_type[0]);
exports.addLinkController = function(req,res,next){
    res.render("influencer/add-link", {link_type: LinkModel.link_type})

}

exports.addLinkPostController = function(req, res, next){
    res.render("influencer/add-link", {link_type: LinkModel.link_type})
}