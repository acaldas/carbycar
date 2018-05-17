const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const config = require("../config");
const Vehicle = require("./vehicle");

const SALT_WORK_FACTOR = 10;
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    name: { type: String, required: true },
    district: { type: String, required: true, enum: config.Districts },
    vehicle: { type: Vehicle.schema }
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
    User.findOne({ email: email }, function(err, user) {
        if (err || !user) {
            callback(false);
            return;
        }

        user._comparePassword(password, function(err, isMatch) {
            if (err) throw err;
            callback(isMatch);
        });
    });
};

UserSchema.methods._comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const User = (module.exports = mongoose.model("User", UserSchema));
