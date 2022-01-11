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

function checkAuthenticated(req) {
    return ({
        authenticated: req.isAuthenticated(),
        user: req.isAuthenticated() ? req.user : null
    });
}

router.get("/getRecentPosts", (req, res) => {
    Post.find((err, result) => {
        if (err) {
            console.log(err);
            res.send({error: err, message: "an error occured retrieving posts"});
        }
        else {
            console.log(result);
            res.send(result);
        }
    });
});

router.get("/checkAuthenticated", (req, res) => {
    res.json(checkAuthenticated(req));
});

router.get('/', (req, res) => {
    if (checkAuthenticated(req).authenticated) {
        res.sendFile(path.resolve(__dirname + "./../views/index.html"));
    }
    else {
        res.sendFile(path.resolve(__dirname + "./../views/noauthuser.html"));
    }
    
});

router.get("/login", (req, res) => {
    res.sendFile(path.resolve(__dirname + "./../views/login.html"));
});
router.get("/failedLogin", (req, res) => {
    res.json({
        status: false,
        message: "failed to log in wrong password or username"
    });
});
router.post("/login", passport.authenticate("local", {failureRedirect: "/failedLogin" ,failureMessage: true}), (req, res) => {
    console.log(req.body.username + " has been logged in");
    res.json({
        status: true,
        message: "logged in successfully"
    });
    // query database here. if incorrect password or username send back false object
    

    // res.json({
    //     status: false,
    //     reason: "none of yo business"
    // });
});

router.get("/signup", (req, res) => {
    res.sendFile(path.resolve(__dirname + "./../views/signup.html"));
});
router.post("/signup", (req, res) => {
    console.log(req.body.username);
    console.log(req.body.password);
    //if username found return false object
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
                User.create(userData, (err, resObj) => {
                    if (err) {
                        console.log("error occurred adding user to database. ", err);
                    }
                    console.log(resObj);
                    req.login(resObj, (err) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log("user logged in", resObj);
                        }
                        res.json(resObj);
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

});

router.post("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
});
module.exports = router;