const mongoose = require('mongoose');

// 🟢 New pristine connection string with explicit shard nodes and clean credentials
const pureURI = "mongodb://rahuladmin:RahulPass123@ac-uvp16kf-shard-00-00.uvp16kf.mongodb.net:27017,ac-uvp16kf-shard-00-01.uvp16kf.mongodb.net:27017,ac-uvp16kf-shard-00-02.uvp16kf.mongodb.net:27017/ml-compiler?ssl=true&replicaSet=atlas-uvp16kf-shard-0&authSource=admin&retryWrites=true&w=majority";

async function runTest() {
    console.log("⏳ Testing Fresh Admin User Account (rahuladmin)...");
    try {
        await mongoose.connect(pureURI, { serverSelectionTimeoutMS: 5000 });
        console.log("🚀 LIVE SUCCESS! The fresh admin user connected perfectly to the database!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Handshake Refused:");
        console.error(err.message);
        process.exit(1);
    }
}

runTest();