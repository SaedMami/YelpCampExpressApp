var mongoose = require("mongoose");

var campGroundSchema = new mongoose.Schema({
    name : String,
    image : String,
    price: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String 
	}
});

module.exports = mongoose.model("Campground", campGroundSchema);