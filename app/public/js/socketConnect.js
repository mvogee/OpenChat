var socket = io();

socket.on("connect", () => {
    console.log("connected to the server");
});

socket.on("newMessage", (message) => {
    console.log("newMessage", message);
});

socket.emit("createMessage", {
    to: "server@server",
    text: "message to server from user"
});

socket.on("disconnect", () => {
    console.log("Client disconnected from server");
});