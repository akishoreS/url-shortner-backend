// const express = require('express');
require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const User = require("./models/user");
const app = express();
const PORT = 8001;



// connectToMongoDB('mongodb://localhost:27017/short-url').then(() => console.log("MongoDB connected"));
connectToMongoDB(process.env.MONGODB_URI).then(() => console.log("MongoDB connected"));

app.use(cookieParser()); 
app.use(express.json());
app.use("/url", urlRoute);

// Endpoint to receive user data and create/update user record
app.post('/user-data', async (req, res) => {
    const { id, name, imageUrl, email } = req.body;

    if (!id || !name || !email) { // imageUrl is optional
        return res.status(400).send('Missing required user information.');
    }
    if (id === null) {
        // Handle null googleId scenario, perhaps by sending a specific error message
        return res.status(400).send('Invalid Google ID.');
      }
    try {
        // Check if the user exists, update if yes, create if no
        let user = await User.findOneAndUpdate(
            { googleId: id }, 
            { name, email, imageUrl }, 
            { new: true, upsert: true }
        );
        res.cookie('signedUp', 'true', { maxAge: 24 * 60 * 60 * 1000, httpOnly: true }); // Expires in 1 day

        res.status(200).json({ message: "User data processed", user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing user data');
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Endpoint to fetch all users and their URLs for testing
app.get('/test/users', async (req, res) => {
    try {
      const users = await User.find().populate('urls').exec();
      console.log("Users fetched:", users);
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).send('Error fetching users');
    }
  });


app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId },
        { 
            $push: { visitHistory: { 
                timestamp: Date.now(),
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                referringUrl: req.headers.referer
            }},
            $inc: { clickCount: 1 }
        },
        { new: true }
    );
    if (entry) {
        res.redirect(entry.redirectURL);
    } else {
        res.status(404).send('URL not found');
    }
});
// app.get('/:shortId', async (req, res) => {
//     const shortId = req.params.shortId;
//     const userAgent = req.headers['user-agent']; // Capture the user agent
//     const ip = req.ip; // Capture the IP address

//     try {
//         const url = await URL.findOne({ shortId: shortId });
//         if (!url) {
//             return res.status(404).send('URL not found');
//         }

//         // Push a new visit record into the visitHistory array
//         url.visitHistory.push({
//             timestamp: Date.now(),
//             ip: ip,
//             userAgent: userAgent, // Store the user agent
//         });
//         url.clickCount += 1; // Increment click count if you're tracking this
//         await url.save();

//         res.redirect(url.redirectURL);
//     } catch (error) {
//         console.error('Error accessing URL:', error);
//         res.status(500).send('Error accessing URL');
//     }
// });

  
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


