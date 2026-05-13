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
  ShieldCheck,
  LayoutDashboard,
  Menu,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Bell,
  HelpCircle,
  User,
  Layout,
  ListRestart,
  MessageSquare,
  PlusCircle,
  Layers,
  History,
  MousePointer2,
  Globe,
  Wallet3,
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminProducts from '@/pages/AdminProducts';
import AdminOrders from '@/pages/AdminOrders';
import AdminIncompleteOrders from '@/pages/AdminIncompleteOrders';
import AdminCategories from '@/pages/AdminCategories';
import AdminSorting from '@/pages/AdminSorting';
import AdminBrands from '@/pages/AdminBrands';
import AdminUnits from '@/pages/AdminUnits';
import AdminAddProduct from '@/pages/AdminAddProduct';
import AdminDraftProducts from '@/pages/AdminDraftProducts';
import AdminRecoveryAnalytics from '@/pages/AdminRecoveryAnalytics';
import AdminStockAdjustment from '@/pages/AdminStockAdjustment';
import AdminPayments from '@/pages/AdminPayments';
import AdminCustomers from '@/pages/AdminCustomers';
import AdminChat from '@/pages/AdminChat';
import AdminDeliveryZones from '@/pages/AdminDeliveryZones';
import AdminCMS from '@/pages/AdminCMS';
import AdminPromotions from '@/pages/AdminPromotions';
import AdminBanners from '@/pages/AdminBanners';
import AdminSettings from '@/pages/AdminSettings';
import AdminCoupons from '@/pages/AdminCoupons';
import AdminManageShop from '@/pages/AdminManageShop';
import AdminLandingPages from '@/pages/AdminLandingPages';
import { useSettings } from '@/context/SettingsContext';
import { convertGoogleDriveLink } from '@/lib/imageUtils';

const menuItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/admin' },
  { 
    label: 'Attributes', 
    icon: <Tags className="h-5 w-5" />, 
    path: '/admin/attributes',
    children: [
      { label: 'Categories', path: '/admin/attributes/categories', icon: <Layers className="h-3.5 w-3.5" /> },
      { label: 'Sorting', path: '/admin/attributes/sorting', icon: <ListRestart className="h-3.5 w-3.5" /> },
      { label: 'Brands', path: '/admin/attributes/brands', icon: <Globe className="h-3.5 w-3.5" /> },
      { label: 'Units', path: '/admin/attributes/units', icon: <Maximize2 className="h-3.5 w-3.5" /> },
    ]
  },
  { 
    label: 'Products', 
    icon: <Package className="h-5 w-5" />, 
    path: '/admin/products',
    children: [
      { label: 'Add Product', path: '/admin/products/add', icon: <PlusCircle className="h-3.5 w-3.5" /> },
      { label: 'Manage Product', path: '/admin/products', icon: <Store className="h-3.5 w-3.5" /> },
      { label: 'Draft Product', path: '/admin/products/draft', icon: <FileText className="h-3.5 w-3.5" /> },
      { label: 'Adjustment Stock', path: '/admin/products/adjustment', icon: <History className="h-3.5 w-3.5" /> },
    ]
  },
  { label: 'Landing Page', icon: <Layout className="h-5 w-5" />, path: '/admin/landing-pages' },
  { label: 'Live Chat', icon: <MessageSquare className="h-5 w-5" />, path: '/admin/chat' },
  { label: 'Customers', icon: <Users className="h-5 w-5" />, path: '/admin/customers' },
  { 
    label: 'Orders', 
    icon: <ShoppingCart className="h-5 w-5" />, 
    path: '/admin/orders',
    children: [
      { label: 'Manage Orders', path: '/admin/orders', icon: <ShoppingCart className="h-3.5 w-3.5" /> },
      { label: 'Incomplete Orders', path: '/admin/incomplete-orders', icon: <AlertCircle className="h-3.5 w-3.5" /> },
      { label: 'Recovery Analytics', path: '/admin/orders/recovery-stats', icon: <BarChart3 className="h-3.5 w-3.5" /> },
    ]
  },
  { label: 'Manage Shop', icon: <Store className="h-5 w-5" />, path: '/admin/manage-shop' },
  { label: 'Payments', icon: <CreditCard className="h-5 w-5" />, path: '/admin/payments' },
  { label: 'Delivery Zones', icon: <Truck className="h-5 w-5" />, path: '/admin/delivery-zones' },
  { label: 'Coupon Code', icon: <Ticket className="h-5 w-5" />, path: '/admin/coupons' },
  { label: 'Promotions', icon: <MousePointer2 className="h-5 w-5" />, path: '/admin/promotions' },
  { label: 'Fraud Check', icon: <AlertCircle className="h-5 w-5" />, path: '/admin/fraud-check' },
];

