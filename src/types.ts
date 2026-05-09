export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  nameBn: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  images: string[];
  stock: number;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  isNewArrival?: boolean;
  isBestSelling?: boolean;
  specs?: Record<string, string>;
  stars?: number;
  reviews?: Review[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId?: string;
  guestEmail?: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  total: number;
  deposit: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'partially_paid' | 'paid';
  createdAt: string;
  trackingId?: string;
  invoiceUrl?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  phone?: string;
  address?: string;
  role: 'customer' | 'admin';
}
