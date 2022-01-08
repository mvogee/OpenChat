const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env')});
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const {connectmongoose, User} = require('./db.js');
var LocalStrategy = require("passport-local").Strategy;


connectmongoose(mongoose, process.env.DB_ROUTE);

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
        });

        passport.deserializeUser(function(id, done) {
            User.findById(id, function(err, user) {
                done(err, user);
            });
        });

    passport.use(new LocalStrategy(
        (username, password, done) => {
            User.findOne({username: username}, (err, user) => {
                if (err) { return done(err)}
                if (!user) { return done(null, false);}
                bcrypt.compare(password, user.password, (compareErr, result) => {
                    if (err) {
                        console.log("compareErr: ", compareErr);
                        return (done(null, false, {message: "An error occurred."}));
                    }
                    if (!result) {
                        return (done(null, false, {message: "Incorrect Password."}));
                    }
                    else {
                        console.log(user);
                        return (done(null, user)); // not sure this has scope for user
                    }
                });
            });
        }
    ))
}