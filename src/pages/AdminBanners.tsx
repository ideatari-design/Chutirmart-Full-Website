import React, { useState } from 'react';
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
  Move
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

const AdminBanners = () => {
  const [banners, setBanners] = useState([
    { id: '1', title: 'Summer Collection 2024', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1200', link: '/products?category=Fashion', type: 'hero', status: 'active' },
    { id: '2', title: 'Eid Mubarak Sale', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200', link: '/offers', type: 'hero', status: 'inactive' },
    { id: '3', title: 'Gadgets promo', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1200', link: '/products?category=Gadgets', type: 'promo', status: 'active' },
  ]);

  const [newBanner, setNewBanner] = useState({ title: '', image: '', link: '', type: 'hero', status: 'active' });
  const [isOpen, setIsOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleAdd = () => {
    if (!newBanner.image) return;
    setBanners([...banners, { ...newBanner, id: Math.random().toString(36).substr(2, 9) }]);
    setNewBanner({ title: '', image: '', link: '', type: 'hero', status: 'active' });
    setIsOpen(false);
    toast.success("Banner added successfully!");
  };

  const handleUpdate = () => {
    if (!editingBanner || !editingBanner.image) return;
    setBanners(banners.map(b => b.id === editingBanner.id ? editingBanner : b));
    setIsEditOpen(false);
    toast.success("Banner updated successfully!");
  };

  const handleDelete = (id: string) => {
    setBanners(banners.filter(b => b.id !== id));
    toast.success("Banner removed");
  };

  const toggleStatus = (id: string) => {
    setBanners(banners.map(b => 
      b.id === id ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b
    ));
    toast.success("Status updated");
  };

  const openEdit = (banner: any) => {
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
         {banners.map((banner) => (
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
                      onClick={() => toggleStatus(banner.id)}
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
         ))}
         
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
