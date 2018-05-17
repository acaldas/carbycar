const express = require("express");
const config = require("../config");
const User = require("../models/user");
const Vehicle = require("../models/vehicle");
const router = express.Router();

router.get("/", function(req, res) {
    res.render("index");
});

router.get("/signup", function(req, res) {
    res.render("signup", {
        vehicle_types: Vehicle.getVehicleTypes(),
        district_list: config.Districts
    });
});

router.post("/signup", function(req, res) {
    let userData = req.body;
    let vehicle = userData.vehicle
        ? new Vehicle({ type: userData.vehicle })
        : null;
    User.create(
        {
            email: userData.email,
            password: userData.password,
            name: userData.name,
            district: userData.district,
            vehicle: vehicle
        },
        error => {
            if (error) {
                let errorMessage =
                    error.code === 11000
                        ? "Nome de utilizador já existente"
                        : "Perfil inválido";
                res.render("signup", {
                    user: userData,
                    error: errorMessage,
                    vehicle_types: Vehicle.getVehicleTypes(),
                    district_list: config.Districts
                });
                return;
            }
            _login(req, userData, () => res.redirect("/"));
        }
    );
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", function(req, res) {
    let email = req.body.email;
    User.verifyLogin(email, req.body.password, (valid, user) => {
        if (valid) {
            _login(req, user, () => res.redirect("/"));
        } else {
            res.render("index", { error: "Login inválido" });
        }
    });
});

router.get("/logout", function(req, res, next) {
    req.session.destroy(function(err) {
        if (err) {
            return next(err);
        } else {
            return res.redirect("/");
        }
    });
});

const _login = function(req, user, callback) {
    req.session.regenerate(() => {
        req.session.email = user.email;
        req.session.name = user.name;
        callback();
    });
};

module.exports = router;
