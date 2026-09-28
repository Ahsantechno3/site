const mongoose = require('mongoose');
const dns = require('dns');

// Google DNS (8.8.8.8) ya Cloudflare (1.1.1.1) set karne ke liye:
dns.setDefaultResultOrder('ipv4first'); // IPv4 traffic preference
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;