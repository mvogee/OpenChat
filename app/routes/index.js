const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env')});
const mongoose = require('mongoose');
const {connectmongoose, User, Post} = require(path.resolve(path.join(__dirname, '../db.js')));
const bcrypt = require("bcrypt");
const passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
let saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
var router = require('express').Router();

connectmongoose(mongoose, process.env.DB_ROUTE);

router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + "./../views/index.html"));
    //res.send("hello");
});

router.get("/login", (req, res) => {
    res.sendFile(path.resolve(__dirname + "./../views/login.html"));
});
router.post("/login", (req, res) => {
    console.log("a login request has been received");
    console.log(req.body.username);
    console.log(req.body.password);
    // query database here. if incorrect password or username send back false object
    res.json({
        status: false,
        reason: "none of yo business"
    });
});

router.get("/signup", (req, res) => {
    res.sendFile(path.resolve(__dirname + "./../views/signup.html"));
});
router.post("/signup", (req, res) => {
    console.log(req.body.username);
    console.log(req.body.password);
    // query database here. if username found return false object
    User.find({userName: req.body.username}, (err, result) => {
        if (err) {
            console.log("an error occurred: ", err);
        }
        if (result.length === 0) {
            console.log("no result username available");
            bcrypt.hash(req.body.password, saltRounds, (err, encrypted) => {
                if (err) {
                    console.log("error occurred encrypting password: ", err);
                }
                let userData = {
                    userName: req.body.username,
                    email: req.body.email ? req.body.email : null,
                    password: encrypted,
                    created: new Date,
                }
                User.create(userData, (err, result) => {
                    if (err) {
                        console.log("error occurred adding user to database. ", err);
                    }
                    console.log(result);
                    req.login(result, (err) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log("user has been logged in?");
                        }
                        res.json(result);
                    });
                    
                });
            });
        }
        else {
            res.json({
                status: false,
                reason: "username already used"
            });
        }
        console.log(result);
    });
    // otherwise enter new user into database. encrypt password and email.
    // decryption here
    
});
module.exports = router;