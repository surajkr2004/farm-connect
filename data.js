/* =========================================================
   FARMCONNECT — MASTER DATABASE (TEMPORARY FRONTEND DB)
   ========================================================= */

/* ------------------ FARMERS ------------------ */
const farmers = [
  {
    farmerId: "FARM001",
    name: "Ramesh Kumar",
    location: "Uttar Pradesh",
    phone: "9876543210",
    joined: "2023-01-12",
    status: "Active",
    totalSales: 185000,
    profilePic: "",

    products: ["PROD001", "PROD002", "PROD003"],
    orders: ["ORD001", "ORD004"],
    refunds: ["REF001"]
  },
  {
    farmerId: "FARM002",
    name: "Suresh Patil",
    location: "Maharashtra",
    phone: "9123456780",
    joined: "2022-11-08",
    status: "Suspended",
    totalSales: 98000,
    profilePic: "",

    products: ["PROD004", "PROD005"],
    orders: ["ORD002"],
    refunds: []
  },
  {
    farmerId: "FARM003",
    name: "Amit Singh",
    location: "Rajasthan",
    phone: "9012345678",
    joined: "2023-03-19",
    status: "Blocked",
    totalSales: 42000,
    profilePic: "",

    products: ["PROD006"],
    orders: ["ORD003"],
    refunds: ["REF002"]
  }
];

/* ------------------ BUYERS ------------------ */
const buyers = [
  {
    buyerId: "BUY001",
    name: "Ankit Verma",
    city: "Delhi",
    phone: "900000001",
    status: "Active",

    orders: ["ORD001", "ORD002"],
    refunds: ["REF001"],
    totalSpend: 8200
  },
  {
    buyerId: "BUY002",
    name: "Rohit Sharma",
    city: "Pune",
    phone: "900000002",
    status: "Blocked",

    orders: ["ORD003"],
    refunds: ["REF002"],
    totalSpend: 2100
  }
];

/* ------------------ PRODUCTS ------------------ */
const products = [
  {
    productId: "PROD001",
    name: "Wheat",
    farmerId: "FARM001",
    status: "Live",
    qualityScore: 4.5,
    popularity: 38,
    hidden: false,

    priceHistory: [1800, 2000, 2200],
    refunds: ["REF001"]
  },
  {
    productId: "PROD002",
    name: "Rice",
    farmerId: "FARM001",
    status: "Live",
    qualityScore: 4.2,
    popularity: 25,

    priceHistory: [2400, 2600],
    refunds: []
  },
  {
    productId: "PROD004",
    name: "Tomato",
    farmerId: "FARM002",
    status: "Pending",
    qualityScore: 3.9,
    popularity: 14,

    priceHistory: [15, 18],
    refunds: ["REF002"]
  }
];

/* ------------------ ORDERS ------------------ */
const orders = [
  {
    orderId: "ORD001",
    buyerId: "BUY001",
    farmerId: "FARM001",
    productId: "PROD001",
    orderValue: 2200,
    status: "Delivered",

    timeline: {
      placed: "2024-01-10",
      packed: "2024-01-11",
      delivered: "2024-01-12"
    },

    refundId: "REF001",
    fraudFlag: false
  },
  {
    orderId: "ORD002",
    buyerId: "BUY001",
    farmerId: "FARM002",
    productId: "PROD004",
    orderValue: 1800,
    status: "Cancelled",

    timeline: {
      placed: "2024-01-15",
      cancelled: "2024-01-16"
    },

    refundId: null,
    fraudFlag: false
  }
];

/* ------------------ REFUNDS ------------------ */
const refunds = [
  {
    refundId: "REF001",
    orderId: "ORD001",
    buyerId: "BUY001",
    farmerId: "FARM001",
    productId: "PROD001",

    amount: 500,
    reason: "Quality issue",
    status: "Pending"
  },
  {
    refundId: "REF002",
    orderId: "ORD003",
    buyerId: "BUY002",
    farmerId: "FARM003",
    productId: "PROD004",

    amount: 300,
    reason: "Late delivery",
    status: "Approved"
  }
];

/* ------------------ ANALYTICS HELPERS ------------------ */
const analytics = {
  totalRevenue() {
    return orders
      .filter(o => o.status === "Delivered")
      .reduce((sum, o) => sum + o.orderValue, 0);
  },

  totalOrders() {
    return orders.length;
  },

  activeFarmers() {
    return farmers.filter(f => f.status === "Active").length;
  },

  activeBuyers() {
    return buyers.filter(b => b.status === "Active").length;
  }
};

/* ------------------ SAVE TO LOCAL STORAGE ------------------ */
const DB = {
  farmers,
  buyers,
  products,
  orders,
  refunds,
  analytics
};



if (!localStorage.getItem("DB")) {
  localStorage.setItem("DB", JSON.stringify(DB));
}