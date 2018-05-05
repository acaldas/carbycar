const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VEHICLE_TYPES = [
    "Ligeiro de Passageiros",
    "Ligeiro de Mercadorias",
    "Pesado de Passageiros",
    "Pesado de Mercadorias",
    "Motociclo",
    "Outro"
];

const VehicleSchema = new Schema({
    type: { type: String, required: true, enum: VEHICLE_TYPES }
});

VehicleSchema.statics.getVehicleTypes = function() {
    return VEHICLE_TYPES;
};

module.exports = mongoose.model("Vehicle", VehicleSchema);
