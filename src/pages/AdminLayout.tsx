import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Store,
  LogOut,
  CreditCard,
  Tags,
  Ticket,
  Truck,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  LayoutDashboard,
  Menu,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminProducts from '@/pages/AdminProducts';
import AdminOrders from '@/pages/AdminOrders';
import AdminIncompleteOrders from '@/pages/AdminIncompleteOrders';
import AdminCategories from '@/pages/AdminCategories';
import AdminPayments from '@/pages/AdminPayments';
import AdminCustomers from '@/pages/AdminCustomers';
import AdminDeliveryZones from '@/pages/AdminDeliveryZones';
import AdminCMS from '@/pages/AdminCMS';
import AdminBanners from '@/pages/AdminBanners';
import AdminSettings from '@/pages/AdminSettings';
import AdminCoupons from '@/pages/AdminCoupons';
import { useSettings } from '@/context/SettingsContext';
import { convertGoogleDriveLink } from '@/lib/imageUtils';

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

const SidebarContent = ({ pathname, onLinkClick }: { pathname: string, onLinkClick?: () => void }) => {
  const { settings } = useSettings();
  return (
    <>
      <div className="p-8 border-b bg-white/50 backdrop-blur-md sticky top-0 z-10">
         <Link to="/admin" className="flex items-center shrink-0 transition-transform active:scale-95 group">
           {settings.logo ? (
             <img 
               src={convertGoogleDriveLink(settings.logo)} 
               alt="Logo" 
               className="h-10 w-auto object-contain" 
               referrerPolicy="no-referrer"
             />
           ) : (
             <div className="text-2xl font-black text-primary flex items-center group uppercase">
               {settings.shopName?.split(' ')[0] || 'OJALA'} <span className="text-accent ml-1 italic font-light group-hover:translate-x-1 transition-transform">{settings.shopName?.split(' ')[1] || 'SHOP'}</span>
             </div>
           )}
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
            <Link 
              key={i} 
              to={item.path!} 
              onClick={onLinkClick}
              className="block"
            >
              <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                (item.path === '/admin' ? pathname === '/admin' || pathname === '/admin/' : pathname.startsWith(item.path)) ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 hover:bg-primary/5 hover:text-primary'
              }`}>
                <div className={`${(item.path === '/admin' ? pathname === '/admin' || pathname === '/admin/' : pathname.startsWith(item.path)) ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`}>
                  {item.icon}
                </div>
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
            </Link>
          )
        ))}
      </nav>
    </ScrollArea>
    <div className="p-4 border-t bg-white space-y-2">
       <Link to="/" className="block" onClick={onLinkClick}>
         <Button variant="ghost" className="w-full justify-start gap-3 text-primary hover:text-primary hover:bg-primary/5 rounded-lg h-11 border border-primary/10">
            <Store className="h-5 w-5" />
            <span className="font-bold text-sm">Visit Store</span>
            <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
         </Button>
       </Link>
       <Link to="/" className="block">
         <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:text-destructive hover:bg-destructive/5 rounded-lg h-11">
            <LogOut className="h-5 w-5" />
            <span className="font-bold text-sm">Exit Admin</span>
         </Button>
       </Link>
    </div>
  </>
  );
};

const AdminLayout = () => {
  const location = useLocation();
  const { settings } = useSettings();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  return (
    <div className="flex min-h-screen w-full bg-slate-50 relative">
      {/* Sidebar for Desktop */}
      <aside className="w-72 bg-white border-r hidden lg:flex flex-col sticky top-0 h-screen shadow-sm z-20">
        <SidebarContent pathname={location.pathname} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Mobile Top Header */}
        <header className="lg:hidden h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
           <Link to="/admin" className="flex items-center">
              {settings.logo ? (
                <img src={convertGoogleDriveLink(settings.logo)} alt="Logo" className="h-8 w-auto object-contain" referrerPolicy="no-referrer" />
              ) : (
                <div className="text-xl font-black text-primary uppercase">
                  {settings.shopName || 'OJALA SHOP'} <span className="text-[8px] text-muted-foreground uppercase ml-1">Admin</span>
                </div>
              )}
           </Link>
           <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger nativeButton={false} render={
                <div className="lg:hidden p-2 cursor-pointer -mr-2 text-slate-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                  <Menu className="h-6 w-6" />
                </div>
              } />
              <SheetContent side="left" className="p-0 w-72 flex flex-col">
                 <SidebarContent 
                  pathname={location.pathname} 
                  onLinkClick={() => setIsMobileMenuOpen(false)} 
                />
              </SheetContent>
           </Sheet>
        </header>

        {/* Main View Area */}
        <div className="flex-grow p-4 md:p-6 lg:p-10 overflow-x-hidden">
           <div className="max-w-7xl mx-auto">
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="incomplete-orders" element={<AdminIncompleteOrders />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="delivery-zones" element={<AdminDeliveryZones />} />
                <Route path="cms" element={<AdminCMS />} />
                <Route path="banners" element={<AdminBanners />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="*" element={<div className="p-20 text-center text-muted-foreground italic bg-white rounded-2xl border shadow-sm">New feature coming soon...</div>} />
              </Routes>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
