// const shortid =require("shortid");
// const URL= require('../models/url');
// const User = require('../models/user');

// async function handleGenerateNewShortURL(req,res){
//     const body= req.body;
//     if(!body.url)return res.status(400).json({error:"url is required"});
//     const shortID = shortid();
//     await URL.create({
//         shortId: shortID,
//         redirectURL:body.url,
//         visitHistory:[],
//     });
//     return res.json({id:shortID});
// }



// module.exports={
//     handleGenerateNewShortURL,
//     handleGetAnalytics,
// };

const shortid = require("shortid");
const URL = require('../models/url');
const User = require('../models/user');

async function handleGenerateNewShortURL(req, res) {
    // console.log(req.body);
    const { url, googleId, name, imageUrl, email } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    // Verify if user information is provided
    // if (!googleId || !name || !email) {
    //     return res.status(400).json({ error: "Missing required user information" });
    // }

    let user;
    try {
        // Check if the user exists; if not, create a new user
        user = await User.findOneAndUpdate(
            { googleId: googleId },
            { name: name, email: email, imageUrl: imageUrl },
            { new: true, upsert: true }
        );
    } catch (error) {
        console.error("Error updating or creating user:", error);
        return res.status(500).json({ error: "Error processing user data" });
    }

    const shortID = shortid.generate();
    try {
        await URL.create({
            shortId: shortID,
            redirectURL: url,
            owner: user._id, // Associate the URL with the user's _id
            visitHistory: [],
        });
        return res.json({ id: shortID, url: url });
    } catch (error) {
        console.error("Error creating URL:", error);
        return res.status(500).json({ error: "Error creating new URL" });
    }
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    try {
        const result = await URL.findOne({ shortId }).populate('owner', 'name email imageUrl -_id');
        if (!result) {
            return res.status(404).json({ error: "URL not found" });
        }
        return res.json({
            url: result.redirectURL,
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory,
            owner: result.owner ? result.owner : "User data not available",
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return res.status(500).json({ error: "Error fetching analytics" });
    }
}
// async function handleGetAnalytics(req,res){
//     const shortId = req.params.shortId;
//     const result = await URL.findOne({shortId });
//     return res.json({
//         totalClicks:result.visitHistory.length,
//         analytics: result.visitHistory,
//     });
// }

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
};
