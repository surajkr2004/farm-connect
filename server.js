const express = require("express");
const mysql   = require("mysql2/promise");
const cors    = require("cors");
const path    = require("path");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ================= DATABASE =================
const db = mysql.createPool({
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

(async () => {
    try {
        const conn = await db.getConnection();
        console.log("✅ Connected to MySQL");
        conn.release();
    } catch (err) {
        console.log("❌ Database connection failed:", err.message);
    }
})();

// ======================================================
// ADMIN LOGIN
// ======================================================
app.post("/admin-login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query(
            "SELECT * FROM admins WHERE username=? AND password=?",
            [username, password]
        );
        if (rows.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// ======================================================
// ADMIN STATS
// ======================================================
app.get("/admin-stats", async (req, res) => {
    try {
        const [[farmers], [buyers], [products], [orders], [revenue]] = await Promise.all([
            db.query("SELECT COUNT(*) AS total FROM farmers"),
            db.query("SELECT COUNT(*) AS total FROM buyers"),
            db.query("SELECT COUNT(*) AS total FROM products"),
            db.query("SELECT COUNT(*) AS total FROM orders"),
            db.query("SELECT SUM(total_amount) AS revenue FROM orders WHERE status='Delivered'")
        ]);
        res.json({
            farmers:  farmers[0].total,
            buyers:   buyers[0].total,
            products: products[0].total,
            orders:   orders[0].total,
            revenue:  revenue[0].revenue || 0
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// ======================================================
// ADMIN - GET ALL FARMERS
// ======================================================
app.get("/admin-farmers", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM farmers");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Error fetching farmers" });
    }
});

// ======================================================
// ADMIN - GET ALL BUYERS
// ======================================================
app.get("/admin-buyers", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM buyers");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Error fetching buyers" });
    }
});

// ======================================================
// ADMIN - GET ALL PRODUCTS
// ======================================================
app.get("/admin-products", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM products");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Error fetching products" });
    }
});

app.put("/admin-product-status/:id", async (req, res) => {
    try {
        await db.query("UPDATE products SET status=? WHERE product_id=?",
            [req.body.status, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Error updating product" });
    }
});

// ======================================================
// ADMIN - GET ALL ORDERS
// ======================================================
app.get("/admin-orders", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM orders");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Error fetching orders" });
    }
});

