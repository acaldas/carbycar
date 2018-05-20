const mongoose = require("mongoose");
const Location = require("../models/location");
const Passenger = require("../models/passenger");
const Vehicle = require("./vehicle");

const Schema = mongoose.Schema;

const DAY_TYPES = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira"
];

const TIME_TYPES = ["8:15", "13:15"];

const ERROR_TYPES = {
    NO_SEATS: "Não há lugares disponíveis"
};

const RouteSchema = new Schema(
    {
        driver: { type: Schema.Types.ObjectId, ref: "User", required: true },
        vehicle: { type: Vehicle.schema, required: true },
        days: {
            type: [String],
            required: true,
            enum: DAY_TYPES,
            validate: {
                validator: v => {
                    return v.length;
                }
            }
        },
        time: { type: String, required: true, enum: TIME_TYPES },
        seats: { type: Number, required: true },
        location: { type: Location.schema, required: true },
        passengers: { type: [Passenger.schema], default: [] }
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
);

RouteSchema.virtual("isFull").get(() => {
    return this.seats - this.passengers.length <= 0;
});

RouteSchema.methods.addPassenger = function(passenger, callback) {
    if (this.isFull) {
        return callback(ERROR_TYPES.NO_SEATS);
    }
    this.passengers.push(passenger);
    this.save(callback);
};

RouteSchema.statics.getDayTypes = function() {
    return DAY_TYPES;
};

RouteSchema.statics.getTimeTypes = function() {
    return TIME_TYPES;
};

module.exports = mongoose.model("Route", RouteSchema);
