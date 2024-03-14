// const mongoose  = require("mongoose");
// mongoose.set("strictQuery", true);
// async function connectToMongoDB(url){
//     return mongoose.connect(url);
// }


// module.exports={
//     connectToMongoDB,
// }
const mongoose = require("mongoose");

async function connectToMongoDB() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase'; // Use the environment variable for your Atlas connection string
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error("Error connecting to MongoDB Atlas:", error);
    }
}

module.exports = { connectToMongoDB };
