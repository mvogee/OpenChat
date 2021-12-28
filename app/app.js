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
    socket.emit('newMessage', {
        from: "server@server",
        text: "this is the message.",
        timeStamp: new(Date)
    });

    socket.on('createMessage', (newMessage) => {
        console.log('newMessage', newMessage);
    });

    socket.on('disconnect', () => {
        console.log("disconnected form user");
    });
});

server.listen(port, () => {
    console.log("server is live.");
});
