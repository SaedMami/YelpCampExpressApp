var middlewareObj = {};
var Campground = require("../models/campground");
var Comment =  require("../models/comment");

// middleware to check if there is a logged in user
middlewareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first");
    res.redirect("/login");
};

middlewareObj.checkCampgroudOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        var currentUser = req.user;
        var campGroundID = req.params.campground_id;
        Campground.findById(campGroundID, function(err, foundCampGround) {
        if (err) {
            console.log(err);
            req.flash("error", "Campground not found");
            return res.redirect("back");
        }
        if (foundCampGround.author.id.equals(currentUser._id)) {
            next();
        } else {
            req.flash("error", "You don't have permission to do that");
            res.redirect("back");
        }
    });
    } else {
        req.flash("error", "Please log in first");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        var currentUser = req.user;
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                console.log(err);
                return res.redirect('back');
            }
            if (foundComment.author.id.equals(currentUser._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect('back');
            }
        });
    } else {
        req.flash("error", "Please log in first");
        res.redirect('back');
    }
};


module.exports = middlewareObj;