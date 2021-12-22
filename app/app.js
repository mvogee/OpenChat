const path = require('path');
require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));
port = process.env.NODE_ENV === 'PROD' ? process.env.PORT : 3000;

//! move this to routes.
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});



app.listen(port, () => {
    console.log("server is live.");
});
