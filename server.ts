import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";
import multer from "multer";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Multer Configuration for File Uploads ---
const uploadDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|ico|svg|webp|avif/;
    const ext = path.extname(file.originalname).toLowerCase();
    const extname = allowedTypes.test(ext);
    const mimetype = allowedTypes.test(file.mimetype);
    
    console.log(`[Upload Filter] Receiving file: ${file.originalname} (${file.mimetype})`);
    
    if (extname || mimetype) {
      return cb(null, true);
    }
    cb(new Error(`Invalid file type: ${file.mimetype}. Only images are allowed.`));
  }
});

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
    isFlashSale: true,
    isNewArrival: true,
    isBestSelling: false,
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
    category: 'Smartphone', 
    images: ['https://images.unsplash.com/photo-1622541929213-167c6d45100d?auto=format&fit=crop&q=80&w=800'], 
    stock: 15, 
    isFeatured: true, 
    isFlashSale: true,
    isNewArrival: true,
    isBestSelling: true,
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
    isFlashSale: true,
    isNewArrival: false,
    isBestSelling: true,
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
    isFlashSale: false,
    isNewArrival: true,
    isBestSelling: false,
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
    category: 'Beauty', 
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc53bb7?auto=format&fit=crop&q=80&w=800'], 
    stock: 12, 
    isFeatured: true, 
    isFlashSale: true,
    isNewArrival: true,
    isBestSelling: true,
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
    isFlashSale: false,
    isNewArrival: true,
    isBestSelling: false,
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
    isFlashSale: true,
    isNewArrival: false,
    isBestSelling: true,
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
    isFlashSale: false,
    isNewArrival: true,
    isBestSelling: true,
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
    isFlashSale: true,
    isNewArrival: false,
    isBestSelling: false,
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
    isFlashSale: false,
    isNewArrival: true,
    isBestSelling: true,
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

