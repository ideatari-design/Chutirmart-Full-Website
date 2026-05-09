import React, { useState, useEffect } from 'react';
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
  Cloud,
  Image as ImageIcon,
  Upload,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { settingsService } from '@/services/settingsService';

const AdminSettings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  
  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const faviconInputRef = React.useRef<HTMLInputElement>(null);
  
  const [settings, setSettings] = useState({
    shopName: 'OJALA SHOP',
    shopEmail: 'ojalashopbd@gmail.com',
    currency: 'BDT',
    maintenanceMode: false,
    orderNotifications: true,
    logo: '',
    favicon: '',
    social: {
      facebook: 'https://facebook.com/ojala',
      instagram: 'https://instagram.com/ojala',
      whatsapp: '01812345678'
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const data = await settingsService.getSettings();
        if (data) {
          setSettings(prev => ({
            ...prev,
            ...data,
            maintenanceMode: data.maintenanceMode === 'true'
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    
    setIsUploading(type);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      if (result.success) {
        setSettings(prev => ({ ...prev, [type]: result.url }));
        toast.success(`${type === 'logo' ? 'Logo' : 'Favicon'} updated! Save to apply globally.`);
      } else {
        toast.error(result.message || "Upload failed");
      }
    } catch (err) {
      toast.error("Upload failed: Connection error");
    } finally {
      setIsUploading(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleSave = async () => {
    try {
      await settingsService.updateSettings({
        ...settings,
        maintenanceMode: String(settings.maintenanceMode)
      } as any);
      toast.success("Settings updated successfully!");
      // Immediate refresh for logo/favicon across site
      window.dispatchEvent(new CustomEvent('settingsUpdated'));
    } catch (err) {
      toast.error("Failed to update settings");
    }
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
            <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-primary/5 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" /> Multi-media Branding
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Logo Upload Section */}
              <div className="space-y-4">
                <input 
                  type="file" 
                  ref={logoInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'logo')}
                />
                <div className="flex items-center justify-between">
                  <Label className="font-bold text-slate-800 ml-1">Website Logo</Label>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase bg-slate-100 px-2 py-1 rounded-full">
                    <Info className="h-3 w-3" /> 500x150px rec.
                  </div>
                </div>
                
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => logoInputRef.current?.click()}
                >
                  <div className={`h-40 w-full bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 transition-all group-hover:border-primary/50 group-hover:bg-primary/5 overflow-hidden ${isUploading === 'logo' ? 'opacity-50' : ''}`}>
                    {isUploading === 'logo' ? (
                      <div className="flex flex-col items-center animate-pulse">
                        <Upload className="h-8 w-8 text-primary mb-2 animate-bounce" />
                        <p className="text-xs font-bold text-primary">Uploading...</p>
                      </div>
                    ) : settings.logo ? (
                      <img 
                        src={settings.logo} 
                        alt="Preview" 
                        className="max-h-full max-w-full object-contain drop-shadow-sm" 
                        key={`${settings.logo}-${Date.now()}`} // Bypass cache
                      />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-slate-300 mb-2 group-hover:text-primary transition-colors" />
                        <p className="text-xs font-bold text-slate-400 group-hover:text-primary/70 transition-colors">Click to Upload Logo</p>
                      </>
                    )}
                  </div>
                  {settings.logo && !isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                       <p className="text-white text-xs font-bold flex items-center gap-2"><Upload className="h-4 w-4" /> Click to Change</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Input 
                    placeholder="Or paste logo URL here..."
                    value={settings.logo}
                    onChange={e => setSettings({...settings, logo: e.target.value})}
                    className="h-11 rounded-xl text-xs font-medium"
                  />
                  <p className="text-[10px] text-muted-foreground italic px-1">Tip: Use high-quality transparent PNG for best results.</p>
                </div>
              </div>

              {/* Favicon Upload Section */}
              <div className="space-y-4">
                <input 
                  type="file" 
                  ref={faviconInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'favicon')}
                />
                <div className="flex items-center justify-between">
                  <Label className="font-bold text-slate-800 ml-1">Favicon (Tab Icon)</Label>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase bg-slate-100 px-2 py-1 rounded-full">
                    <Info className="h-3 w-3" /> 32x32px rec.
                  </div>
                </div>
                
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => faviconInputRef.current?.click()}
                >
                  <div className={`h-40 w-full bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 transition-all group-hover:border-primary/50 group-hover:bg-primary/5 ${isUploading === 'favicon' ? 'opacity-50' : ''}`}>
                    {isUploading === 'favicon' ? (
                      <div className="flex flex-col items-center animate-pulse">
                        <Upload className="h-8 w-8 text-primary mb-2 animate-bounce" />
                        <p className="text-xs font-bold text-primary">Uploading...</p>
                      </div>
                    ) : settings.favicon ? (
                      <div className="p-4 bg-white rounded-xl shadow-lg">
                        <img 
                          src={settings.favicon} 
                          alt="Favicon" 
                          className="h-10 w-10 object-contain" 
                          key={`${settings.favicon}-${Date.now()}`}
                        />
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-slate-300 mb-2 group-hover:text-primary transition-colors" />
                        <p className="text-xs font-bold text-slate-400 group-hover:text-primary/70 transition-colors">Click to Upload Favicon</p>
                      </>
                    )}
                  </div>
                  {settings.favicon && !isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                       <p className="text-white text-xs font-bold flex items-center gap-2"><Upload className="h-4 w-4" /> Click to Change</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Input 
                    placeholder="Or paste favicon URL here..."
                    value={settings.favicon}
                    onChange={e => setSettings({...settings, favicon: e.target.value})}
                    className="h-11 rounded-xl text-xs font-medium"
                  />
                  <p className="text-[10px] text-muted-foreground italic px-1">Tip: Standard .ico or .png works in most browsers.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-primary/5 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" /> Shop Information
            </h3>
            <div className="space-y-6 max-w-2xl">
              <div className="space-y-2">
                <Label className="font-bold text-slate-800 ml-1">Shop Name</Label>
                <Input 
                  value={settings.shopName}
                  onChange={e => setSettings({...settings, shopName: e.target.value})}
                  className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-bold text-lg uppercase"
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
