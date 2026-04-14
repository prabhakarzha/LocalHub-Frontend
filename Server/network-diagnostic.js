import dns from "dns";
import net from "net";
import https from "https";

console.log("🔍 Running network diagnostics for MongoDB Atlas...\n");

// Test 1: DNS Resolution
console.log("📡 Test 1: DNS Resolution");
dns.resolve("cluster0.iw5n9qa.mongodb.net", (err, addresses) => {
  if (err) {
    console.error("❌ DNS Resolution Failed:", err.message);
    console.log("   This might be a DNS issue - try these commands:");
    console.log("   • ipconfig /flushdns");
    console.log("   • nslookup cluster0.iw5n9qa.mongodb.net");
  } else {
    console.log("✅ DNS Resolution Success:");
    console.log("   Addresses:", addresses);

    // Test 2: Test connection to each address on port 27017
    console.log("\n🔌 Test 2: Connection Test");
    addresses.forEach((addr) => {
      const socket = net.createConnection(27017, addr);
      socket.setTimeout(5000);

      socket.on("connect", () => {
        console.log(`✅ Can connect to ${addr}:27017`);
        socket.end();
      });

      socket.on("timeout", () => {
        console.log(`❌ Connection timeout to ${addr}:27017`);
        socket.destroy();
      });

      socket.on("error", (err) => {
        console.log(`❌ Cannot connect to ${addr}:27017 - ${err.message}`);
      });
    });
  }
});

// Test 3: Test SRV record resolution
console.log("\n📡 Test 3: SRV Record Resolution");
dns.resolveSrv(
  "_mongodb._tcp.cluster0.iw5n9qa.mongodb.net",
  (err, addresses) => {
    if (err) {
      console.error("❌ SRV Resolution Failed:", err.message);
      console.log("   This is critical for MongoDB Atlas connection");
    } else {
      console.log("✅ SRV Resolution Success:");
      addresses.forEach((addr) => {
        console.log(
          `   ${addr.name}:${addr.port} (priority ${addr.priority}, weight ${addr.weight})`,
        );
      });
    }
  },
);

// Test 4: HTTP request to MongoDB Atlas
console.log("\n🌐 Test 4: HTTP Check");
const options = {
  hostname: "cloud.mongodb.com",
  port: 443,
  path: "/",
  method: "HEAD",
  timeout: 5000,
};

const req = https.request(options, (res) => {
  console.log("✅ Can reach MongoDB Atlas website");
});

req.on("error", (err) => {
  console.log("❌ Cannot reach MongoDB Atlas website:", err.message);
});

req.on("timeout", () => {
  console.log("❌ Timeout reaching MongoDB Atlas website");
  req.destroy();
});

req.end();
