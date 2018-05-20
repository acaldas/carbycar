const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LocationSchema = new Schema({
    text: { type: String },
    latitude: Number,
    longitude: Number
});

module.exports = mongoose.model("Location", LocationSchema);
