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

/**
 * 
 * @param {User.id} userId mongoose User object id attribute
 * @param {String} newPw hashed text string for new password 
 */
function updateUserPw(userId, newPw) {
    User.findByIdAndUpdate(userId, {password: newPw}, (err, result) => {
        if (err) {
            console.log("mongoose had an error updated the password.", err);
        }
        else {
            console.log("password updated\n", result);
        }
    });
}

module.exports = {
    updateUserPw,
    connectmongoose,
    User,
    Post
}