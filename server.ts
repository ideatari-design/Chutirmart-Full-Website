import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Simple In-Memory "Database" ---
const PRODUCTS = [
  { 
    id: '1', 
    name: 'Portable Crusher Juicer', 
    nameBn: 'পোর্টেবল জুসার', 
    price: 600, 
    oldPrice: 1200,
    category: 'Home & Decor', 
    images: ['https://images.unsplash.com/photo-1544787210-2213d28929c1?auto=format&fit=crop&q=80&w=800'], 
    stock: 10, 
    isFeatured: true, 
    stars: 4.8,
    description: 'Mini portable blender for students and office workers.',
    specs: {
      'Power': '200W',
      'Battery': '2000mAh',
      'Capacity': '380ml'
    }
  },
  { 
    id: '2', 
    name: 'Pro Neck Fan', 
    nameBn: 'নেক ফ্যান', 
    price: 1500, 
    oldPrice: 2000,
    category: 'Gadgets', 
    images: ['https://images.unsplash.com/photo-1622541929213-167c6d45100d?auto=format&fit=crop&q=80&w=800'], 
    stock: 15, 
    isFeatured: true, 
    stars: 4.5,
    description: 'Bladeless portable neck fan for outdoor activities.',
    specs: {
      'Battery': '4000mAh',
      'Speeds': '3 Levels'
    }
  },
  { 
    id: '3', 
    name: 'Gaming Headset Elite', 
    nameBn: 'গেমিং হেডসেট', 
    price: 4500, 
    oldPrice: 6000,
    category: 'Audio', 
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'], 
    stock: 5, 
    isFeatured: true, 
    stars: 5.0,
    description: 'RGB Gaming headset with noise cancelling mic.',
    specs: {
      'Drivers': '50mm',
      'Connector': 'USB & 3.5mm'
    }
  },
  { 
    id: '4', 
    name: 'Mechanical Mini Keyboard', 
    nameBn: 'মেকানিক্যাল কিবোর্ড', 
    price: 3200, 
    oldPrice: 4500,
    category: 'PC', 
    images: ['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800'], 
    stock: 8, 
    isFeatured: true, 
    stars: 4.7,
    description: '60% Compact mechanical keyboard with RGB.',
    specs: {
      'Switches': 'Brown Silent',
      'Keycaps': 'PBT Double-shot'
    }
  },
  { 
    id: '5', 
    name: 'Smart Mirror Beauty', 
    nameBn: 'স্মার্ট মিরর', 
    price: 2500, 
    oldPrice: 3500,
    category: 'Makeup', 
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc53bb7?auto=format&fit=crop&q=80&w=800'], 
    stock: 12, 
    isFeatured: true, 
    stars: 4.9,
    description: 'LED smart makeup mirror with dimmable lights.',
    specs: {
      'Light': 'Natural LED',
      'Power': 'Rechargeable'
    }
  },
  { 
    id: '6', 
    name: 'Air Purifier X', 
    nameBn: 'এয়ার পিউরিফায়ার', 
    price: 12000, 
    oldPrice: 15000,
    category: 'Home & Decor', 
    images: ['https://images.unsplash.com/photo-1620336655055-088d06e76fb5?auto=format&fit=crop&q=80&w=800'], 
    stock: 4, 
    isFeatured: true, 
    stars: 4.8,
    description: 'HEPA filter air purifier for clean indoor air.',
    specs: {
      'CADR': '200 m3/h',
      'Filter': 'H13 HEPA'
    }
  },
  { 
    id: '7', 
    name: 'Bluetooth Speaker Boom', 
    nameBn: 'ব্লুটুথ স্পিকার', 
    price: 1800, 
    oldPrice: 2500,
    category: 'Audio', 
    images: ['https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=800'], 
    stock: 20, 
    isFeatured: true, 
    stars: 4.6,
    description: 'Portable waterproof bluetooth speaker with deep bass.',
    specs: {
      'Waterproof': 'IPX7',
      'Playtime': '12 Hours'
    }
  },
  { 
    id: '8', 
    name: 'Modern Table Lamp', 
    nameBn: 'টেবিল ল্যাম্প', 
    price: 1200, 
    oldPrice: 1900,
    category: 'Home & Decor', 
    images: ['https://images.unsplash.com/photo-1513519245088-0e12902e3a38?auto=format&fit=crop&q=80&w=800'], 
    stock: 7, 
    isFeatured: true, 
    stars: 4.7,
    description: 'Minimalist wooden table lamp for bedroom.',
    specs: {
      'Bulb': 'E27 LED',
      'Style': 'Scandinavian'
    }
  },
  { 
    id: '9', 
    name: 'Luxury Handbag', 
    nameBn: 'লাক্সারি হ্যান্ডব্যাগ', 
    price: 5500, 
    oldPrice: 8000,
    category: 'Handbags', 
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800'], 
    stock: 3, 
    isFeatured: false, 
    stars: 4.9,
    description: 'Italian leather luxury handbag for women.',
    specs: {
      'Material': 'Genuine Leather',
      'Color': 'Brown'
    }
  },
  { 
    id: '10', 
    name: 'Designer Sneakers', 
    nameBn: 'ডিজাইনার স্নিকার্স', 
    price: 8500, 
    oldPrice: 12000,
    category: 'Fashion', 
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'], 
    stock: 6, 
    isFeatured: false, 
    stars: 5.0,
    description: 'Modern sneakers with breathable mesh fabric.',
    specs: {
      'Type': 'Sports/Lifestyle',
      'Sole': 'Rubber'
    }
  }
];

