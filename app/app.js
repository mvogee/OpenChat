const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env')});
const express = require('express');
const session = require("express-session");
const socketIO = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');
const {connectmongoose, User, Post} = require('./db.js');
const bodyParser = require("body-parser");
const passport = require("passport");
const passportConfig = require("./passport_config.js");
// ---- End Require Statements ----- //
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const mainRouter = require('./routes/index');


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

port = process.env.NODE_ENV === 'PROD' ? parseInt(process.env.PORT, 10) : 3000;

app.use('/', mainRouter);

console.log(process.env.PORT);

console.log(process.env.DB_ROUTE);
connectmongoose(mongoose, process.env.DB_ROUTE);
passportConfig(passport);

const msgFromServer = "messageFromServer";
const errFromServer = "errorFromServer";

io.on("connection", (socket) => {
    console.log("new user connected");
    // ! placeholder data below!
    // replace with data from database on first load
    Post.find((err, result) => {
        if (err) {
            console.log(err);
            socket.emit(errFromServer, {err: err, msg: "an error occurred while fetching the latest messages. Please try again."});
        }
        else {
            console.log(result);
            socket.emit(msgFromServer, result.length > 100 ? result.slice(-1, -101) : result);
        }
    });
    // socket.emit(msgFromServer, [{
    //     user: "ref 2",
    //     userName: "server",
    //     postContent: "connected to the server",
    //     timeStamp: new(Date)
    // },{
    //     user: "ref 2",
    //     userName: "peanut Mike",
    //     postContent: "I like peanuts.",
    //     timeStamp: new(Date)
    // },{
    //     user: "ref 3",
    //     userName: "Joey",
    //     postContent: "hi my name is joey",
    //     timeStamp: new(Date)
    // }])
    // socket.emit('messageFromServer', );

    // only exists to confirm connection to user.
    socket.on('messageFromClient', (data) => {
        console.log('messageFromClient', data);
    });
    
    socket.on('postFromClient', (data) => {
        console.log('postFromClient', data);
        const postData = {
            userName: data.user.userName,
            user: data.userId,
            postContent: data.postContent,
            timeStamp: data.timestamp
        }
        Post.create(postData, (err, post) => {
            if (err) {
                console.log("An error occured adding a post to the database.\n", err);
            }
            else {
                console.log(post, "was saved");
                // Post.find((err, result) => {
                //     console.log(result);
                // });
                
                socket.emit(msgFromServer, post);
                // socket.emit("messageFromServer", {
                //     user: post.user,
                //     userName: post.userName,
                //     text: post.postContent,
                //     timeStamp: post.timestamp
                // });
            }
        });
    });

    socket.on('disconnect', () => {
        console.log("disconnected form user");
    });
});

server.listen(port, () => {
    console.log("server is live.");
});
