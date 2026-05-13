import React from 'react';
import { 
  Settings, 
  Globe, 
  FileText, 
  Truck, 
  CreditCard, 
  Layout, 
  Mail, 
  MessageSquare, 
  Users, 
  ShieldCheck, 
  Zap,
  ChevronRight,
  AlertCircle,
  QrCode,
  LayoutDashboard,
  Store
} from 'lucide-react';
import { Link } from 'react-router-dom';

const shopOptions = [
  {
    title: 'Shop Settings',
    description: 'Set up and customize your shop settings for a seamless experience.',
    icon: <Settings className="h-6 w-6" />,
    color: 'bg-purple-50 text-purple-600',
    path: '/admin/settings'
  },
  {
    title: 'Shop Domain',
    description: 'Manage domain setup and general shop settings.',
    icon: <Globe className="h-6 w-6" />,
    color: 'bg-blue-50 text-blue-600',
    path: '/admin/settings/domain'
  },
  {
    title: 'Custom Pages',
    description: 'Define returns, refunds, and customer guidelines.',
    icon: <Layout className="h-6 w-6" />,
    color: 'bg-emerald-50 text-emerald-600',
    path: '/admin/cms'
  },
  {
    title: 'Delivery Support',
    description: 'Set delivery options to ensure smooth fulfillment.',
    icon: <Truck className="h-6 w-6" />,
    color: 'bg-rose-50 text-rose-600',
    path: '/admin/delivery-support'
  },
  {
    title: 'Delivery Zones',
    description: 'Manage additional configurations Delivery Charge & Zones.',
    icon: <Store className="h-6 w-6" />,
    color: 'bg-emerald-50 text-emerald-600',
    path: '/admin/delivery-zones'
  },
  {
    title: 'Payment Gateway',
    description: 'Integrate secure and flexible transaction methods.',
    icon: <CreditCard className="h-6 w-6" />,
    color: 'bg-indigo-50 text-indigo-600',
    path: '/admin/payments'
  },
  {
    title: 'SEO & Social Media',
    description: 'Connect SEO tools and Social media integrations.',
    icon: <Zap className="h-6 w-6" />,
    color: 'bg-orange-50 text-orange-600',
    path: '/admin/settings/seo'
  },
  {
    title: 'Google, Facebook & Tiktok',
    description: 'Setup your google tag manager, analytics and pixel.',
    icon: <Globe className="h-6 w-6" />,
    color: 'bg-rose-50 text-rose-600',
    path: '/admin/settings/pixel'
  },
  {
    title: 'Chat & Plugins',
    description: 'Setup Messenger, WhatsApp, Tawk.to & more chat integrations.',
    icon: <MessageSquare className="h-6 w-6" />,
    color: 'bg-blue-50 text-blue-600',
    path: '/admin/settings/chat'
  },
  {
    title: 'Third Party APIs',
    description: 'You can set Third Party APIs here, Fraud checking, SMS system etc.',
    icon: <Globe className="h-6 w-6" />,
    color: 'bg-teal-50 text-teal-600',
    path: '/admin/settings/api'
  },
  {
    title: 'Block Fake Order',
    description: 'Identify and block suspicious or fake orders.',
    icon: <ShieldCheck className="h-6 w-6" />,
    color: 'bg-orange-50 text-orange-600',
    path: '/admin/fraud-check'
  },
  {
    title: 'Spider Intelligence',
    description: 'Our Spider Intelligence will help you block fake orders easily.',
    icon: <Zap className="h-6 w-6" />,
    color: 'bg-orange-50 text-orange-600',
    path: '/admin/fraud-check'
  },
  {
    title: 'Invoice Template',
    description: 'Choose your preferred invoice design.',
    icon: <FileText className="h-6 w-6" />,
    color: 'bg-emerald-50 text-emerald-600',
    path: '/admin/settings/invoice'
  },
  {
    title: 'Incomplete Orders',
    description: 'Track abandoned carts & recover lost sales.',
    icon: <AlertCircle className="h-6 w-6" />,
    color: 'bg-orange-50 text-orange-600',
    path: '/admin/incomplete-orders'
  },
  {
    title: 'Barcode Print',
    description: 'Generate and print barcode labels for your products.',
    icon: <QrCode className="h-6 w-6" />,
    color: 'bg-orange-50 text-orange-600',
    path: '/admin/products/barcode'
  }
];

const AdminManageShop = () => {
  return (
    <div className="space-y-10 pb-20">
      <div className="text-center space-y-4">
         <div className="flex justify-center">
            <div className="h-16 w-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200">
               <Store className="h-8 w-8" />
            </div>
         </div>
         <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Shop</h1>
            <p className="text-slate-500 text-sm font-medium max-w-xl mx-auto">
               Easily set up and customize all your shop's settings from one place — manage domains, policies, payments, and more.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shopOptions.map((option, i) => (
          <Link 
            key={i} 
            to={option.path}
            className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="flex gap-5 items-start">
              <div className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 shadow-sm ${option.color}`}>
                {option.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{option.title}</h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">{option.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminManageShop;
