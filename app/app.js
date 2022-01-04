const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env')});
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');
const {connectmongoose, User, Post} = require('./db.js');
const bodyParser = require("body-parser");
// ---- End Require Statements ----- //
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const mainRouter = require('./routes/index');


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
port = process.env.NODE_ENV === 'PROD' ? process.env.PORT : 3000;

app.use('/', mainRouter);

console.log(process.env.PORT);

console.log(process.env.DB_ROUTE);
connectmongoose(mongoose, process.env.DB_ROUTE);

io.on("connection", (socket) => {
    console.log("new user connected");
    socket.emit('messageFromServer', [{
        user: "server@server",
        text: "connected to the server",
        timeStamp: new(Date)
    },{
        user: "peanut Mike",
        text: "I like peanuts.",
        timeStamp: new(Date)
    },{
        user: "Joey",
        text: "hi my name is joey",
        timeStamp: new(Date)
    }]);

    socket.on('messageFromClient', (data) => {
        console.log('messageFromClient', data);
        socket.emit("messageFromServer", {
            user: data.user,
            text: data.message,
            timeStamp: data.timestamp
        });
    });
    
    socket.on('postFromClient', (data) => {
        console.log('postFromClient', data);
        const postData = {
            user: data.user,
            postContent: data.postContent,
            timeStamp: data.timestamp
        }
        Post.create(postData, (err, post) => {
            if (err) {
                console.log("An error occured adding a post to the database.\n", err);
            }
            else {
                console.log(post, "was saved");
                Post.find((err, result) => {
                    console.log(result);
                });
            }
        });
        socket.emit("messageFromServer", {
            user: data.user,
            text: data.postContent,
            timeStamp: data.timestamp
        });
    });

    socket.on('disconnect', () => {
        console.log("disconnected form user");
    });
});

server.listen(port, () => {
    console.log("server is live.");
});
