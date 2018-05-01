const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const DISTRICT_LIST = ["Aldão", "Arões (São Romão)"];
const VEHICLE_LIST = [
    "Ligeiro de Passageiros",
    "Ligeiro de Mercadorias",
    "Pesado de Passageiros",
    "Pesado de Mercadorias",
    "Motociclo",
    "Outro"
];

const SALT_WORK_FACTOR = 10;
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    name: { type: String, required: true },
    district: { type: String, required: true, enum: DISTRICT_LIST },
    vehicle: { type: String, required: true, enum: VEHICLE_LIST }
});

UserSchema.pre("save", function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.verifyUser = function(username, password, callback) {
    User.findOne({ username: username }, function(err, user) {
        if (err) throw err;

        user.comparePassword(password, function(err, isMatch) {
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

mongoose.model("User", UserSchema);
