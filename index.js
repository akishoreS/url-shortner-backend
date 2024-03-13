// const express = require("express");
// const { connectToMongoDB } = require("./connect");
// const urlRoute = require("./routes/url");
// const URL = require("./models/url");

// const app = express();
// const PORT = 8001;

// connectToMongoDB('mongodb://localhost:27017/short-url').then(() => console.log("Mongodb connected"));

// app.use(express.json());
// app.use("/url", urlRoute);

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// });

// app.get("/:shortId", async (req, res) => {
//     const shortId = req.params.shortId;
//     const entry = await URL.findOneAndUpdate(
//         { shortId },
//         { 
//             $push: { visitHistory: { 
//                 timestamp: Date.now(),
//                 ip: req.ip,
//                 userAgent: req.get('User-Agent'),
//                 referringUrl: req.headers.referer
//             } },
//             $inc: { clickCount: 1 } // Increment click count
//         }
//     );
//     res.redirect(entry.redirectURL);
// });

// app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));

const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const User = require("./models/user");
const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url').then(() => console.log("MongoDB connected"));
// connectToMongoDB(process.env.MONGODB_URI).then(() => console.log("MongoDB connected"));


app.use(express.json());
app.use("/url", urlRoute);

// Endpoint to receive user data and create/update user record
app.post('/user-data', async (req, res) => {
    const { id, name, imageUrl, email } = req.body;

    if (!id || !name || !email) { // imageUrl is optional
        return res.status(400).send('Missing required user information.');
    }

    try {
        // Check if the user exists, update if yes, create if no
        let user = await User.findOneAndUpdate(
            { googleId: id }, 
            { name, email, imageUrl }, 
            { new: true, upsert: true }
        );

        res.status(200).json({ message: "User data processed", user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing user data');
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
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
// app.get("/:shortId", async (req, res, next) => {
//     const shortId = req.params.shortId;
//     const entry = await URL.findOne({ shortId });
//     if (entry) {
//       res.redirect(entry.redirectURL);
//       process.nextTick(async () => {
//         await URL.findOneAndUpdate(
//           { shortId },
//           {
//             $push: { visitHistory: { timestamp: Date.now(), ip: req.ip, userAgent: req.get('User-Agent'), referringUrl: req.headers.referer }},
//             $inc: { clickCount: 1 }
//           }
//         );
//       });
//     } else {
//       res.status(404).send('URL not found');
//     }
//   });
  

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


