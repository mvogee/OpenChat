const path = require('path');
require('dotenv').config({ path: path.resolve(path.join(__dirname, '../.env'))});
const mongoose = require('mongoose');
const {connectmongoose, User, Post} = require(path.resolve(path.join(__dirname, '../db.js')));

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
    // otherwise enter new user into database. encrypt password and email.
    // decryption here
    res.json({
        status: false,
        reason: "none of yo business"
    });
});
module.exports = router;