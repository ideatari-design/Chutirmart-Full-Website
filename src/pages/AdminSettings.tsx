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
  Info,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { settingsService } from '@/services/settingsService';
import { convertGoogleDriveLink } from '@/lib/imageUtils';

const AdminSettings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [isStaticHost, setIsStaticHost] = useState(false);
  
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
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogImage: '',
    social: {
      facebook: 'https://facebook.com/ojala',
      instagram: 'https://instagram.com/ojala',
      whatsapp: '01812345678'
    }
  });

  useEffect(() => {
    if (window.location.hostname.includes('pages.dev') || window.location.hostname.includes('github.io')) {
      setIsStaticHost(true);
    }

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
        toast.error(result.message || `Upload failed: ${response.statusText}`);
        if (response.status === 400 && isStaticHost) {
          toast.error("Note: This host does not support file uploads.");
        }
      }
    } catch (err: any) {
      toast.error(`Upload failed: ${err.message || "Connection error"}`);
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
    { id: 'seo', label: 'SEO Settings', icon: <Search className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'payments', label: 'Payment Methods', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'social', label: 'Social Media', icon: <Facebook className="h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <ShieldCheck className="h-4 w-4" /> },
    { id: 'advanced', label: 'Advanced', icon: <Cloud className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your store's configuration and preferences</p>
        </div>
        <Button 
          className="h-10 bg-[#00458e] hover:bg-blue-800 text-white rounded-lg font-semibold text-xs px-6 flex items-center gap-2" 
          onClick={handleSave}
        >
          <Save className="h-4 w-4" /> Save Settings
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:w-64 flex flex-col gap-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all text-sm ${
                activeSection === item.id 
                ? 'bg-[#00458e] text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-grow space-y-6">
          {isStaticHost && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-amber-900 text-sm">Static Hosting Environment Detected</h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Local file uploads are not supported on static platforms. 
                  Use <a href="https://drive.google.com" target="_blank" rel="noreferrer" className="underline font-bold">Google Drive</a> links for images.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'general' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Branding Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-[15px] font-bold text-slate-900 flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                  <ImageIcon className="h-4 w-4 text-[#00458e]" /> Store Branding
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Logo */}
                  <div className="space-y-4">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Store Logo</Label>
                    <div 
                      className="group relative h-40 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex items-center justify-center p-6 cursor-pointer hover:border-[#00458e] hover:bg-blue-50 transition-all overflow-hidden"
                      onClick={() => logoInputRef.current?.click()}
                    >
                      {settings.logo ? (
                        <img 
                          src={settings.logo} 
                          alt="Logo Preview" 
                          className="max-h-full max-w-full object-contain drop-shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-6 w-6 text-slate-400 group-hover:text-[#00458e]" />
                          <span className="text-xs font-medium text-slate-400 group-hover:text-[#00458e]">Click to upload logo</span>
                        </div>
                      )}
                      
                      {settings.logo && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-bold flex items-center gap-2">
                            <Upload className="h-4 w-4" /> Change Logo
                          </span>
                        </div>
                      )}
                      
                      <input 
                        type="file" 
                        ref={logoInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'logo')}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Paste image URL here..."
                        value={settings.logo}
                        onChange={e => setSettings({...settings, logo: convertGoogleDriveLink(e.target.value)})}
                        className="h-10 text-xs rounded-lg border-slate-200"
                      />
                    </div>
                  </div>

                  {/* Favicon */}
                  <div className="space-y-4">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Favicon (Tab Icon)</Label>
                    <div 
                      className="group relative h-40 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex items-center justify-center p-6 cursor-pointer hover:border-[#00458e] hover:bg-blue-50 transition-all overflow-hidden"
                      onClick={() => faviconInputRef.current?.click()}
                    >
                      {settings.favicon ? (
                        <div className="p-3 bg-white rounded shadow-sm">
                          <img src={settings.favicon} alt="Favicon" className="h-8 w-8 object-contain" referrerPolicy="no-referrer" />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-6 w-6 text-slate-400 group-hover:text-[#00458e]" />
                          <span className="text-xs font-medium text-slate-400 group-hover:text-[#00458e]">Click to upload icon</span>
                        </div>
                      )}

                      <input 
                        type="file" 
                        ref={faviconInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'favicon')}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Paste image URL here..."
                        value={settings.favicon}
                        onChange={e => setSettings({...settings, favicon: convertGoogleDriveLink(e.target.value)})}
                        className="h-10 text-xs rounded-lg border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Info Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-[15px] font-bold text-slate-900 flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                  <Globe className="h-4 w-4 text-[#00458e]" /> General Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-700">Shop Name</Label>
                    <Input 
                      value={settings.shopName}
                      onChange={e => setSettings({...settings, shopName: e.target.value})}
                      className="h-11 rounded-lg border-slate-200 font-semibold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-700">Support Email</Label>
                    <Input 
                      value={settings.shopEmail}
                      onChange={e => setSettings({...settings, shopEmail: e.target.value})}
                      className="h-11 rounded-lg border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-700">Currency</Label>
                    <select className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium">
                      <option value="BDT">BDT (৳)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-700">Maintenance Mode</Label>
                    <div className="flex items-center justify-between p-2.5 px-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="text-xs font-medium text-slate-600">Disable store for visitors</span>
                      <Switch 
                        checked={settings.maintenanceMode}
                        onCheckedChange={val => setSettings({...settings, maintenanceMode: val})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'seo' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-[15px] font-bold text-slate-900 flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                  <Search className="h-4 w-4 text-[#00458e]" /> Search Engine Optimization
                </h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs font-semibold text-slate-700">Site Title</Label>
                      <span className="text-[10px] font-bold text-slate-400">{settings.metaTitle.length}/60</span>
                    </div>
                    <Input 
                      value={settings.metaTitle}
                      onChange={e => setSettings({...settings, metaTitle: e.target.value})}
                      placeholder="Best Online Shop in Bangladesh..."
                      className="h-11 rounded-lg border-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs font-semibold text-slate-700">Meta Description</Label>
                      <span className="text-[10px] font-bold text-slate-400">{settings.metaDescription.length}/160</span>
                    </div>
                    <textarea 
                      value={settings.metaDescription}
                      onChange={e => setSettings({...settings, metaDescription: e.target.value})}
                      className="w-full h-32 rounded-lg border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Enter a brief summary of your shop..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-700">Meta Keywords</Label>
                    <Input 
                      value={settings.metaKeywords}
                      onChange={e => setSettings({...settings, metaKeywords: e.target.value})}
                      placeholder="online shop, gadgets, bangladesh"
                      className="h-11 rounded-lg border-slate-200"
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <Label className="text-xs font-semibold text-slate-700">Social Share Image (OG Image)</Label>
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="flex-grow w-full">
                        <Input 
                           value={settings.ogImage}
                           onChange={e => setSettings({...settings, ogImage: convertGoogleDriveLink(e.target.value)})}
                           placeholder="OG Image URL..."
                           className="h-11 rounded-lg border-slate-200 mb-2"
                        />
                        <p className="text-[10px] text-slate-400">Recommended size: 1200x630 pixels.</p>
                      </div>
                      <div className="w-full md:w-60 h-32 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden">
                        {settings.ogImage ? (
                          <img src={settings.ogImage} alt="OG Preview" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">No Preview</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Preview */}
              <div className="bg-[#f8f9fa] border border-slate-200 rounded-xl p-6 shadow-sm">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Google Search Preview</h4>
                <div className="bg-white p-4 rounded-lg border border-slate-100 max-w-2xl">
                  <div className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer truncate font-medium">
                    {settings.metaTitle || 'My Online Shop | Welcome'}
                  </div>
                  <div className="text-[14px] text-[#006621] mt-1">
                    {window.location.host} <span className="text-[10px] text-slate-400 ml-1">▼</span>
                  </div>
                  <div className="text-[14px] text-slate-600 mt-1 line-clamp-2 leading-snug">
                    {settings.metaDescription || 'Add a meta description to see how it will appear in search engine results...'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'social' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h3 className="text-[15px] font-bold text-slate-900 flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                 <Facebook className="h-4 w-4 text-[#00458e]" /> Social Media Pages
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <Label className="text-xs font-semibold text-slate-700">Facebook URL</Label>
                   <Input 
                     value={settings.social.facebook}
                     className="h-11 rounded-lg border-slate-200" 
                     placeholder="https://facebook.com/..." 
                   />
                 </div>
                 <div className="space-y-2">
                   <Label className="text-xs font-semibold text-slate-700">Instagram Handle</Label>
                   <Input 
                     value={settings.social.instagram}
                     className="h-11 rounded-lg border-slate-200" 
                     placeholder="@username" 
                   />
                 </div>
                 <div className="space-y-2">
                   <Label className="text-xs font-semibold text-slate-700">WhatsApp Number</Label>
                   <Input 
                     value={settings.social.whatsapp}
                     className="h-11 rounded-lg border-slate-200" 
                     placeholder="017xxxxxxxx" 
                   />
                 </div>
               </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
               <h3 className="text-[15px] font-bold text-slate-900 flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                 <Bell className="h-4 w-4 text-[#00458e]" /> Notification Settings
               </h3>
               {[
                 { label: 'Order Confirmation Emails', desc: 'Send email to customer after order' },
                 { label: 'New Order Alerts', desc: 'Notify admin when a new order is placed' },
                 { label: 'Stock Alerts', desc: 'Alert when product stock is below threshold' },
                 { label: 'Marketing Emails', desc: 'Enable newsletters and promo emails' }
               ].map((notif, idx) => (
                 <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-lg">
                   <div>
                     <p className="text-sm font-bold text-slate-900">{notif.label}</p>
                     <p className="text-xs text-slate-500">{notif.desc}</p>
                   </div>
                   <Switch defaultChecked={idx < 2} />
                 </div>
               ))}
            </div>
          )}

          {['payments', 'security', 'advanced'].includes(activeSection) && (
            <div className="bg-white rounded-xl border border-slate-200 p-20 shadow-sm text-center animate-in fade-in duration-500">
               <Settings className="h-12 w-12 text-slate-200 mx-auto mb-4" />
               <p className="text-slate-400 text-sm font-semibold tracking-tight">Configuration module for {activeSection} is under development.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
