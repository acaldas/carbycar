const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const config = require("../config");

const SALT_WORK_FACTOR = 10;
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true },
    district: { type: String, required: true, enum: config.Districts }
});

UserSchema.pre("save", function(next) {
    let user = this;
    if (!user.isModified("password")) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.statics.verifyLogin = function(email, password, callback) {
    User.findOne({ email: email })
        .select("+password")
        .exec(function(err, user) {
            if (err || !user) {
                callback(false);
                return;
            }

            user._comparePassword(password, function(err, isMatch) {
                if (err) throw err;
                callback(isMatch, user);
            });
        });
};

UserSchema.methods._comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

const User = (module.exports = mongoose.model("User", UserSchema));
