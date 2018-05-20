const mongoose = require("mongoose");
const googleMaps = require("@google/maps");
const Location = require("../models/location");
const Passenger = require("../models/passenger");
const Vehicle = require("./vehicle");
const config = require("../config");

const Schema = mongoose.Schema;

const googleMapsClient = googleMaps.createClient({
    key: process.env.GOOGLE_MAPS_API
});

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

RouteSchema.virtual("availableSeats").get(function() {
    return this.seats - this.passengers.length;
});

RouteSchema.virtual("isFull").get(function() {
    return this.availableSeats <= 0;
});

RouteSchema.methods.getRouteQueryString = function() {
    let toSchool = this.time === TIME_TYPES[0];
    let driverLocation = this.location.latitude + "," + this.location.longitude;
    let schoolLocation = encodeURIComponent(config.School.name);
    let origin = toSchool ? driverLocation : schoolLocation;
    let destination = toSchool ? schoolLocation : driverLocation;
    let waypoints = this.passengers.map(
        p => p.location.latitude + "," + p.location.longitude
    );
    let query =
        "origin=" + origin + "&destination=" + destination + "&mode=driving";

    waypoints = [
        "41.45857298561265,-8.263590978235015",
        "41.45657889577495,-8.278310941308632"
    ];

    var test = googleMapsClient.directions(
        {
            origin: toSchool ? this.location : schoolLocation,
            destination: toSchool ? schoolLocation : this.location,
            mode: "driving",
            optimize: true
        },
        function(response) {
            console.log(response.json.results);
        }
    );

    query = waypoints.length
        ? query + "&waypoints=" + waypoints.join("|") + "&optimizeWaypoints=1"
        : query;

    return query;
};

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
