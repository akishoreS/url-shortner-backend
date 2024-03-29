const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true, // Acts as a primary key for user identification
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: { // Updated from 'username' to 'name' as per your requirement
        type: String,
        required: true,
    },
    imageUrl: { // New field for storing image URL
        type: String,
        required: true, // Making it optional based on your requirement
    },
    urls: [{ // Keeping as is, assuming you want to maintain a list of URLs associated with the user
        type: mongoose.Schema.Types.ObjectId,
        ref: 'URL'
    }]
}, { timestamps: true });



module.exports = mongoose.model("User", userSchema);
