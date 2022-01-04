const mongoose = require('mongoose');

async function connectmongoose(mongoose, route) {
    try {
        await mongoose.connect(route);
    }
    catch(e) {
        console.log("There was an error connecting to the database\n", e);
    }
}

const userSchema = new mongoose.Schema({
    userName: String,
    email: String,
    password: String,
    created: Date,
});

const postSchema = new mongoose.Schema({
    user: Number, // references user _id
    postContent: String,
    timeStamp: Date
});


const User = mongoose.model('user', userSchema);
const Post = mongoose.model('post', postSchema);

module.exports = {
    connectmongoose,
    User,
    Post
}