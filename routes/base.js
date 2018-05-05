const express = require("express");
const User = require("../models/user");
const Vehicle = require("../models/vehicle");
const router = express.Router();

router.get("/", function(req, res) {
    res.render("index");
});

router.get("/signup", function(req, res) {
    res.render("signup", {
        vehicle_types: Vehicle.getVehicleTypes(),
        district_list: User.getDistrictList()
    });
});

router.post("/signup", function(req, res) {
    let userData = req.body;
    let vehicle = new Vehicle({ type: userData.vehicle });
    User.create(
        {
            username: userData.username,
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
                    district_list: User.getDistrictList()
                });
                return;
            }
            _login(req);
            res.render("index");
        }
    );
});

router.post("/login", function(req, res) {
    let username = req.body.username;
    User.verifyLogin(username, req.body.password, valid => {
        if (valid) {
            _login(req, username);
            res.redirect("/");
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

const _login = function(req, username) {
    req.session.username = username;
};

module.exports = router;
