import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Globe, 
  Mail, 
  Lock, 
  Bell, 
  Smartphone,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ShieldCheck,
  CreditCard,
  Cloud
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const AdminSettings = () => {
  const [activeSection, setActiveSection] = useState('general');
  
  const [settings, setSettings] = useState({
    shopName: 'OJALA SHOP',
    shopEmail: 'ojalashopbd@gmail.com',
    currency: 'BDT',
    maintenanceMode: false,
    orderNotifications: true,
    social: {
      facebook: 'https://facebook.com/ojala',
      instagram: 'https://instagram.com/ojala',
      whatsapp: '01812345678'
    }
  });

  const handleSave = () => {
    toast.success("Settings updated successfully!");
  };

  const menuItems = [
    { id: 'general', label: 'General Info', icon: <Globe className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'payments', label: 'Payment Methods', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'social', label: 'Social Media', icon: <Facebook className="h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <ShieldCheck className="h-4 w-4" /> },
    { id: 'advanced', label: 'Advanced', icon: <Cloud className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-primary/5 pb-6">
        <div>
           <h2 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
             <Settings className="h-8 w-8 text-primary animate-spin-slow" /> Settings
           </h2>
           <p className="text-muted-foreground font-medium">Global configuration for your ecommerce ecosystem</p>
        </div>
        
        <div className="flex gap-2">
           <Button className="rounded-xl h-12 px-8 gap-2 bg-primary hover:bg-primary/90 font-black shadow-lg shadow-primary/20 text-xs uppercase tracking-widest" onClick={handleSave}>
             <Save className="h-5 w-5" /> Save Configuration
           </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:w-64 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                activeSection === item.id 
                ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-primary/5'
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-grow">
          {activeSection === 'general' && (
            <div className="bg-white rounded-3xl p-8 border border-primary/5 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
               <div className="space-y-6 max-w-2xl">
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-800 ml-1">Shop Name</Label>
                    <Input 
                      value={settings.shopName}
                      onChange={e => setSettings({...settings, shopName: e.target.value})}
                      className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-bold text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-800 ml-1">Admin Email</Label>
                    <Input 
                      value={settings.shopEmail}
                      onChange={e => setSettings({...settings, shopEmail: e.target.value})}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-800 ml-1">Currency</Label>
                      <select className="w-full h-12 rounded-xl border bg-background px-3 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none">
                        <option value="BDT">BDT (৳)</option>
                        <option value="USD">USD ($)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-800 ml-1">Language</Label>
                      <select className="w-full h-12 rounded-xl border bg-background px-3 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none">
                        <option value="EN">English</option>
                        <option value="BN">Bengali</option>
                      </select>
                    </div>
                  </div>
               </div>

               <div className="pt-8 border-t border-slate-100">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                     <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">Maintenance Mode</p>
                        <p className="text-xs text-muted-foreground">Make the store temporarily inaccessible to customers</p>
                     </div>
                     <Switch 
                       checked={settings.maintenanceMode}
                       onCheckedChange={val => setSettings({...settings, maintenanceMode: val})}
                     />
                  </div>
               </div>
            </div>
          )}

          {activeSection === 'social' && (
            <div className="bg-white rounded-3xl p-8 border border-primary/5 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
               <h3 className="text-xl font-black text-slate-900 mb-6">Social Media Connections</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-800 ml-1 flex items-center gap-2">
                      <Facebook className="h-4 w-4 text-blue-600" /> Facebook Page
                    </Label>
                    <Input className="h-12 rounded-xl" value={settings.social.facebook} placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-800 ml-1 flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-pink-600" /> Instagram Handle
                    </Label>
                    <Input className="h-12 rounded-xl" value={settings.social.instagram} placeholder="@username" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-800 ml-1 flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-green-600" /> WhatsApp
                    </Label>
                    <Input className="h-12 rounded-xl" value={settings.social.whatsapp} placeholder="01XXX-XXXXXX" />
                  </div>
               </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="bg-white rounded-3xl p-8 border border-primary/5 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold">Email Notifications for New Orders</p>
                  <Switch defaultChecked />
               </div>
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold">Customer Welcome Emails</p>
                  <Switch defaultChecked />
               </div>
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold">Low Stock Alerts</p>
                  <Switch />
               </div>
            </div>
          )}

          {['payments', 'security', 'advanced'].includes(activeSection) && (
            <div className="bg-white rounded-3xl p-20 border border-primary/5 shadow-sm text-center">
               <Settings className="h-16 w-16 text-slate-100 mx-auto mb-4" />
               <p className="text-slate-400 font-bold italic tracking-wide">Configuration panel for {activeSection} coming soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
