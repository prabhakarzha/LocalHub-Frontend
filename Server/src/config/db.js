import mongoose from "mongoose";
import dns from "dns";

// 👇 Google DNS force karo
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

export const connectDB = async () => {
  try {
    console.log("👉 Mongo URI actually used:", process.env.MONGO_URI);

    // 👇 Connection options ke saath
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // 30 sec timeout
      socketTimeoutMS: 45000, // 45 sec socket timeout
      family: 4, // 👈 IPv4 force (important!)
    });

    console.log(`✅ Successfully Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    console.error("Full error:", error);

    // Extra debugging
    if (error.name === "MongoNetworkError") {
      console.log("🔍 Network issue - DNS ya firewall check karo");
    }

    process.exit(1);
  }
};
