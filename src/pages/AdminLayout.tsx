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
    { label: 'ড্যাশবোর্ড', icon: <LayoutDashboard className="h-5 w-5" />, path: '/admin' },
    { 
      label: 'অর্ডার ম্যানেজমেন্ট', 
      isHeader: true 
    },
    { label: 'সব অর্ডার', icon: <ShoppingCart className="h-5 w-5" />, path: '/admin/orders' },
    { label: 'অসম্পূর্ণ অর্ডার', icon: <AlertCircle className="h-5 w-5" />, path: '/admin/incomplete-orders' },
    { label: 'পেমেন্ট', icon: <CreditCard className="h-5 w-5" />, path: '/admin/payments' },
    { 
      label: 'পণ্য ম্যানেজমেন্ট', 
      isHeader: true 
    },
    { label: 'সব পণ্য', icon: <Package className="h-5 w-5" />, path: '/admin/products' },
    { label: 'ক্যাটাগরি', icon: <Tags className="h-5 w-5" />, path: '/admin/categories' },
    { label: 'কুপন', icon: <Ticket className="h-5 w-5" />, path: '/admin/coupons' },
    { label: 'ডেলিভেরি জোন', icon: <Truck className="h-5 w-5" />, path: '/admin/delivery-zones' },
    { 
      label: 'স্টোর কন্টেন্ট', 
      isHeader: true 
    },
    { label: 'কাস্টমার', icon: <Users className="h-5 w-5" />, path: '/admin/customers' },
    { label: 'কন্টেন্ট (CMS)', icon: <FileText className="h-5 w-5" />, path: '/admin/cms' },
    { label: 'ব্যানার', icon: <ImageIcon className="h-5 w-5" />, path: '/admin/banners' },
    { label: 'সেটিংস', icon: <Settings className="h-5 w-5" />, path: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r hidden lg:flex flex-col sticky top-0 h-screen shadow-sm">
        <div className="p-8 border-b bg-white/50 backdrop-blur-md sticky top-0 z-10">
           <Link to="/" className="text-2xl font-black text-primary flex items-center">
             OJALA <span className="text-accent ml-1 italic font-light">SHOP</span>
           </Link>
           <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1">Admin Control Panel</p>
        </div>
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
              <span className="font-bold text-sm">লগ আউট</span>
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
              <Route path="/payments" element={<div className="p-10 text-center">পেমেন্ট পেজ শীঘ্রই আসছে...</div>} />
              <Route path="/customers" element={<div className="p-10 text-center">কাস্টমার পেজ শীঘ্রই আসছে...</div>} />
              <Route path="/categories" element={<AdminCategories />} />
              <Route path="/coupons" element={<div className="p-10 text-center">কুপন পেজ শীঘ্রই আসছে...</div>} />
              <Route path="/delivery-zones" element={<div className="p-10 text-center">ডেলিভারি জোন পেজ শীঘ্রই আসছে...</div>} />
              <Route path="/cms" element={<div className="p-10 text-center">CMS পেজ শীঘ্রই আসছে...</div>} />
              <Route path="/banners" element={<div className="p-10 text-center">ব্যানার পেজ শীঘ্রই আসছে...</div>} />
              <Route path="/settings" element={<div className="p-10 text-center">সেটিংস পেজ শীঘ্রই আসছে...</div>} />
              <Route path="*" element={<div className="p-20 text-center text-muted-foreground italic bg-white rounded-2xl border shadow-sm">নতুন ফিচার শীঘ্রই আসছে...</div>} />
            </Routes>
         </div>
      </main>
    </div>
  );
};

export default AdminLayout;
