module.exports = function(io) {
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
    }