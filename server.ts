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
async function queryD1(sql: string, params: any[] = []) {
  const accountId = (process.env.CLOUDFLARE_ACCOUNT_ID || "").trim();
  const databaseId = (process.env.CLOUDFLARE_DATABASE_ID || "").trim();
  const token = (process.env.CLOUDFLARE_API_TOKEN || "").trim();

  if (!accountId || !databaseId || !token) {
    console.warn("D1 Credentials missing in environment variables. Please check Settings > Secrets.");
    return null;
  }

  try {
    const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    if (accountId.length !== 32) {
      console.warn(`[D1 Hint] Account ID is ${accountId.length} chars, usually it's exactly 32 hex chars.`);
    }
    if (databaseId.length !== 32) {
      console.warn(`[D1 Hint] Database ID is ${databaseId.length} chars, usually it's exactly 32 hex chars.`);
    }

    console.log(`[D1] SQL: ${sql.substring(0, 50)}...`);
    console.log(`[D1] Using Account: ${accountId.substring(0, 8)}... and DB: ${databaseId.substring(0, 8)}...`);

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
      console.error("[D1 ERROR]", JSON.stringify(data.errors));
      if (data.errors && data.errors.some((e: any) => e.code === 10000)) {
        console.error("CRITICAL: Authentication failed. Please verify your CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID in Secrets.");
      }
      return null;
    }
    
    // Cloudflare returns an array of results for each query in the POST body
    // Since we only send one query, we take the first result
    return Array.isArray(data.result) ? data.result[0] : data.result;
  } catch (err) {
    console.error("D1 Fetch Exception:", err);
    return null;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Troubleshooting Endpoints ---

  // Verify Cloudflare Token and List Accounts
  app.get("/api/admin/verify-token", async (req, res) => {
    const token = (process.env.CLOUDFLARE_API_TOKEN || "").trim();
    const providedAccountId = (process.env.CLOUDFLARE_ACCOUNT_ID || "").trim();
    
    if (!token) return res.json({ success: false, message: "Token is missing in Settings > Secrets." });

    const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    try {
      // 1. Verify Token
      const verifyRes = await fetch("https://api.cloudflare.com/client/v4/user/tokens/verify", {
        headers: { "Authorization": authHeader }
      });
      const verifyData: any = await verifyRes.json();

      // 2. List Accessible Accounts
      const accountsRes = await fetch("https://api.cloudflare.com/client/v4/accounts", {
        headers: { "Authorization": authHeader }
      });
      const accountsData: any = await accountsRes.json();

      res.json({
        verification: verifyData,
        accounts: accountsData,
        check: {
          providedAccountId,
          tokenLength: token.length,
          isAccountMatch: accountsData.result?.some((a: any) => a.id === providedAccountId) || false
        }
      });
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
        nameBn TEXT,
        price REAL,
        oldPrice REAL,
        category TEXT,
        images TEXT,
        stock INTEGER,
        isFeatured INTEGER,
        stars REAL,
        description TEXT,
        specs TEXT
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
          message: "Failed to create tables. Check server logs for Authentication or ID errors." 
        });
      }
    } catch (err) {
      res.status(500).json({ success: false, error: String(err) });
    }
  });

  // Emergency Reset Endpoint (Drop and Recreate)
  app.get("/api/admin/reset-db", async (req, res) => {
    console.log("CRITICAL: Resetting database tables...");
    try {
      await queryD1("DROP TABLE IF EXISTS products");
      await queryD1("DROP TABLE IF EXISTS orders");
      
      const createProductsTable = `
        CREATE TABLE products (
          id TEXT PRIMARY KEY,
          name TEXT,
          nameBn TEXT,
          price REAL,
          oldPrice REAL,
          category TEXT,
          images TEXT,
          stock INTEGER,
          isFeatured INTEGER,
          stars REAL,
          description TEXT,
          specs TEXT
        )
      `;

      const createOrdersTable = `
        CREATE TABLE orders (
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

      const pResult = await queryD1(createProductsTable);
      const oResult = await queryD1(createOrdersTable);

      if (pResult && oResult) {
        return res.json({ success: true, message: "Database reset and recreated successfully! Now run /api/admin/seed to fill data." });
      }
      res.status(500).json({ success: false, message: "Failed logic during recreation." });
    } catch (err) {
      res.status(500).json({ success: false, error: String(err) });
    }
  });

  // Seed Database with Initial Data
  app.get("/api/admin/seed", async (req, res) => {
    console.log("Seeding database...");
    let successCount = 0;
    
    for (const p of PRODUCTS) {
      try {
        const sql = `
          INSERT OR REPLACE INTO products (id, name, nameBn, price, oldPrice, category, images, stock, isFeatured, stars, description, specs)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
          p.id, p.name, p.nameBn, p.price, p.oldPrice, p.category, 
          JSON.stringify(p.images), p.stock, p.isFeatured ? 1 : 0, p.stars, 
          p.description, JSON.stringify(p.specs)
        ];
        
        const result = await queryD1(sql, params);
        if (result && result.success) successCount++;
      } catch (e) {
        console.error(`Failed to seed product ${p.id}:`, e);
      }
    }
    
    res.json({ success: true, message: `Seeded ${successCount} out of ${PRODUCTS.length} products.` });
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
    try {
      const d1Result = await queryD1("SELECT * FROM products");
      
      // If D1 is working and has data
      if (d1Result && d1Result.results && d1Result.results.length > 0) {
        const products = d1Result.results.map((p: any) => ({
          ...p,
          images: JSON.parse(p.images || "[]"),
          specs: JSON.parse(p.specs || "{}"),
          isFeatured: Boolean(p.isFeatured)
        }));
        return res.json(products);
      }
      
      // If D1 query failed (null) or is explicitly unsuccessful
      if (!d1Result || d1Result.success === false) {
        console.warn("[D1 Fallback] Database query failed or returned no result object. Using memory data.");
        return res.json(PRODUCTS);
      }

      // If D1 query succeeded but database is empty
      if (d1Result.results && d1Result.results.length === 0) {
        console.info("[D1 Status] Database is empty. Showing default products.");
        return res.json(PRODUCTS);
      }

      res.json(PRODUCTS);
    } catch (err) {
      console.error("Products API exception:", err);
      res.json(PRODUCTS);
    }
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
  app.post("/api/products", async (req, res) => {
    const productData = req.body;
    const newId = String(Date.now());
    const newProduct = {
      ...productData,
      id: newId,
      images: productData.images || ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'],
      nameBn: productData.nameBn || productData.name
    };

    console.log(`Creating product: ${newId} - ${newProduct.name}`);

    // Try D1
    try {
      const d1Result = await queryD1(
        "INSERT INTO products (id, name, nameBn, price, oldPrice, category, images, stock, isFeatured, stars, description, specs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          newId, newProduct.name, newProduct.nameBn, 
          newProduct.price || 0, newProduct.oldPrice || 0, newProduct.category || 'Uncategorized',
          JSON.stringify(newProduct.images), newProduct.stock || 0, 
          newProduct.isFeatured ? 1 : 0, newProduct.stars || 0,
          newProduct.description || '', JSON.stringify(newProduct.specs || {})
        ]
      );
      if (d1Result) console.log("Product inserted into D1 successfully");
    } catch (err) {
      console.error("Error inserting product into D1:", err);
    }

    // Fallback/Sync memory
    PRODUCTS.push(newProduct);
    
    res.status(201).json(newProduct);
  });

  // Delete product
  app.delete("/api/products/:id", async (req, res) => {
    const id = req.params.id;
    console.log(`Deleting product: ${id}`);
    
    // Try D1
    try {
      await queryD1("DELETE FROM products WHERE id = ?", [id]);
    } catch (err) {
      console.error("Error deleting product from D1:", err);
    }

    const index = PRODUCTS.findIndex(p => p.id === id);
    if (index !== -1) {
      PRODUCTS.splice(index, 1);
    }
    
    res.status(204).send();
  });

  // Update product
  app.patch("/api/products/:id", async (req, res) => {
    const id = req.params.id;
    const updates = req.body;
    console.log(`[PATCH] Updating product: ${id}`);
    
    try {
      // 1. Find existing product (Memory or D1)
      let existingProduct = PRODUCTS.find(p => p.id === id);
      
      if (!existingProduct) {
        console.log(`[PATCH] Product ${id} not in memory, checking D1...`);
        try {
          const d1Res = await queryD1("SELECT * FROM products WHERE id = ?", [id]);
          if (d1Res && d1Res.results && d1Res.results.length > 0) {
            const p = d1Res.results[0];
            existingProduct = {
              ...p,
              images: typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []),
              specs: typeof p.specs === 'string' ? JSON.parse(p.specs) : (p.specs || {}),
              isFeatured: Boolean(p.isFeatured)
            };
            console.log(`[PATCH] Found product ${id} in D1`);
          }
        } catch (err) {
          console.error(`[PATCH] Error fetching product ${id} from D1:`, err);
        }
      }

      if (!existingProduct) {
        console.warn(`[PATCH] Product ${id} not found anywhere`);
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      const merged = { ...existingProduct, ...updates };
      console.log(`[PATCH] Merged data for ${id}:`, JSON.stringify(merged).substring(0, 100) + "...");

      // 2. Update D1 (if credentials exist)
      let d1Success = false;
      try {
        const d1Result = await queryD1(
          "UPDATE products SET name = ?, nameBn = ?, price = ?, oldPrice = ?, category = ?, images = ?, stock = ?, isFeatured = ?, stars = ?, description = ?, specs = ? WHERE id = ?",
          [
            merged.name, merged.nameBn || merged.name, merged.price || 0, merged.oldPrice || 0,
            merged.category || 'Uncategorized', JSON.stringify(merged.images || []), merged.stock || 0, 
            merged.isFeatured ? 1 : 0, merged.stars || 0, merged.description || '',
            JSON.stringify(merged.specs || {}), id
          ]
        );
        if (d1Result) {
          console.log(`[PATCH] D1 Update successful for ${id}`);
          d1Success = true;
        }
      } catch (err) {
        console.error(`[PATCH] D1 Update failed for ${id}:`, err);
      }

      // 3. Update Memory
      const index = PRODUCTS.findIndex(p => p.id === id);
      if (index !== -1) {
        PRODUCTS[index] = merged;
        console.log(`[PATCH] Memory Update successful for ${id}`);
      }

      return res.json(merged);
    } catch (globalErr: any) {
      console.error("[PATCH] Global Error:", globalErr);
      return res.status(500).json({ success: false, message: globalErr.message });
    }
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

  app.listen(PORT, "0.0.0.0", async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    // Auto-init DB tables on start
    console.log("Attempting auto-initialization of DB tables...");
    const initSql = `
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT,
        nameBn TEXT,
        price REAL,
        oldPrice REAL,
        category TEXT,
        images TEXT,
        stock INTEGER,
        isFeatured INTEGER,
        stars REAL,
        description TEXT,
        specs TEXT
      );
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customerName TEXT,
        customerPhone TEXT,
        customerAddress TEXT,
        total REAL,
        items TEXT,
        status TEXT,
        createdAt TEXT
      );
    `;
    try {
      // Split and run separately for better compatibility
      await queryD1(`CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY, name TEXT, nameBn TEXT, price REAL, oldPrice REAL, 
        category TEXT, images TEXT, stock INTEGER, isFeatured INTEGER, 
        stars REAL, description TEXT, specs TEXT
      )`);
      await queryD1(`CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY, customerName TEXT, customerPhone TEXT, 
        customerAddress TEXT, total REAL, items TEXT, status TEXT, createdAt TEXT
      )`);

      // Ensure necessary columns exist (for existing tables)
      const columnFixes = [
        "ALTER TABLE products ADD COLUMN nameBn TEXT",
        "ALTER TABLE products ADD COLUMN oldPrice REAL DEFAULT 0",
        "ALTER TABLE products ADD COLUMN stars REAL DEFAULT 0",
        "ALTER TABLE products ADD COLUMN specs TEXT DEFAULT '{}'",
        "ALTER TABLE products ADD COLUMN description TEXT DEFAULT ''"
      ];

      for (const sql of columnFixes) {
        try {
          await queryD1(sql);
          console.log(`Executed: ${sql}`);
        } catch (e: any) {
          // Ignore "duplicate column" errors
          const msg = e.message?.toLowerCase() || "";
          if (!msg.includes("duplicate column") && !msg.includes("already exists")) {
            console.warn(`Column check failed for: ${sql}`, e.message);
          }
        }
      }

      console.log("Auto-init complete.");
    } catch (err) {
      console.error("Auto-init failed (likely credentials not set):", err);
    }
  });
}

startServer();
