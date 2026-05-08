import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  CreditCard,
  Tags,
  Ticket,
  Truck,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminProducts from '@/pages/AdminProducts';
import AdminOrders from '@/pages/AdminOrders';
import AdminIncompleteOrders from '@/pages/AdminIncompleteOrders';
import AdminCategories from '@/pages/AdminCategories';

const AdminLayout = () => {
  const location = useLocation();
  
  const menuItems = [
    { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/admin' },
    { 
      label: 'Order Management', 
      isHeader: true 
    },
    { label: 'All Orders', icon: <ShoppingCart className="h-5 w-5" />, path: '/admin/orders' },
    { label: 'Incomplete Orders', icon: <AlertCircle className="h-5 w-5" />, path: '/admin/incomplete-orders' },
    { label: 'Payments', icon: <CreditCard className="h-5 w-5" />, path: '/admin/payments' },
    { 
      label: 'Product Management', 
      isHeader: true 
    },
    { label: 'All Products', icon: <Package className="h-5 w-5" />, path: '/admin/products' },
    { label: 'Categories', icon: <Tags className="h-5 w-5" />, path: '/admin/categories' },
    { label: 'Coupons', icon: <Ticket className="h-5 w-5" />, path: '/admin/coupons' },
    { label: 'Delivery Zones', icon: <Truck className="h-5 w-5" />, path: '/admin/delivery-zones' },
    { 
      label: 'Store Content', 
      isHeader: true 
    },
    { label: 'Customers', icon: <Users className="h-5 w-5" />, path: '/admin/customers' },
    { label: 'Content (CMS)', icon: <FileText className="h-5 w-5" />, path: '/admin/cms' },
    { label: 'Banners', icon: <ImageIcon className="h-5 w-5" />, path: '/admin/banners' },
    { label: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r hidden lg:flex flex-col sticky top-0 h-screen shadow-sm">
        <ScrollArea className="flex-grow">
          <nav className="p-4 space-y-1">
            {menuItems.map((item, i) => (
              item.isHeader ? (
                <p key={i} className="text-[10px] font-bold uppercase text-muted-foreground px-4 pt-4 pb-2">
                  {item.label}
                </p>
              ) : (
                <Link key={i} to={item.path!}>
                  <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                    location.pathname === item.path ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 hover:bg-primary/5 hover:text-primary'
                  }`}>
                    <div className={`${location.pathname === item.path ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`}>
                      {item.icon}
                    </div>
                    <span className="font-semibold text-sm">{item.label}</span>
                  </div>
                </Link>
              )
            ))}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t bg-white">
           <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:text-destructive hover:bg-destructive/5 rounded-lg h-11">
              <LogOut className="h-5 w-5" />
              <span className="font-bold text-sm">Logout</span>
           </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 lg:p-10">
         <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/products" element={<AdminProducts />} />
              <Route path="/orders" element={<AdminOrders />} />
              <Route path="/incomplete-orders" element={<AdminIncompleteOrders />} />
              <Route path="/payments" element={<div className="p-10 text-center">Payment page coming soon...</div>} />
              <Route path="/customers" element={<div className="p-10 text-center">Customer page coming soon...</div>} />
              <Route path="/categories" element={<AdminCategories />} />
              <Route path="/coupons" element={<div className="p-10 text-center">Coupon page coming soon...</div>} />
              <Route path="/delivery-zones" element={<div className="p-10 text-center">Delivery zone page coming soon...</div>} />
              <Route path="/cms" element={<div className="p-10 text-center">CMS page coming soon...</div>} />
              <Route path="/banners" element={<div className="p-10 text-center">Banner page coming soon...</div>} />
              <Route path="/settings" element={<div className="p-10 text-center">Settings page coming soon...</div>} />
              <Route path="*" element={<div className="p-20 text-center text-muted-foreground italic bg-white rounded-2xl border shadow-sm">New feature coming soon...</div>} />
            </Routes>
         </div>
      </main>
    </div>
  );
};

export default AdminLayout;
