const path = require('path');
require('dotenv').config();
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
// ---- End Require Statements ----- //
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const mainRouter = require('./routes/index');

app.use(express.static(__dirname + '/public'));

port = process.env.NODE_ENV === 'PROD' ? process.env.PORT : 3000;

app.use('/', mainRouter);

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

    socket.on('disconnect', () => {
        console.log("disconnected form user");
    });
});

server.listen(port, () => {
    console.log("server is live.");
});
