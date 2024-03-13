// const mongoose  = require("mongoose");
// mongoose.set("strictQuery", true);
// async function connectToMongoDB(url){
//     return mongoose.connect(url);
// }
// const username = encodeURIComponent("aryasingh7461");
// const password = encodeURIComponent("xTQirxtaEkmF6DvJ");
// async function connectToMongoDB() {
//     // const dbURI = process.env.MONGODB_URI || 'mongodb+srv://${username}:${password}@cluster0.v9k30g7.mongodb.net/'; 
//     const dbURI = process.env.MONGODB_URI || 'localhost:27017/short-url'; 

//     try {
//         await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log("MongoDB connected");
//     } catch (error) {
//         console.error("MongoDB connection error:", error);
//     }
// }
const mongoose  = require("mongoose");
mongoose.set("strictQuery", true);
async function connectToMongoDB(url){
    return mongoose.connect(url);
}


module.exports={
    connectToMongoDB,
}