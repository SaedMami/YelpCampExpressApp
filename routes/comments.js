var express = require("express");
var router = express.Router({mergeParams : true});
var Campground =  require("../models/campground");
var Comment =  require("../models/comment");
var middleware = require("../middleware");

// show the form to add new comment
router.get('/new', middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.campground_id, function(err, campground) {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { campground: campground });
		}
	});
});

// POST a new comment to the database
router.post('/', middleware.isLoggedIn,  function(req, res) {
	Campground.findById(req.params.campground_id, function(err, campground) {
		if (err) {
			console.log(err);
            req.flash("error" , "Failed to add comment");
			req.redirect('/campgrounds');
		} else {
			Comment.create(req.body.comment, function(err, createdComment) {
				if (err) {
					console.log(err);
                    req.flash("error" , "Failed to add comment");
			        req.redirect('/campgrounds');
				} else {
					// add username and id to the comment
					var currentUser = req.user;
					console.log("current user is " + currentUser.username);
					createdComment.author.id = currentUser._id;
					createdComment.author.username = currentUser.username;
					createdComment.save();
					campground.comments.push(createdComment);
					campground.save();
                    req.flash("success", "Comment added successfully");
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

// EDIT: show form to edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership,  function(req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            console.log(err);
            res.redirect("back");
            return;
        }
        
        res.render("comments/edit", {comment : foundComment, campgroundID : req.params.campground_id});
    });
});

// UPDATE
router.put("/:comment_id/", middleware.checkCommentOwnership,  function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            console.log(err);
        }
        res.redirect("/campgrounds/" + req.params.campground_id);
    });
});

// DELETE
router.delete('/:comment_id', middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            console.log(err);
        }
        req.flash("success", "Comment deleted");
        res.redirect("/campgrounds/" + req.params.campground_id);
    });
});

module.exports = router;