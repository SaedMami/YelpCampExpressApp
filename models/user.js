var mongoose = require("mongoose");


var userSchema = mongoose.Schema({
    username: String,
    passport: String
});

userSchema.plugin(require("passport-local-mongoose"));

module.exports = mongoose.model("User", userSchema);