import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit, 
  ExternalLink, 
  Layout, 
  Grid,
  Eye,
  CheckCircle2,
  XCircle,
  Move,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { bannerService, Banner } from '@/services/bannerService';

const AdminBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBanner, setNewBanner] = useState({ title: '', image: '', link: '', type: 'hero', status: 'active' as const });
  const [isOpen, setIsOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await bannerService.getAllBanners();
      setBanners(data);
    } catch (err) {
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newBanner.image) return;
    try {
      await bannerService.addBanner(newBanner);
      setNewBanner({ title: '', image: '', link: '', type: 'hero', status: 'active' });
      setIsOpen(false);
      fetchBanners();
      toast.success("Banner added successfully!");
    } catch (err) {
      toast.error("Failed to add banner");
    }
  };

  const handleUpdate = async () => {
    if (!editingBanner || !editingBanner.image) return;
    try {
      const { id, ...updates } = editingBanner;
      await bannerService.updateBanner(id, updates);
      setIsEditOpen(false);
      fetchBanners();
      toast.success("Banner updated successfully!");
    } catch (err) {
      toast.error("Failed to update banner");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this banner?")) return;
    try {
      await bannerService.deleteBanner(id);
      fetchBanners();
      toast.success("Banner removed");
    } catch (err) {
      toast.error("Failed to delete banner");
    }
  };

  const toggleStatus = async (banner: Banner) => {
    try {
      const newStatus = banner.status === 'active' ? 'inactive' : 'active';
      await bannerService.updateBanner(banner.id, { status: newStatus });
      fetchBanners();
      toast.success("Status updated");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const openEdit = (banner: Banner) => {
    setEditingBanner({...banner});
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
             <ImageIcon className="h-8 w-8 text-primary" /> Banners & sliders
           </h2>
           <p className="text-muted-foreground font-medium">Manage promotional images on your store's frontpage</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
           <DialogTrigger nativeButton={true} render={
              <Button className="rounded-xl h-12 px-6 gap-2 bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20">
                <Plus className="h-5 w-5" /> Add New Banner
              </Button>
           } />
           <DialogContent className="rounded-3xl sm:max-w-md">
              <DialogHeader>
                 <DialogTitle className="text-2xl font-black">Add Banner</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                 <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Banner Title</Label>
                    <Input 
                      placeholder="e.g. Summer Sale 2024" 
                      className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
                      value={newBanner.title}
                      onChange={e => setNewBanner({...newBanner, title: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Banner Image URL</Label>
                    <Input 
                      placeholder="https://..." 
                      className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
                      value={newBanner.image}
                      onChange={e => setNewBanner({...newBanner, image: e.target.value})}
                    />
                    <p className="text-[10px] text-muted-foreground ml-1">Must be a full URL (e.g. from Unsplash or Imgur)</p>
                 </div>
                 <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Link URL (Optional)</Label>
                    <Input 
                      placeholder="e.g. /products?q=sale" 
                      className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
                      value={newBanner.link}
                      onChange={e => setNewBanner({...newBanner, link: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Type</Label>
                    <select 
                      className="w-full h-12 rounded-xl border bg-background px-3 text-sm font-medium focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                      value={newBanner.type}
                      onChange={e => setNewBanner({...newBanner, type: e.target.value})}
                    >
                      <option value="hero">Main Hero Slider</option>
                      <option value="promo">Full Width Promotion Banner</option>
                      <option value="side">Sidebar Promo (Grid)</option>
                    </select>
                 </div>
              </div>
              <DialogFooter>
                 <Button className="w-full h-12 rounded-xl font-bold uppercase text-xs tracking-widest bg-primary" onClick={handleAdd}>Upload Banner</Button>
              </DialogFooter>
           </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full h-64 flex flex-col items-center justify-center text-muted-foreground bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
               <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary/40" />
               <p className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Loading Banners...</p>
            </div>
          ) : banners.length === 0 ? (
            <div className="col-span-full h-64 flex flex-col items-center justify-center text-muted-foreground bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
               <ImageIcon className="h-10 w-10 mb-4 text-slate-300" />
               <p className="font-bold uppercase text-[10px] tracking-widest text-slate-400">No banners found</p>
            </div>
          ) : (
            banners.map((banner) => (
              <div key={banner.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-primary/5 p-4 flex flex-col md:flex-row gap-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
              <div className="md:w-48 h-32 rounded-2xl overflow-hidden shadow-inner border border-slate-100 flex-shrink-0 relative">
                 <img src={banner.image} alt={banner.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                 <div className="absolute inset-0 bg-black/10 transition-opacity opacity-0 group-hover:opacity-100 flex items-center justify-center">
                    <Eye className="text-white h-8 w-8" />
                 </div>
              </div>
              <div className="flex-grow flex flex-col justify-between py-1">
                 <div>
                    <div className="flex items-center justify-between gap-4">
                       <h3 className="font-black text-slate-800 truncate">{banner.title}</h3>
                       <Badge variant="outline" className={`rounded-full px-3 py-0.5 border-none font-black text-[9px] uppercase tracking-tighter ${
                         banner.type === 'hero' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                       }`}>
                          {banner.type}
                       </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium mt-1 truncate max-w-[200px]">Link: {banner.link || 'Internal'}</p>
                 </div>
                 
                 <div className="flex items-center justify-between mt-4">
                    <button 
                      onClick={() => toggleStatus(banner)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all ${
                        banner.status === 'active' 
                        ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                       {banner.status === 'active' ? <CheckCircle2 className="h-2.5 w-2.5" /> : <XCircle className="h-2.5 w-2.5" />}
                       {banner.status}
                    </button>
                    
                    <div className="flex items-center gap-1">
                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-primary hover:bg-primary/5 transition-colors" onClick={() => openEdit(banner)}>
                          <Edit className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-destructive hover:bg-destructive/5 transition-colors" onClick={() => handleDelete(banner.id)}>
                          <Trash2 className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg cursor-grab active:cursor-grabbing">
                          <Move className="h-4 w-4" />
                       </Button>
                    </div>
                 </div>
              </div>
           </div>
          ))
         )}
         
         <div 
           className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer group"
           onClick={() => setIsOpen(true)}
         >
            <Plus className="h-10 w-10 mb-2 group-hover:scale-125 transition-transform" />
            <p className="font-bold uppercase text-[10px] tracking-widest">Quick Add Banner</p>
         </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
           <DialogContent className="rounded-3xl sm:max-w-md">
              <DialogHeader>
                 <DialogTitle className="text-2xl font-black">Edit Banner</DialogTitle>
              </DialogHeader>
              {editingBanner && (
                 <div className="space-y-4 py-4">
                    <div className="space-y-2">
                       <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Banner Title</Label>
                       <Input 
                         placeholder="e.g. Summer Sale 2024" 
                         className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
                         value={editingBanner.title}
                         onChange={e => setEditingBanner({...editingBanner, title: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Banner Image URL</Label>
                       <Input 
                         placeholder="https://..." 
                         className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
                         value={editingBanner.image}
                         onChange={e => setEditingBanner({...editingBanner, image: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Link URL</Label>
                       <Input 
                         placeholder="e.g. /products?q=sale" 
                         className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
                         value={editingBanner.link}
                         onChange={e => setEditingBanner({...editingBanner, link: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Type</Label>
                       <select 
                         className="w-full h-12 rounded-xl border bg-background px-3 text-sm font-medium focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                         value={editingBanner.type}
                         onChange={e => setEditingBanner({...editingBanner, type: e.target.value})}
                       >
                         <option value="hero">Main Hero Slider</option>
                         <option value="promo">Full Width Promotion Banner</option>
                         <option value="side">Sidebar Promo (Grid)</option>
                       </select>
                    </div>
                 </div>
              )}
              <DialogFooter>
                 <Button className="w-full h-12 rounded-xl font-bold uppercase text-xs tracking-widest bg-primary" onClick={handleUpdate}>Update Banner</Button>
              </DialogFooter>
           </DialogContent>
        </Dialog>
    </div>
  );
};

export default AdminBanners;