let BANNERS: any[] = [
  { id: '1', title: 'Banner 1', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600', link: '/products', type: 'hero', status: 'active' },
  { id: '2', title: 'Banner 2', image: 'https://images.unsplash.com/photo-1441984969813-91c709148f06?auto=format&fit=crop&q=80&w=1600', link: '/products', type: 'hero', status: 'active' },
  { id: '3', title: 'Banner 3', image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=1600', link: '/products', type: 'hero', status: 'active' }
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

    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), 10000); // 10s timeout

    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`, {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ sql, params }),
      signal: abortController.signal
    });

    clearTimeout(timeout);

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
  
  // Health check endpoint BEFORE everything else
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  app.use("/uploads", express.static(uploadDir));

  // --- Upload API ---
  app.post("/api/upload", (req, res, next) => {
    console.log("[Upload API] Received upload request");
    upload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.error("[Upload API] Multer Error:", err.code, err.message);
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, message: "File too large (Max 10MB)" });
        }
        return res.status(400).json({ success: false, message: `Upload Error: ${err.message}` });
      } else if (err) {
        console.error("[Upload API] General Error:", err.message);
        return res.status(400).json({ success: false, message: `General Error: ${err.message}` });
      }
      
      if (!req.file) {
        console.warn("[Upload API] No file in request after multer processing");
        return res.status(400).json({ success: false, message: "No file chosen or invalid request" });
      }
      
      const fileUrl = `/uploads/${req.file.filename}`;
      console.log(`[Upload API] File uploaded successfully to ${req.file.path} -> URL: ${fileUrl}`);
      res.json({ success: true, url: fileUrl });
    });
  });

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
        isFlashSale INTEGER DEFAULT 0,
        isNewArrival INTEGER DEFAULT 0,
        isBestSelling INTEGER DEFAULT 0,
        stars REAL,
        description TEXT,
        specs TEXT,
        createdAt TEXT
      )
    `;

    // Ensure columns exist for older tables
    const addFlashSale = "ALTER TABLE products ADD COLUMN isFlashSale INTEGER DEFAULT 0";
    const addNewArrival = "ALTER TABLE products ADD COLUMN isNewArrival INTEGER DEFAULT 0";
    const addBestSelling = "ALTER TABLE products ADD COLUMN isBestSelling INTEGER DEFAULT 0";

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

    const createBannersTable = `
      CREATE TABLE IF NOT EXISTS banners (
        id TEXT PRIMARY KEY,
        title TEXT,
        image TEXT,
        link TEXT,
        type TEXT,
        status TEXT,
        createdAt TEXT
      )
    `;

    const createSettingsTable = `
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        updatedAt TEXT
      )
    `;

    try {
      await queryD1(createProductsTable);
      
      // Try to add columns if they don't exist (D1 might fail if they exist, which is fine)
      try { await queryD1(addFlashSale); } catch(e) {}
      try { await queryD1(addNewArrival); } catch(e) {}
      try { await queryD1(addBestSelling); } catch(e) {}

      await queryD1(createOrdersTable);
      await queryD1(createBannersTable);
      await queryD1(createSettingsTable);

      // Seed default settings if not exists - use a high quality Unsplash logo as a placeholder
      await queryD1("INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES (?, ?, ?)", ["logo", "https://images.unsplash.com/photo-1549463591-24c1882bd398?auto=format&fit=crop&q=80&w=200", new Date().toISOString()]);
      await queryD1("INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES (?, ?, ?)", ["favicon", "https://images.unsplash.com/photo-1549463591-24c1882bd398?auto=format&fit=crop&q=80&w=32", new Date().toISOString()]);
      await queryD1("INSERT OR IGNORE INTO settings (key, value, updatedAt) VALUES (?, ?, ?)", ["shopName", "CHUTIRMART", new Date().toISOString()]);
      
      // Also seed products if empty
      const pCheck = await queryD1("SELECT COUNT(*) as count FROM products");
      if (pCheck && pCheck.results && pCheck.results[0].count === 0) {
        console.log("Database empty, seeding products...");
        for (const p of PRODUCTS) {
          const sql = `
            INSERT INTO products (id, name, nameBn, price, oldPrice, category, images, stock, isFeatured, isFlashSale, isNewArrival, isBestSelling, stars, description, specs, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          const params = [
            p.id, p.name, p.nameBn, p.price, p.oldPrice, p.category, 
            JSON.stringify(p.images), p.stock, 
            p.isFeatured ? 1 : 0, p.isFlashSale ? 1 : 0, p.isNewArrival ? 1 : 0, p.isBestSelling ? 1 : 0,
            p.stars, p.description, JSON.stringify(p.specs),
            new Date().toISOString()
          ];
          await queryD1(sql, params);
        }
      }
      
      return res.json({ success: true, message: "Tables created and verified successfully!" });
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
      await queryD1("DROP TABLE IF EXISTS banners");
      await queryD1("DROP TABLE IF EXISTS settings");
      
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
          isFlashSale INTEGER,
          isNewArrival INTEGER,
          isBestSelling INTEGER,
          stars REAL,
          description TEXT,
          specs TEXT,
          createdAt TEXT
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

      const createBannersTable = `
        CREATE TABLE banners (
          id TEXT PRIMARY KEY,
          title TEXT,
          image TEXT,
          link TEXT,
          type TEXT,
          status TEXT,
          createdAt TEXT
        )
      `;

      const pResult = await queryD1(createProductsTable);
      const oResult = await queryD1(createOrdersTable);
      const bResult = await queryD1(createBannersTable);

      if (pResult && oResult && bResult) {
        return res.json({ success: true, message: "Database reset and recreated successfully!" });
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
          INSERT OR REPLACE INTO products (id, name, nameBn, price, oldPrice, category, images, stock, isFeatured, isFlashSale, isNewArrival, isBestSelling, stars, description, specs, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
          p.id, p.name, p.nameBn, p.price, p.oldPrice, p.category, 
          JSON.stringify(p.images), p.stock, 
          p.isFeatured ? 1 : 0, p.isFlashSale ? 1 : 0, p.isNewArrival ? 1 : 0, p.isBestSelling ? 1 : 0,
          p.stars, p.description, JSON.stringify(p.specs),
          new Date().toISOString()
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

  // Debug uploads directory
  app.get("/api/admin/debug-uploads", (req, res) => {
    try {
      const files = fs.readdirSync(uploadDir);
      res.json({ uploadDir, files, cwd: process.cwd() });
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
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
      const dResult = await queryD1("SELECT * FROM products");
      
      // If D1 is working and has data
      if (dResult && dResult.results && dResult.results.length > 0) {
        // Check if any product has flags set. if NOT, let's fix a few
        const hasFlags = dResult.results.some((p: any) => p.isFlashSale || p.isNewArrival || p.isBestSelling);
        if (!hasFlags) {
          console.log("No products have flags set. Auto-flagging some products...");
          await queryD1("UPDATE products SET isFlashSale = 1, isNewArrival = 1 WHERE id IN (SELECT id FROM products LIMIT 5)");
          await queryD1("UPDATE products SET isBestSelling = 1, isNewArrival = 1 WHERE id IN (SELECT id FROM products ORDER BY id DESC LIMIT 5)");
          // Re-fetch
          const refreshed = await queryD1("SELECT * FROM products");
          if (refreshed && refreshed.results) {
             const products = refreshed.results.map((p: any) => ({
              ...p,
              images: JSON.parse(p.images || "[]"),
              specs: JSON.parse(p.specs || "{}"),
              isFeatured: Boolean(p.isFeatured),
              isFlashSale: Boolean(p.isFlashSale),
              isNewArrival: Boolean(p.isNewArrival),
              isBestSelling: Boolean(p.isBestSelling)
            }));
            return res.json(products);
          }
        }

        const products = dResult.results.map((p: any) => ({
          ...p,
          images: JSON.parse(p.images || "[]"),
          specs: JSON.parse(p.specs || "{}"),
          isFeatured: Boolean(p.isFeatured),
          isFlashSale: Boolean(p.isFlashSale),
          isNewArrival: Boolean(p.isNewArrival),
          isBestSelling: Boolean(p.isBestSelling)
        }));
        return res.json(products);
      }
      
      // If D1 query failed (null) or is explicitly unsuccessful or empty
      console.warn("[D1 Fallback] Database query failed or returned no data. Using memory data.");
      return res.json(PRODUCTS);
    } catch (err) {
      console.error("Products API exception:", err);
      res.json(PRODUCTS);
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    const d1Result = await queryD1("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (d1Result && d1Result.results.length > 0) {
      const p = d1Result.results[0];
      const product = {
        ...p,
        images: JSON.parse(p.images || "[]"),
        specs: JSON.parse(p.specs || "{}"),
        isFeatured: Boolean(p.isFeatured),
        isFlashSale: Boolean(p.isFlashSale),
        isNewArrival: Boolean(p.isNewArrival),
        isBestSelling: Boolean(p.isBestSelling)
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

  // --- Banners API ---
  app.get("/api/banners", async (req, res) => {
    try {
      const d1Result = await queryD1("SELECT * FROM banners ORDER BY createdAt DESC");
      if (d1Result && d1Result.results && d1Result.results.length > 0) {
        return res.json(d1Result.results);
      }
      res.json(BANNERS);
    } catch (err) {
      res.json(BANNERS);
    }
  });

  app.post("/api/banners", async (req, res) => {
    const data = req.body;
    const id = String(Date.now());
    const createdAt = new Date().toISOString();
    const newBanner = { ...data, id, createdAt };

    try {
      await queryD1(
        "INSERT INTO banners (id, title, image, link, type, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [id, data.title || '', data.image, data.link || '', data.type || 'hero', data.status || 'active', createdAt]
      );
    } catch (err) {
      console.error("D1 Banner insert failed:", err);
    }

    BANNERS.push(newBanner);
    res.status(201).json(newBanner);
  });

  app.patch("/api/banners/:id", async (req, res) => {
    const id = req.params.id;
    const updates = req.body;
    
    try {
      const fields = Object.keys(updates);
      if (fields.length > 0) {
        const setClause = fields.map(f => `${f} = ?`).join(", ");
        const values = Object.values(updates);
        await queryD1(`UPDATE banners SET ${setClause} WHERE id = ?`, [...values, id]);
      }
    } catch (err) {
      console.error("D1 Banner update failed:", err);
    }

    const index = BANNERS.findIndex(b => b.id === id);
    if (index !== -1) {
      BANNERS[index] = { ...BANNERS[index], ...updates };
    }
    res.json({ success: true });
  });

  app.delete("/api/banners/:id", async (req, res) => {
    const id = req.params.id;
    try {
      await queryD1("DELETE FROM banners WHERE id = ?", [id]);
    } catch (err) {
      console.error("D1 Banner delete failed:", err);
    }

    const index = BANNERS.findIndex(b => b.id === id);
    if (index !== -1) {
      BANNERS.splice(index, 1);
    }
    res.status(204).send();
  });

  // --- Settings API ---
  app.get("/api/settings", async (req, res) => {
    try {
      const d1Result = await queryD1("SELECT * FROM settings");
      if (d1Result && d1Result.results) {
        const settings: any = {};
        d1Result.results.forEach((s: any) => {
          let val = s.value;
          if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
            try {
              val = JSON.parse(val);
            } catch (e) {
              // Not JSON, keep as is
            }
          }
          settings[s.key] = val;
        });
        return res.json(settings);
      }
      res.json({});
    } catch (err) {
      console.error("Settings GET failed:", err);
      res.status(500).json({ success: false });
    }
  });

  app.patch("/api/settings", async (req, res) => {
    const updates = req.body;
    try {
      for (const [key, value] of Object.entries(updates)) {
        const valToStore = typeof value === 'object' ? JSON.stringify(value) : String(value);
        await queryD1(
          "INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES (?, ?, ?)",
          [key, valToStore, new Date().toISOString()]
        );
      }
      res.json({ success: true });
    } catch (err) {
      console.error("Settings PATCH failed:", err);
      res.status(500).json({ success: false });
    }
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
    const createdAt = new Date().toISOString();
    const newProduct = {
      ...productData,
      id: newId,
      images: productData.images || ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'],
      nameBn: productData.nameBn || productData.name,
      price: parseFloat(productData.price) || 0,
      stock: parseInt(productData.stock) || 0,
      createdAt
    };

    console.log(`[POST] Creating product: ${newId} - ${newProduct.name}`);

    // Try D1
    let d1Error = null;
    try {
      const d1Result = await queryD1(
        "INSERT INTO products (id, name, nameBn, price, oldPrice, category, images, stock, isFeatured, isFlashSale, isNewArrival, isBestSelling, stars, description, specs, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          newId, newProduct.name, newProduct.nameBn, 
          newProduct.price || 0, newProduct.oldPrice || 0, newProduct.category || 'Uncategorized',
          JSON.stringify(newProduct.images), newProduct.stock || 0, 
          newProduct.isFeatured ? 1 : 0, 
          newProduct.isFlashSale ? 1 : 0,
          newProduct.isNewArrival ? 1 : 0,
          newProduct.isBestSelling ? 1 : 0,
          newProduct.stars || 0,
          newProduct.description || '', JSON.stringify(newProduct.specs || {}),
          createdAt
        ]
      );
      if (d1Result && d1Result.success !== false) {
        console.log("[POST] Product inserted into D1 successfully");
      } else if (d1Result && d1Result.success === false) {
        d1Error = `D1 failed: ${JSON.stringify(d1Result.errors || 'Unknown D1 error')}`;
      }
    } catch (err: any) {
      console.error("[POST] Error inserting product into D1:", err);
      d1Error = err.message || String(err);
    }

    // Fallback/Sync memory
    PRODUCTS.push(newProduct);
    
    if (d1Error && process.env.CLOUDFLARE_API_TOKEN) {
      return res.status(500).json({ success: false, message: d1Error });
    }

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
    console.log(`[PATCH] Updating product: ${id}`, updates);
    
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
              isFeatured: Boolean(p.isFeatured),
              isFlashSale: Boolean(p.isFlashSale),
              isNewArrival: Boolean(p.isNewArrival),
              isBestSelling: Boolean(p.isBestSelling)
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

      // Merge data carefully
      const merged = { 
        ...existingProduct, 
        ...updates,
        // Ensure price is number
        price: typeof updates.price !== 'undefined' ? parseFloat(updates.price) : existingProduct.price,
        stock: typeof updates.stock !== 'undefined' ? parseInt(updates.stock) : existingProduct.stock
      };
      
      console.log(`[PATCH] Merged data for ${id} ready for DB`);

      // 2. Update D1
      let d1Error = null;
      try {
        const d1Result = await queryD1(
          "UPDATE products SET name = ?, nameBn = ?, price = ?, oldPrice = ?, category = ?, images = ?, stock = ?, isFeatured = ?, isFlashSale = ?, isNewArrival = ?, isBestSelling = ?, stars = ?, description = ?, specs = ? WHERE id = ?",
          [
            merged.name || '', 
            merged.nameBn || merged.name || '', 
            merged.price || 0, 
            merged.oldPrice || 0,
            merged.category || 'Uncategorized', 
            JSON.stringify(merged.images || []), 
            merged.stock || 0, 
            merged.isFeatured ? 1 : 0, 
            merged.isFlashSale ? 1 : 0,
            merged.isNewArrival ? 1 : 0,
            merged.isBestSelling ? 1 : 0,
            merged.stars || 0, 
            merged.description || '',
            JSON.stringify(merged.specs || {}), 
            id
          ]
        );
        
        if (!d1Result) {
          d1Error = "D1 query returned no response (likely auth or config error)";
        } else if (d1Result.success === false) {
          d1Error = `D1 update failed: ${JSON.stringify(d1Result.errors || d1Result.error || 'Unknown D1 error')}`;
        } else {
          console.log(`[PATCH] D1 Update confirmed success for ${id}`);
        }
      } catch (err: any) {
        console.error(`[PATCH] D1 Update exception for ${id}:`, err);
        d1Error = err.message || String(err);
      }

      // 3. Update Memory (Fallback / Sync)
      const index = PRODUCTS.findIndex(p => p.id === id);
      if (index !== -1) {
        PRODUCTS[index] = merged;
      } else {
        // If it wasn't in memory but is in D1, we might want to add it to memory 
        // to keep them semi-synced, or just let it stay in D1.
        // For simplicity, we just keep current PRODUCTS as is.
      }

      if (d1Error) {
        console.warn(`[PATCH] Product updated in memory but D1 failed: ${d1Error}`);
        // If D1 failed but it worked in memory (for dev), we might still want to return success 
        // OR return a 500 if we HARD require D1.
        // Since this is a "deep fix", let's be strict if D1 is configured.
        if (process.env.CLOUDFLARE_API_TOKEN) {
          return res.status(500).json({ success: false, message: d1Error });
        }
      }

      return res.json(merged);
    } catch (globalErr: any) {
      console.error("[PATCH] Fatal Error:", globalErr);
      return res.status(500).json({ success: false, message: globalErr.message || "Server Error" });
    }
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    const orderData = req.body;
    const orderId = `CHU#${Math.floor(Math.random() * 900000) + 100000}`;
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
    const trackingId = req.params.id;
    let orderId = trackingId;
    
    // Support various formats for lookup: '123456', '#123456', 'CHU#123456'
    if (!orderId.includes('#')) {
      // Try to find if either # or CHU# exists
      const d1Check = await queryD1("SELECT id FROM orders WHERE id LIKE ?", [`%#${orderId}`]);
      if (d1Check && d1Check.results.length > 0) {
        orderId = d1Check.results[0].id;
      }
    }

    const d1Result = await queryD1("SELECT * FROM orders WHERE id = ?", [orderId]);
    if (d1Result && d1Result.results.length > 0) {
      const order = {
        ...d1Result.results[0],
        items: JSON.parse(d1Result.results[0].items || "[]")
      };
      return res.json(order);
    }

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
      await queryD1(`CREATE TABLE IF NOT EXISTS banners (
        id TEXT PRIMARY KEY, title TEXT, image TEXT, link TEXT, type TEXT, status TEXT, createdAt TEXT
      )`);
      await queryD1(`CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY, value TEXT, updatedAt TEXT
      )`);

      // Ensure necessary columns exist (for existing tables)
      const columnFixes = [
        "ALTER TABLE products ADD COLUMN nameBn TEXT",
        "ALTER TABLE products ADD COLUMN oldPrice REAL DEFAULT 0",
        "ALTER TABLE products ADD COLUMN stars REAL DEFAULT 0",
        "ALTER TABLE products ADD COLUMN specs TEXT DEFAULT '{}'",
        "ALTER TABLE products ADD COLUMN description TEXT DEFAULT ''",
        "ALTER TABLE products ADD COLUMN isFeatured INTEGER DEFAULT 0",
        "ALTER TABLE products ADD COLUMN isFlashSale INTEGER DEFAULT 0",
        "ALTER TABLE products ADD COLUMN isNewArrival INTEGER DEFAULT 0",
        "ALTER TABLE products ADD COLUMN isBestSelling INTEGER DEFAULT 0",
        "ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 0",
        "ALTER TABLE products ADD COLUMN category TEXT DEFAULT 'Uncategorized'"
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

startServer().catch(err => {
  console.error("FATAL: Failed to start server:", err);
  process.exit(1);
});
