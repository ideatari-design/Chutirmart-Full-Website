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

      const { results } = await env.DB.prepare("SELECT * FROM products").all();
      
      if (!results || results.length === 0) {
        return jsonResponse(PRODUCTS); // Fallback if DB empty
      }

      const parsedResults = results.map(p => ({
        ...p,
        images: JSON.parse(p.images || "[]"),
        specs: JSON.parse(p.specs || "{}"),
        isFeatured: Boolean(p.isFeatured)
      }));
      return jsonResponse(parsedResults);
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
    if (path === "/api/orders" && method === "POST") {
      const order = await request.json();
      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      
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

      return jsonResponse({ success: true, id }, 201);
    }

    // --- Database Initialization/Health ---
    if (path === "/api/admin/setup" && method === "GET") {
      console.log("Setting up D1 tables...");
      
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

      return jsonResponse({ success: true, message: "Tables created (if not existed). Now use Cloudflare D1 console to import data or we can add a seed endpoint." });
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
      return jsonResponse({ status: "ok", environment: "Cloudflare Pages" });
    }

    return jsonResponse({ error: "Route not found", path }, 404);

  } catch (error) {
    return jsonResponse({ error: error.message, stack: error.stack }, 500);
  }
}
