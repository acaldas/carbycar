const mongoose = require("mongoose");
const Location = require("../models/location");

const Schema = mongoose.Schema;

const PassengerSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    location: { type: Location.schema }
});

module.exports = mongoose.model("Passenger", PassengerSchema);
