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
    specs: { 'Power': '200W', 'Battery': '2000mAh', 'Capacity': '380ml' }
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
    specs: { 'Battery': '4000mAh', 'Speeds': '3 Levels' }
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
    specs: { 'Drivers': '50mm', 'Connector': 'USB & 3.5mm' }
  },
  { 
    id: '4', 
    name: 'Mechanical Mini Keyboard', 
    nameBn: 'মেকানিক্যাল কিবোর্ড', 
    price: 3200, 
    oldPrice: 4500,
    category: 'Accessories', 
    images: ['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800'], 
    stock: 8, 
    isFeatured: true, 
    stars: 4.7,
    description: '60% Mechanical keyboard with red switches.',
    specs: { 'Type': 'Mechanical', 'Switch': 'Red' }
  },
  { 
    id: '5', 
    name: 'Smart Mirror Beauty', 
    nameBn: 'স্মার্ট মিরর বিউটি', 
    price: 2500, 
    oldPrice: 3500,
    category: 'Beauty', 
    images: ['https://images.unsplash.com/photo-1616489953149-6f9661158d60?auto=format&fit=crop&q=80&w=800'], 
    stock: 12, 
    isFeatured: true, 
    stars: 4.6,
    description: 'LED Smart mirror with touch controls.',
    specs: { 'Light': 'LED', 'Power': 'Rechargeable' }
  },
  { 
    id: '6', 
    name: 'Air Purifier X', 
    nameBn: 'এয়ার পিউরিফায়ার X', 
    price: 12000, 
    oldPrice: 15000,
    category: 'Appliances', 
    images: ['https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=800'], 
    stock: 3, 
    isFeatured: true, 
    stars: 4.9,
    description: 'High efficiency HEPA air purifier.',
    specs: { 'Filter': 'HEPA', 'Coverage': '500sqft' }
  },
  { 
    id: '7', 
    name: 'Bluetooth Speaker Boom', 
    nameBn: 'ব্লুটুথ স্পিকার', 
    price: 1800, 
    oldPrice: 2500,
    category: 'Audio', 
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800'], 
    stock: 20, 
    isFeatured: true, 
    stars: 4.4,
    description: 'Portable waterproof Bluetooth speaker.',
    specs: { 'Waterproof': 'IPX7', 'Battery': '12h' }
  },
  { 
    id: '8', 
    name: 'Modern Table Lamp', 
    nameBn: 'মডার্ন টেবিল ল্যাম্প', 
    price: 1200, 
    oldPrice: 1900,
    category: 'Home & Decor', 
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800'], 
    stock: 15, 
    isFeatured: true, 
    stars: 4.7,
    description: 'Elegant Nordic style table lamp.',
    specs: { 'Material': 'Wood/Metal', 'Bulb': 'E27' }
  }
];

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // Middleware: JSON Response Helper
  const jsonResponse = (data, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
    });
  };

  // Handle CORS Preflight
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }

  try {
    // --- Products API ---
    if (path === "/api/products" && method === "GET") {
      if (!env.DB) {
        console.warn("D1 DB mapping missing, using fallback products.");
        return jsonResponse(PRODUCTS);
      }

      let results;
      try {
        const d1Res = await env.DB.prepare("SELECT * FROM products").all();
        results = d1Res.results;
      } catch (e) {
        console.error("Query failed, likely table doesn't exist yet:", e);
        return jsonResponse(PRODUCTS);
      }
      
      // Auto-Seed if DB is empty
      if (!results || results.length === 0) {
        console.log("DB is empty, seeding default products...");
        for (const p of PRODUCTS) {
          try {
            await env.DB.prepare(`
              INSERT OR IGNORE INTO products (id, name, nameBn, price, oldPrice, category, images, stock, isFeatured, stars, description, specs)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
              p.id, p.name, p.nameBn || p.name, p.price, p.oldPrice || 0, p.category, 
              JSON.stringify(p.images), p.stock, p.isFeatured ? 1 : 0, 
              p.stars || 0, p.description || '', JSON.stringify(p.specs || {})
            ).run();
          } catch (e) {
            console.error("Seed failed for", p.id, e);
          }
        }
        // Fetch again after seed
        const refreshed = await env.DB.prepare("SELECT * FROM products").all();
        results = refreshed.results || [];
      }

      const parsedResults = results.map(p => ({
        ...p,
        images: typeof p.images === 'string' ? JSON.parse(p.images || "[]") : (p.images || []),
        specs: typeof p.specs === 'string' ? JSON.parse(p.specs || "{}") : (p.specs || {}),
        isFeatured: Boolean(p.isFeatured)
      }));
      return jsonResponse(parsedResults);
    }

    if (path === "/api/products" && method === "POST") {
      if (!env.DB) return jsonResponse({ error: "Database not connected. Please bind Cloudflare D1 in Pages Dashboard." }, 500);
      
      const data = await request.json();
      const id = String(Date.now());
      const newProduct = {
        ...data,
        id,
        images: data.images || [],
        price: parseFloat(data.price) || 0,
        stock: parseInt(data.stock) || 0,
        isFeatured: data.isFeatured ? 1 : 0
      };

      if (env.DB) {
        await env.DB.prepare(`
          INSERT INTO products (id, name, nameBn, price, oldPrice, category, images, stock, isFeatured, stars, description, specs)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          id, newProduct.name || '', newProduct.nameBn || newProduct.name || '',
          newProduct.price, data.oldPrice || 0, newProduct.category || 'Uncategorized',
          JSON.stringify(newProduct.images), newProduct.stock, newProduct.isFeatured,
          data.stars || 0, data.description || '', JSON.stringify(data.specs || {})
        ).run();
      }
      return jsonResponse(newProduct, 201);
    }

    if (path.startsWith("/api/products/") && method === "PATCH") {
      if (!env.DB) return jsonResponse({ error: "Database not connected. Please bind Cloudflare D1 in Pages Dashboard." }, 500);

      const id = path.split("/").pop();
      const updates = await request.json();
      
      const existing = await env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(id).first();

      if (!existing) return jsonResponse({ error: "Product not found in Database" }, 404);

      const merged = { ...existing, ...updates };
      // Ensure specific types
      const price = typeof updates.price !== 'undefined' ? parseFloat(updates.price) : existing.price;
      const stock = typeof updates.stock !== 'undefined' ? parseInt(updates.stock) : existing.stock;
      const isFeatured = typeof updates.isFeatured !== 'undefined' ? (updates.isFeatured ? 1 : 0) : (existing.isFeatured ? 1 : 0);

      await env.DB.prepare(`
        UPDATE products SET 
          name = ?, nameBn = ?, price = ?, oldPrice = ?, category = ?, 
          images = ?, stock = ?, isFeatured = ?, stars = ?, description = ?, specs = ? 
        WHERE id = ?
      `).bind(
        merged.name || '', 
        merged.nameBn || merged.name || '', 
        price, 
        merged.oldPrice || 0,
        merged.category || 'Uncategorized',
        JSON.stringify(typeof merged.images === 'string' ? JSON.parse(merged.images || "[]") : (merged.images || [])),
        stock,
        isFeatured,
        merged.stars || 0,
        merged.description || '',
        JSON.stringify(typeof merged.specs === 'string' ? JSON.parse(merged.specs || "{}") : (merged.specs || {})),
        id
      ).run();

      return jsonResponse({ ...merged, price, stock, isFeatured: Boolean(isFeatured) });
    }

    if (path.startsWith("/api/products/") && method === "DELETE") {
      const id = path.split("/").pop();
      if (env.DB) {
        await env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
      }
      return new Response(null, { status: 204 });
    }

    if (path.startsWith("/api/products/") && method === "GET") {
      const id = path.split("/").pop();
      
      if (!env.DB) {
        const product = PRODUCTS.find(p => p.id === id);
        return product ? jsonResponse(product) : jsonResponse({ error: "Not found" }, 404);
      }

      const product = await env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(id).first();
      
      if (!product) {
        const fbProduct = PRODUCTS.find(p => p.id === id);
        return fbProduct ? jsonResponse(fbProduct) : jsonResponse({ error: "Product not found" }, 404);
      }
      
      const parsedProduct = {
        ...product,
        images: JSON.parse(product.images || "[]"),
        specs: JSON.parse(product.specs || "{}"),
        isFeatured: Boolean(product.isFeatured)
      };
      return jsonResponse(parsedProduct);
    }

    // --- Orders API ---
    if (path === "/api/orders" && method === "GET") {
      if (!env.DB) return jsonResponse([]);
      const { results } = await env.DB.prepare("SELECT * FROM orders ORDER BY createdAt DESC").all();
      const parsedResults = results.map(o => ({
        ...o,
        items: JSON.parse(o.items || "[]")
      }));
      return jsonResponse(parsedResults);
    }

    if (path.startsWith("/api/orders/") && method === "GET") {
      const parts = path.split("/");
      let id = parts[3] || parts.pop();
      id = decodeURIComponent(id).replace(/^#/, ""); // Strip leading #
      
      if (!env.DB) {
        return jsonResponse({
          id,
          customerName: "Guest",
          customerPhone: "01700000000",
          customerAddress: "Dhaka",
          total: 0,
          items: [],
          status: "pending",
          createdAt: new Date().toISOString()
        });
      }

      const order = await env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(id).first();
      if (!order) return jsonResponse({ error: "Order not found" }, 404);
      
      return jsonResponse({
        ...order,
        items: JSON.parse(order.items || "[]")
      });
    }

    if (path === "/api/orders" && method === "POST") {
      const order = await request.json();
      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      
      if (env.DB) {
        await env.DB.prepare(`
          INSERT INTO orders (id, customerName, customerPhone, customerAddress, total, items, status, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          id, 
          order.customerName, 
          order.customerPhone, 
          order.customerAddress, 
          order.total, 
          JSON.stringify(order.items), 
          "pending", 
          createdAt
        ).run();
      }

      return jsonResponse({ ...order, id, status: "pending", createdAt }, 201);
    }

    if (path.includes("/status") && method === "PATCH") {
      const id = path.split("/")[3];
      const { status } = await request.json();
      
      if (env.DB) {
        await env.DB.prepare("UPDATE orders SET status = ? WHERE id = ?").bind(status, id).run();
      }
      return jsonResponse({ success: true });
    }

    // --- Database Initialization/Health ---
    if (path === "/api/admin/setup" && method === "GET") {
      console.log("Setting up D1 tables...");
      
      try {
        await env.DB.prepare(`
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
        `).run();

        await env.DB.prepare(`
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
        `).run();

        // Add columns if they migrated from earlier version
        const columns = [
          "ALTER TABLE products ADD COLUMN nameBn TEXT",
          "ALTER TABLE products ADD COLUMN oldPrice REAL DEFAULT 0",
          "ALTER TABLE products ADD COLUMN stars REAL DEFAULT 0",
          "ALTER TABLE products ADD COLUMN specs TEXT DEFAULT '{}'",
          "ALTER TABLE products ADD COLUMN description TEXT DEFAULT ''",
          "ALTER TABLE products ADD COLUMN isFeatured INTEGER DEFAULT 0",
          "ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 0",
          "ALTER TABLE products ADD COLUMN category TEXT DEFAULT 'Uncategorized'"
        ];

        for (const sql of columns) {
          try {
            await env.DB.prepare(sql).run();
          } catch (e) {
            // Ignore duplicate column errors
          }
        }

        return jsonResponse({ success: true, message: "Tables and columns verified successfully!" });
      } catch (err) {
        return jsonResponse({ success: false, error: err.message }, 500);
      }
    }

    if (path === "/api/admin/seed" && method === "GET") {
      const sampleProducts = [
        {
          id: "1",
          name: "Casual T-Shirt",
          nameBn: "ক্যাজুয়াল টি-শার্ট",
          price: 450,
          oldPrice: 550,
          category: "Fashion",
          images: JSON.stringify(["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"]),
          stock: 50,
          isFeatured: 1,
          stars: 4.5,
          description: "High quality cotton t-shirt",
          specs: JSON.stringify({ Material: "Cotton", Color: "White" })
        },
        {
          id: "2",
          name: "Smart Watch",
          nameBn: "স্মার্ট ওয়াচ",
          price: 2500,
          oldPrice: 3000,
          category: "Gadgets",
          images: JSON.stringify(["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"]),
          stock: 20,
          isFeatured: 1,
          stars: 4.8,
          description: "Feature rich smart watch",
          specs: JSON.stringify({ Storage: "16GB", Battery: "300mAh" })
        }
      ];

      for (const p of sampleProducts) {
        await env.DB.prepare(`
          INSERT OR REPLACE INTO products (id, name, nameBn, price, oldPrice, category, images, stock, isFeatured, stars, description, specs)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          p.id, p.name, p.nameBn, p.price, p.oldPrice, p.category, 
          p.images, p.stock, p.isFeatured, p.stars, p.description, p.specs
        ).run();
      }

      return jsonResponse({ success: true, message: "Sample data seeded successfully!" });
    }

    if (path === "/api/health") {
      return jsonResponse({ 
        status: "ok", 
        environment: "Cloudflare Pages",
        databaseConnected: !!env.DB,
        timestamp: new Date().toISOString()
      });
    }

    return jsonResponse({ error: "Route not found", path }, 404);

  } catch (error) {
    return jsonResponse({ error: error.message, stack: error.stack }, 500);
  }
}
