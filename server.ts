import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

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
    images: ['https://images.unsplash.com/photo-1585233841535-987bba5ed69b?auto=format&fit=crop&q=80&w=800'], 
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
    images: ['https://images.unsplash.com/photo-1616422285623-13ff0167c958?auto=format&fit=crop&q=80&w=800'], 
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
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'], 
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
    images: ['https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&q=80&w=800'], 
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
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=200'], 
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
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1200'], 
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Ojala Shop Server Running" });
  });

  // Get all orders
  app.get("/api/orders", (req, res) => {
    res.json(ORDERS);
  });

  // Get all products
  app.get("/api/products", (req, res) => {
    res.json(PRODUCTS);
  });

  // Get single product
  app.get("/api/products/:id", (req, res) => {
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

  // Create order
  app.post("/api/orders", (req, res) => {
    const orderData = req.body;
    const newOrder = {
      ...orderData,
      id: `#${Math.floor(Math.random() * 900000) + 100000}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    ORDERS.push(newOrder);
    console.log(`New Order Created: ${newOrder.id}`);
    res.status(201).json(newOrder);
  });

  // Get order by tracking ID
  app.get("/api/orders/:id", (req, res) => {
    const order = ORDERS.find(o => o.id === req.params.id || o.trackingId === req.params.id);
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
