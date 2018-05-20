const express = require("express");
const Route = require("../models/route");
const Vehicle = require("../models/vehicle");
const router = express.Router();

const RouteParameters = {
    days_types: Route.getDayTypes(),
    time_types: Route.getTimeTypes(),
    vehicle_types: Vehicle.getVehicleTypes()
};

const checkAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect("/login?next=/routes" + req.url);
    }
};

router.get("/", (req, res) => {
    Route.find({}, (err, routes) => {
        routes = routes || [];
        res.render("route/list", { routes: routes });
    });
});

router.get("/create", checkAuth, (req, res) => {
    res.render("route/create", RouteParameters);
});

router.get("/:id", (req, res) => {
    let id = req.query.id;
    Route.findById(id, (err, route) => {
        res.render("route/show", { route: route });
    });
});

router.post("/", checkAuth, (req, res) => {
    let routeData = req.body;
    let vehicle = routeData.vehicle
        ? new Vehicle({ type: routeData.vehicle })
        : null;
    Route.create(
        {
            driver: routeData.driver,
            vehicle: vehicle,
            days: routeData.days,
            time: routeData.time,
            seats: routeData.seats
        },
        (error, route) => {
            if (error) {
                res.render(
                    "route/create",
                    Object.assign(
                        {
                            route: routeData,
                            error: error
                        },
                        RouteParameters
                    )
                );
            } else {
                res.redirect("/routes/" + route.id);
            }
        }
    );
});

module.exports = router;
