var router = require('express').Router();
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + "./../views/index.html"));
    //res.send("hello");
});

module.exports = router;