const SidebarItem = ({ 
  item, 
  pathname, 
  onLinkClick, 
  isActive, 
  onToggle,
  isOpen
}: { 
  item: any, 
  pathname: string, 
  onLinkClick?: () => void,
  isActive: boolean,
  onToggle: () => void,
  isOpen: boolean
}) => {
  if (item.isHeader) {
    return (
      <p className="text-[11px] font-medium text-slate-500 px-3 pt-6 pb-2 uppercase tracking-wider">
        {item.label}
      </p>
    );
  }

  const handleLinkClick = () => {
    if (onLinkClick) onLinkClick();
  };

  return (
    <div className="space-y-1">
      {item.children ? (
        <button
          onClick={onToggle}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 group ${
            isActive 
              ? 'bg-[#00458e] text-white shadow-[0_10px_20px_-10px_rgba(0,69,142,0.4)]' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`}>
              {item.icon}
            </div>
            <span className="font-bold text-[13px] tracking-tight">{item.label}</span>
          </div>
          <ChevronRight className={`h-3.5 w-3.5 opacity-50 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
        </button>
      ) : (
        <Link 
          to={item.path} 
          onClick={handleLinkClick}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
            isActive 
              ? 'bg-[#00458e] text-white shadow-[0_10px_20px_-10px_rgba(0,69,142,0.4)]' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`}>
            {item.icon}
          </div>
          <span className="font-bold text-[13px] tracking-tight">{item.label}</span>
        </Link>
      )}

      {item.children && isOpen && (
        <div className="pl-1 space-y-1 mt-1 animate-in fade-in slide-in-from-left-2 duration-300">
          {item.children.map((child: any, idx: number) => {
            const isChildActive = pathname === child.path;
            return (
              <Link
                key={idx}
                to={child.path}
                onClick={onLinkClick}
                className={`flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg transition-all duration-200 ${
                  isChildActive 
                    ? 'text-white font-black bg-[#00458e] shadow-sm' 
                    : 'text-slate-500 font-bold hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className={`transition-colors duration-300 ${isChildActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>
                  {child.icon}
                </div>
                <span>{child.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

const SidebarContent = ({ pathname, onLinkClick }: { pathname: string, onLinkClick?: () => void }) => {
  const { settings } = useSettings();
  
  // Find which menu item is active by default based on URL
  const activeMenuLabel = React.useMemo(() => {
    // Exact match or prefix match for parent items
    const activeItem = menuItems.find(item => {
      if (item.path === '/admin') return pathname === '/admin' || pathname === '/admin/';
      if (pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path + '/'))) return true;
      if (item.children) {
        return item.children.some((child: any) => pathname === child.path || pathname.startsWith(child.path + '/'));
      }
      return false;
    });
    return activeItem?.label || null;
  }, [pathname]);

  const [openMenu, setOpenMenu] = React.useState<string | null>(activeMenuLabel);

  // Sync open menu when pathname changes (for external navigation)
  React.useEffect(() => {
    if (activeMenuLabel) {
      setOpenMenu(activeMenuLabel);
    }
  }, [activeMenuLabel]);

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

      <ScrollArea className="flex-grow px-3">
        <nav className="space-y-1 pb-10">
          {menuItems.map((item, i) => (
            <SidebarItem 
              key={i} 
              item={item} 
              pathname={pathname} 
              onLinkClick={onLinkClick} 
              isOpen={openMenu === item.label}
              isActive={activeMenuLabel === item.label}
              onToggle={() => setOpenMenu(openMenu === item.label ? null : item.label)}
            />
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
      <aside className="w-72 bg-white border-r hidden lg:flex flex-col sticky top-0 h-screen z-20 shadow-[8px_0_40px_rgb(0,0,0,0.015)]">
        <SidebarContent pathname={location.pathname} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-20 bg-transparent items-center justify-between px-8 pt-4">
           {/* Breadcrumbs can go here but existing design has it better in pages */}
           <div></div>
            <div className="flex items-center gap-6">
              <button className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all shadow-sm">
                <HelpCircle className="h-5 w-5" />
              </button>
              <button className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all shadow-sm relative">
                <div className="w-2 h-2 bg-rose-500 rounded-full absolute top-2 right-2 border-2 border-white shadow-sm animate-pulse"></div>
                <Bell className="h-5 w-5" />
              </button>
              
              <Dialog>
                <DialogTrigger nativeButton={false} render={
                  <div className="flex items-center gap-3 ml-2 group cursor-pointer p-1 pr-3 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100">
                     <div className="w-9 h-9 rounded bg-[#00458e] overflow-hidden flex items-center justify-center border-2 border-white shadow-sm transform group-hover:rotate-3 transition-transform">
                        <img src="https://i.pravatar.cc/150?u=admin" alt="User" className="w-full h-full object-cover" />
                     </div>
                     <div className="text-left">
                        <p className="text-sm font-black text-slate-900 leading-none">Super Admin</p>
                        <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">Manage Account</p>
                     </div>
                     <ChevronDown className="h-4 w-4 text-slate-300 group-hover:text-slate-950 transition-colors" />
                  </div>
                } />
                <DialogContent className="sm:max-w-[300px] rounded-xl p-6 top-[15%] lg:right-[8%] lg:left-auto lg:translate-x-0 border-none shadow-2xl">
                   <div className="space-y-4">
                      <div className="flex flex-col items-center py-4 border-b border-slate-50">
                        <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center mb-3">
                           <Users className="h-8 w-8 text-slate-400" />
                        </div>
                        <p className="font-black text-slate-900">Admin Panel</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Super Admin Role</p>
                      </div>
                      <div className="space-y-1">
                        <Link to="/admin/settings">
                           <Button variant="ghost" className="w-full justify-start gap-3 rounded-lg h-11 text-slate-600 hover:text-[#00458e] hover:bg-blue-50 font-bold text-xs uppercase tracking-tight">
                              <Settings className="h-4 w-4" /> Account Settings
                           </Button>
                        </Link>
                        <Button variant="ghost" className="w-full justify-start gap-3 rounded-lg h-11 text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-bold text-xs uppercase tracking-tight" onClick={() => window.location.href = '/'}>
                           <LogOut className="h-4 w-4" /> Logout
                        </Button>
                      </div>
                   </div>
                </DialogContent>
              </Dialog>
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
        <div className="flex-grow p-4 md:p-6 overflow-x-hidden">
           <div className="max-w-[1600px] mx-auto pb-10">
              <Routes>
                <Route index element={<AdminDashboard />} />
                
                {/* Attributes */}
                <Route path="attributes/categories" element={<AdminCategories />} />
                <Route path="attributes/sorting" element={<AdminSorting />} />
                <Route path="attributes/brands" element={<AdminBrands />} />
                <Route path="attributes/units" element={<AdminUnits />} />
                
                {/* Products */}
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/add" element={<AdminAddProduct />} />
                <Route path="products/draft" element={<AdminDraftProducts />} />
                <Route path="products/adjustment" element={<AdminStockAdjustment />} />
                
                {/* Management */}
                <Route path="orders" element={<AdminOrders />} />
                <Route path="orders/recovery-stats" element={<AdminRecoveryAnalytics />} />
                <Route path="incomplete-orders" element={<AdminIncompleteOrders />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="chat" element={<AdminChat />} />
                <Route path="manage-shop" element={<AdminManageShop />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="delivery-zones" element={<AdminDeliveryZones />} />
                <Route path="landing-pages" element={<AdminLandingPages />} />
                
                {/* CMS & Settings */}
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="promotions" element={<AdminPromotions />} />
                <Route path="cms" element={<AdminCMS />} />
                <Route path="banners" element={<AdminBanners />} />
                <Route path="settings" element={<AdminSettings />} />
                
                <Route path="fraud-check" element={<div className="p-20 text-center"><AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-10" /> <span className="font-bold opacity-30">Fraud Check System Coming Soon</span></div>} />
                
                <Route path="*" element={<div className="p-20 text-center text-muted-foreground italic bg-white rounded-2xl border shadow-sm">Page not found or feature coming soon...</div>} />
              </Routes>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
