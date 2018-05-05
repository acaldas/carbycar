const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Vehicle = require("./vehicle");

const DISTRICT_LIST = ["Aldão", "Arões (São Romão)"];

const SALT_WORK_FACTOR = 10;
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    name: { type: String, required: true },
    district: { type: String, required: true, enum: DISTRICT_LIST },
    vehicle: { type: Vehicle.schema, required: true }
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

UserSchema.statics.getDistrictList = function() {
    return DISTRICT_LIST;
};

UserSchema.statics.verifyLogin = function(username, password, callback) {
    User.findOne({ username: username }, function(err, user) {
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
