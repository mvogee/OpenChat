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
    userName: {type: String, required: true},
    email: String,
    password: {type: String, required: true},
    created: {type: Date, required: true}
});

const postSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, // references user _id
    userName: {type: String, required: true},
    postContent: {type: String, required: true},
    timeStamp: {type: Date, required: true}
});


const User = mongoose.model('user', userSchema);
const Post = mongoose.model('post', postSchema);

module.exports = {
    connectmongoose,
    User,
    Post
}