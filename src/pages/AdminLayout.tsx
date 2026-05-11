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
    label: 'Products Managements', 
    isHeader: true 
  },
  { label: 'All Products', icon: <Package className="h-5 w-5" />, path: '/admin/products' },
  { label: 'Categories', icon: <Tags className="h-5 w-5" />, path: '/admin/categories' },
  { label: 'Coupons', icon: <Ticket className="h-5 w-5" />, path: '/admin/coupons' },
  { label: 'Delivery Zone', icon: <Truck className="h-5 w-5" />, path: '/admin/delivery-zones' },
  { 
    label: 'Store Settings', 
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
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 sticky top-0 bg-white z-10 mb-4">
         <Link to="/admin" className="flex items-center shrink-0">
           {settings.logo ? (
             <img 
               src={convertGoogleDriveLink(settings.logo)} 
               alt="Logo" 
               className="h-14 w-auto object-contain" 
               referrerPolicy="no-referrer"
             />
           ) : (
             <div className="text-2xl font-black text-primary flex items-center group uppercase">
               {settings.shopName?.split(' ')[0] || 'CHUTIR'} <span className="text-accent ml-1 uppercase">{settings.shopName?.split(' ')[1] || 'MART'}</span>
             </div>
           )}
         </Link>
      </div>

      <ScrollArea className="flex-grow px-4">
        <nav className="space-y-1 pb-10">
          {menuItems.map((item, i) => (
            item.isHeader ? (
              <p key={i} className="text-[11px] font-medium text-slate-500 px-3 pt-6 pb-2">
                {item.label}
              </p>
            ) : (
              <Link 
                key={i} 
                to={item.path!} 
                onClick={onLinkClick}
                className="block"
              >
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  (item.path === '/admin' ? pathname === '/admin' || pathname === '/admin/' : pathname.startsWith(item.path)) 
                    ? 'bg-[#00458e] text-white shadow-lg shadow-blue-900/10' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}>
                  <div className={`${(item.path === '/admin' ? pathname === '/admin' || pathname === '/admin/' : pathname.startsWith(item.path)) ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'}`}>
                    {item.icon}
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
              </Link>
            )
          ))}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t mt-auto">
         <Link to="/" className="block">
           <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg h-11">
              <LogOut className="h-5 w-5 -rotate-180" />
              <span className="font-medium text-sm">Exit Admin</span>
           </Button>
         </Link>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const location = useLocation();
  const { settings } = useSettings();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  return (
    <div className="flex min-h-screen w-full bg-[#f8fafa] relative">
      {/* Sidebar for Desktop */}
      <aside className="w-64 bg-white border-r hidden lg:flex flex-col sticky top-0 h-screen z-20">
        <SidebarContent pathname={location.pathname} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 bg-transparent items-center justify-end px-10 pt-4">
           <div className="flex items-center gap-6">
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                <div className="w-6 h-6 rounded-full bg-slate-200/50 flex items-center justify-center text-[10px] font-bold text-slate-500">?</div>
              </button>
              <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
                <div className="w-2 h-2 bg-rose-500 rounded-full absolute top-0 right-0 border-2 border-[#f8fafa]"></div>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              </button>
              <div className="flex items-center gap-3 ml-2">
                 <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 leading-none">Katie Pena</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">Admin</p>
                 </div>
                 <div className="w-9 h-9 rounded-full bg-[#1a1a1a] overflow-hidden flex items-center justify-center border-2 border-white shadow-sm">
                    <img src="https://i.pravatar.cc/150?u=katie" alt="User" className="w-full h-full object-cover" />
                 </div>
              </div>
           </div>
        </header>

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