let ORDERS: any[] = [
  {
    id: '#1001',
    customerName: 'Ashiqur Rahman',
    customerPhone: '01712345678',
    deliveryArea: 'inside',
    address: 'Dhaka, Bangladesh',
    items: [],
    total: 1200,
    paymentStatus: 'paid',
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: '#1002',
    customerName: 'Mehedi Hasan',
    customerPhone: '01812345678',
    deliveryArea: 'outside',
    address: 'Chittagong, Bangladesh',
    items: [],
    total: 2500,
    paymentStatus: 'unpaid',
    status: 'processing',
    createdAt: new Date().toISOString()
  }
];
let REVIEWS: any[] = [
  { id: '1', productId: '1', userName: 'Rahat', rating: 5, comment: 'Great juicer!', createdAt: new Date().toISOString() },
  { id: '2', productId: '1', userName: 'Sara', rating: 4, comment: 'Useful for office.', createdAt: new Date().toISOString() },
];

// --- Cloudflare D1 Helper ---
const D1_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const D1_DATABASE_ID = process.env.CLOUDFLARE_DATABASE_ID;
const D1_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

async function queryD1(sql: string, params: any[] = []) {
  if (!D1_ACCOUNT_ID || !D1_DATABASE_ID || !D1_API_TOKEN) {
    console.warn("D1 Credentials missing in environment variables. Check Settings > Secrets.");
    return null;
  }

  try {
    const accountId = (D1_ACCOUNT_ID || "").trim();
    const databaseId = (D1_DATABASE_ID || "").trim();
    const token = (D1_API_TOKEN || "").trim();

    if (!accountId || !databaseId || !token) {
      console.warn("D1 Credentials partially missing. AccountID:", !!accountId, "DBID:", !!databaseId, "Token:", !!token);
      return null;
    }

    const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    console.log(`Attempting D1 Query with AccountID: ${accountId.substring(0, 4)}... and DBID: ${databaseId.substring(0, 4)}...`);

    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`, {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ sql, params })
    });

    const data: any = await res.json();
    if (!data.success) {
      console.error("D1 API FULL ERROR:", JSON.stringify(data));
      // Specific check for Token Verification Error
      if (data.errors && data.errors.some((e: any) => e.code === 10000)) {
        console.error("CRITICAL: Cloudflare rejected the token. Possible reasons: 1. Token is wrong, 2. Account ID is wrong, 3. Token expired.");
      }
      return null;
    }
    return data.result && data.result.length > 0 ? data.result[0] : { results: [], success: true };
  } catch (err) {
    console.error("D1 Query Exception:", err);
    return null;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Troubleshooting Endpoints ---

  // Verify Cloudflare Token
  app.get("/api/admin/verify-token", async (req, res) => {
    const token = (process.env.CLOUDFLARE_API_TOKEN || "").trim();
    if (!token) return res.json({ success: false, message: "Token is missing in Settings." });

    const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    try {
      const response = await fetch("https://api.cloudflare.com/client/v4/user/tokens/verify", {
        headers: { "Authorization": authHeader }
      });
      const data: any = await response.json();
      res.json(data);
    } catch (err) {
      res.status(500).json({ success: false, error: String(err) });
    }
  });

  // Database Initialization Endpoint
  app.get("/api/admin/init-db", async (req, res) => {
    console.log("Starting Database Initialization...");
    
    const createProductsTable = `
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT,
        price REAL,
        category TEXT,
        brand TEXT,
        description TEXT,
        images TEXT,
        specs TEXT,
        rating REAL,
        stock INTEGER,
        isFeatured INTEGER,
        discount REAL
      )
    `;

    const createOrdersTable = `
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customerName TEXT,
        customerPhone TEXT,
        customerAddress TEXT,
        total REAL,
        items TEXT,
        status TEXT,
        createdAt TEXT
      )
    `;

    try {
      const pResult = await queryD1(createProductsTable);
      const oResult = await queryD1(createOrdersTable);

      if (pResult && oResult) {
        return res.json({ success: true, message: "Tables created successfully!" });
      } else {
        return res.status(500).json({ 
          success: false, 
          message: "Failed to create tables. Check server logs for Authentication or ID errors.",
          details: "Make sure CLOUDFLARE_ACCOUNT_ID and API_TOKEN are correct." 
        });
      }
    } catch (err) {
      res.status(500).json({ success: false, error: String(err) });
    }
  });

  // --- API Routes ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Ojala Shop Server Running" });
  });

  // Get all orders
  app.get("/api/orders", async (req, res) => {
    const d1Result = await queryD1("SELECT * FROM orders ORDER BY createdAt DESC");
    if (d1Result) {
      const orders = d1Result.results.map((o: any) => ({
        ...o,
        items: JSON.parse(o.items || "[]")
      }));
      return res.json(orders);
    }
    res.json(ORDERS);
  });

  // Get all products
  app.get("/api/products", async (req, res) => {
    const d1Result = await queryD1("SELECT * FROM products");
    if (d1Result) {
      const products = d1Result.results.map((p: any) => ({
        ...p,
        images: JSON.parse(p.images || "[]"),
        specs: JSON.parse(p.specs || "{}")
      }));
      return res.json(products);
    }
    res.json(PRODUCTS);
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    const d1Result = await queryD1("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (d1Result && d1Result.results.length > 0) {
      const product = {
        ...d1Result.results[0],
        images: JSON.parse(d1Result.results[0].images || "[]"),
        specs: JSON.parse(d1Result.results[0].specs || "{}")
      };
      // For reviews, we can also query D1 or keep them in-memory for now if table doesn't exist
      res.json({ ...product, reviews: REVIEWS.filter(r => r.productId === req.params.id) });
      return;
    }

    const product = PRODUCTS.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const productReviews = REVIEWS.filter(r => r.productId === req.params.id);
    res.json({ ...product, reviews: productReviews });
  });

  app.post("/api/products/:id/reviews", (req, res) => {
    const { userName, rating, comment } = req.body;
    const newReview = {
      id: String(REVIEWS.length + 1),
      productId: req.params.id,
      userName,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };
    REVIEWS.push(newReview);
    res.status(201).json(newReview);
  });

  // Create product
  app.post("/api/products", (req, res) => {
    const productData = req.body;
    const newProduct = {
      ...productData,
      id: String(PRODUCTS.length + 1),
      images: productData.images || ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800']
    };
    PRODUCTS.push(newProduct);
    res.status(201).json(newProduct);
  });

  // Delete product
  app.delete("/api/products/:id", (req, res) => {
    const index = PRODUCTS.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Product not found" });
    PRODUCTS.splice(index, 1);
    res.status(204).send();
  });

  // Update product
  app.patch("/api/products/:id", (req, res) => {
    const index = PRODUCTS.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Product not found" });
    
    PRODUCTS[index] = {
      ...PRODUCTS[index],
      ...req.body
    };
    res.json(PRODUCTS[index]);
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    const orderData = req.body;
    const orderId = `#${Math.floor(Math.random() * 900000) + 100000}`;
    const createdAt = new Date().toISOString();

    const d1Result = await queryD1(
      "INSERT INTO orders (id, customerName, customerPhone, customerAddress, total, items, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        orderId,
        orderData.customerName,
        orderData.customerPhone,
        orderData.customerAddress,
        orderData.total,
        JSON.stringify(orderData.items),
        'pending',
        createdAt
      ]
    );

    const newOrder = {
      ...orderData,
      id: orderId,
      createdAt,
      status: 'pending'
    };

    if (!d1Result) {
      ORDERS.push(newOrder);
    }

    console.log(`New Order Created: ${newOrder.id}`);
    res.status(201).json(newOrder);
  });

  // Get order by tracking ID
  app.get("/api/orders/:id", async (req, res) => {
    const d1Result = await queryD1("SELECT * FROM orders WHERE id = ?", [req.params.id.startsWith('#') ? req.params.id : `#${req.params.id}`]);
    if (d1Result && d1Result.results.length > 0) {
      const order = {
        ...d1Result.results[0],
        items: JSON.parse(d1Result.results[0].items || "[]")
      };
      return res.json(order);
    }

    const orderId = req.params.id.startsWith('#') ? req.params.id : `#${req.params.id}`;
    const order = ORDERS.find(o => o.id === orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  });

  // Update order status
  app.patch("/api/orders/:id/status", (req, res) => {
    const { status } = req.body;
    const orderIndex = ORDERS.findIndex(o => o.id === req.params.id);
    if (orderIndex === -1) return res.status(404).json({ message: "Order not found" });
    
    ORDERS[orderIndex].status = status;
    res.json(ORDERS[orderIndex]);
  });

  // uddoktapay mock
  app.post("/api/payments/initiate", (req, res) => {
    const { amount, orderId } = req.body;
    res.json({
      success: true,
      payment_url: `https://payment.example.com/pay/${orderId}?amount=${amount}`,
    });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // SPA Fallback for dev mode
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const fs = await import("fs");
        let template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
