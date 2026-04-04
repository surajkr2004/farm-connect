const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

async function run() {
    const db = await mysql.createConnection({
        host:     "localhost",
        user:     "root",
        password: "Suraj@7654",
        database: "farmconnect"
    });

    console.log("✅ Connected to MySQL");

    // Hash password "123456" for all farmers and buyers
    const hash123456 = await bcrypt.hash("123456", 10);

    // Hash password "admin123" for admin
    const hashAdmin = await bcrypt.hash("admin123", 10);

    // Update all farmers
    await db.query("UPDATE farmers SET password = ?", [hash123456]);
    console.log("✅ Farmers passwords hashed");

    // Update all buyers
    await db.query("UPDATE buyers SET password = ?", [hash123456]);
    console.log("✅ Buyers passwords hashed");

    // Update admin
    await db.query("UPDATE admins SET password = ? WHERE username = 'admin'", [hashAdmin]);
    console.log("✅ Admin password hashed");

    console.log("\n🎉 ALL DONE! You can now login with:");
    console.log("   Farmer  → phone: 8000000001  | password: 123456");
    console.log("   Buyer   → email: buyer1@gmail.com | password: 123456");
    console.log("   Admin   → username: admin    | password: admin123");

    await db.end();
}

run().catch(err => {
    console.error("❌ Error:", err.message);
});
