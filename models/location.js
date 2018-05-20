const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LocationSchema = new Schema({
    type: { type: String },
    coordinates: [Number]
});

module.exports = mongoose.model("Location", LocationSchema);
