const mongoose  = require("mongoose");
mongoose.set("strictQuery", true);
// async function connectToMongoDB(url){
//     return mongoose.connect(url);
// }
async function connectToMongoDB() {
    const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/short-url'; // Fallback for local development
    try {
        await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

module.exports={
    connectToMongoDB,
}