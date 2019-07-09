var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX: campgrounds
router.get('/', function(req, res) {
	Campground.find({}, function(err, campGrounds) {
		if (err) {
			console.log('error retrieving campground from the database');
            req.flash("error", "An error occured");
            res.redirect("back");
		} else {
			res.render('campgrounds/index', {campGrounds: campGrounds});
		}
	});
});

// CREATE: show the form to add new campground
router.get('/new', middleware.isLoggedIn, function(req, res) {
	res.render('campgrounds/new');
});

// SAVE: add a new campground to the database
router.post('/', middleware.isLoggedIn, function(req, res) {

	// add to campgrounds data base
	Campground.create(req.body.campground, function(err, createdCampground) {
		if (err || !createdCampground) {
			console.log('error adding a campground to the database');
			console.log(campground);
            req.flash("error", "failed to save campground");
            res.redirect('/campgrounds');
            
		} else {
			// add the current user info
			var currentUser = req.user;
			var author = {
				id: currentUser._id,
				username: currentUser.username
			};
			createdCampground.author = author;
			createdCampground.save();
            
            req.flash("success", "Added campground successfully!");
			res.redirect('/campgrounds');
		}
	});
});

// SHOW
router.get('/:campground_id', function(req, res) {
	// find the campground from the database
	Campground.findById(req.params.campground_id)
		.populate('comments')
		.exec(function(err, foundCampGround) {
			if (err || !foundCampGround) {
				console.log('failed to retrive campground with ID ' + req.params.campground_id);
                req.flash("error", "An error occured");
                res.redirect("back");
			} else {
				res.render('campgrounds/show', { campGround: foundCampGround });
			}
		});
});

// Edit Campground
router.get('/:campground_id/edit', middleware.checkCampgroudOwnership, function (req,res) {
    Campground.findById(req.params.campground_id, function (err, foundCampGround) {
        if (err) {
            console.log(err);
            res.redirect("/camgrounds");
        } else {
            res.render("campgrounds/edit", {campGround : foundCampGround});
        }
    });
});


// Update route
router.put('/:campground_id', middleware.checkCampgroudOwnership, function (req,res) {
    Campground.findByIdAndUpdate(req.params.campground_id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.campground_id);
        }
    });
});

// Destroy route
router.delete('/:campground_id', middleware.checkCampgroudOwnership, function (req,res) {
    Campground.findByIdAndRemove(req.params.campground_id, function (err) {
        if (err) {
            console.log(err);
            req.flash("error", "Failed to delete background");
        } else {
            req.flash("success", "Campground deleted!");
        }

        res.redirect("/campgrounds");
    });
});

module.exports = router;