// ======================================================
// FARMER LOGIN
// ======================================================
app.post("/api/farmer/login", async (req, res) => {
    const { phone, password } = req.body;
    try {
        const [rows] = await db.query(
            "SELECT * FROM farmers WHERE (phone=? OR email=?) AND password=?",
            [phone, phone, password]
        );
        if (rows.length === 0) {
            return res.json({ success: false, message: "Invalid credentials" });
        }
        const farmer = rows[0];
        res.json({
            success: true,
            farmer: {
                farmer_id: farmer.farmer_id,
                name:      farmer.name,
                phone:     farmer.phone,
                village:   farmer.village,
                state:     farmer.state
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// ======================================================
// BUYER LOGIN
// ======================================================
app.post("/api/buyer/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query(
            "SELECT * FROM buyers WHERE (email=? OR phone=?) AND password=?",
            [email, email, password]
        );
        if (rows.length === 0) {
            return res.json({ success: false, message: "Invalid credentials" });
        }
        const buyer = rows[0];
        res.json({
            success: true,
            buyer: {
                buyer_id: buyer.buyer_id,
                name:     buyer.name,
                phone:    buyer.phone,
                email:    buyer.email
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// ======================================================
// REGISTER FARMER
// ======================================================
app.post("/api/farmer/register", async (req, res) => {
    const { name, email, phone, password, village, state, security_question, security_answer } = req.body;
    try {
        await db.query(
            "INSERT INTO farmers (name,email,phone,password,village,state,security_question,security_answer) VALUES (?,?,?,?,?,?,?,?)",
            [name, email, phone, password, village || "", state || "", security_question || "", security_answer || ""]
        );
        res.json({ success: true, message: "Farmer registered successfully" });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") return res.json({ success: false, message: "Email already registered" });
        res.status(500).json({ error: "Server error" });
    }
});

// ======================================================
// REGISTER BUYER
// ======================================================
app.post("/api/buyer/register", async (req, res) => {
    const { name, email, phone, password, address, security_question, security_answer } = req.body;
    try {
        await db.query(
            "INSERT INTO buyers (name,email,phone,password,address,security_question,security_answer) VALUES (?,?,?,?,?,?,?)",
            [name, email, phone, password, address || "", security_question || "", security_answer || ""]
        );
        res.json({ success: true, message: "Buyer registered successfully" });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") return res.json({ success: false, message: "Email already registered" });
        res.status(500).json({ error: "Server error" });
    }
});

// ======================================================
// FORGOT PASSWORD - GET QUESTION
// ======================================================
app.post("/api/forgot-password/question", async (req, res) => {
    const { role, identifier } = req.body;
    const tables = { farmer: "farmers", buyer: "buyers", admin: "admins" };
    const table  = tables[role];
    if (!table) return res.json({ success: false, message: "Invalid role" });
    try {
        const [rows] = await db.query(
            `SELECT security_question FROM ${table} WHERE email=? OR phone=? OR username=?`,
            [identifier, identifier, identifier]
        );
        if (rows.length === 0) return res.json({ success: false, message: "Account not found" });
        if (!rows[0].security_question) return res.json({ success: false, message: "No security question set" });
        res.json({ success: true, question: rows[0].security_question });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// ======================================================
// FORGOT PASSWORD - RESET
// ======================================================
app.post("/api/forgot-password", async (req, res) => {
    const { role, identifier, security_answer, new_password } = req.body;
    const tables   = { farmer: "farmers", buyer: "buyers", admin: "admins" };
    const pkFields = { farmer: "farmer_id", buyer: "buyer_id", admin: "id" };
    const table    = tables[role];
    if (!table) return res.json({ success: false, message: "Invalid role" });
    try {
        const [rows] = await db.query(
            `SELECT * FROM ${table} WHERE email=? OR phone=? OR username=?`,
            [identifier, identifier, identifier]
        );
        if (rows.length === 0) return res.json({ success: false, message: "Account not found" });
        const user = rows[0];
        if (!user.security_answer || user.security_answer.toLowerCase() !== security_answer.toLowerCase()) {
            return res.json({ success: false, message: "Incorrect security answer" });
        }
        await db.query(
            `UPDATE ${table} SET password=? WHERE ${pkFields[role]}=?`,
            [new_password, user[pkFields[role]]]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// ======================================================
// PRODUCT UPLOAD (FARMER)
// ======================================================
app.post("/api/products/upload", async (req, res) => {
    const { farmer_id, name, quantity, price, category } = req.body;
    if (!farmer_id || !name || !quantity || !price || !category) {
        return res.json({ success: false, message: "All fields required" });
    }
    try {
        await db.query(
            "INSERT INTO products (farmer_id,name,quantity,price,category,status) VALUES (?,?,?,?,?,'Pending')",
            [farmer_id, name, quantity, price, category]
        );
        res.json({ success: true, message: "Product submitted for approval" });
    } catch (err) {
        res.status(500).json({ error: "Upload failed" });
    }
});

// ======================================================
// PRODUCTS - GET APPROVED (BUYER)
// ======================================================
app.get("/api/products", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM products WHERE status='Approved'");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Error fetching products" });
    }
});

app.get("/api/search", async (req, res) => {
    const q = "%" + (req.query.q || "") + "%";
    try {
        const [rows] = await db.query(
            "SELECT * FROM products WHERE status='Approved' AND name LIKE ?", [q]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Search error" });
    }
});

app.get("/api/category/:cat", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM products WHERE status='Approved' AND category=?", [req.params.cat]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Category error" });
    }
});

// ======================================================
// CART
// ======================================================
app.post("/api/cart", async (req, res) => {
    const { buyer_id, product_id, quantity } = req.body;
    try {
        let [cart] = await db.query("SELECT cart_id FROM cart WHERE buyer_id=?", [buyer_id]);
        let cart_id;
        if (cart.length === 0) {
            const [result] = await db.query("INSERT INTO cart (buyer_id) VALUES (?)", [buyer_id]);
            cart_id = result.insertId;
        } else {
            cart_id = cart[0].cart_id;
        }
        await db.query(
            "INSERT INTO cart_items (cart_id,product_id,quantity) VALUES (?,?,?) ON DUPLICATE KEY UPDATE quantity=quantity+?",
            [cart_id, product_id, quantity, quantity]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: "Cart error" });
    }
});

// ======================================================
// SERVER START
// ======================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
