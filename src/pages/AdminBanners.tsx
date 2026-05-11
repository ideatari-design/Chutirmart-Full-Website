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
import { convertGoogleDriveLink } from '@/lib/imageUtils';

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
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Banners</h1>
          <p className="text-slate-500 text-sm mt-1">Manage promotional sliders and banners for your homepage</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
           <DialogTrigger nativeButton={true} render={
              <Button className="h-10 bg-[#00458e] hover:bg-blue-800 text-white rounded-lg font-semibold text-xs px-5 flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Banner
              </Button>
           } />
           <DialogContent className="rounded-xl sm:max-w-md border-none shadow-2xl">
              <DialogHeader>
                 <DialogTitle className="text-xl font-bold text-slate-900">Add New Banner</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-4">
                 <div className="space-y-2">
                    <Label className="text-[12px] font-semibold text-slate-700">Banner Title</Label>
                    <Input 
                      placeholder="e.g. Summer Sale 2024" 
                      className="h-11 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" 
                      value={newBanner.title}
                      onChange={e => setNewBanner({...newBanner, title: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[12px] font-semibold text-slate-700">Image URL</Label>
                    <Input 
                      placeholder="Paste link here..." 
                      className="h-11 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" 
                      value={newBanner.image}
                      onChange={e => {
                        const val = e.target.value;
                        const converted = convertGoogleDriveLink(val);
                        setNewBanner({...newBanner, image: converted});
                      }}
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[12px] font-semibold text-slate-700">Redirect Link (Optional)</Label>
                    <Input 
                      placeholder="e.g. /category/electronics" 
                      className="h-11 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" 
                      value={newBanner.link}
                      onChange={e => setNewBanner({...newBanner, link: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[12px] font-semibold text-slate-700">Display Position</Label>
                    <select 
                      className="w-full h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
                      value={newBanner.type}
                      onChange={e => setNewBanner({...newBanner, type: e.target.value})}
                    >
                      <option value="hero">Main Hero Slider</option>
                      <option value="promo">Middle Promo Banner</option>
                      <option value="side">Grid Section Banner</option>
                    </select>
                 </div>
              </div>
              <DialogFooter className="flex gap-3">
                 <Button variant="outline" className="h-11 rounded-lg text-xs font-bold" onClick={() => setIsOpen(false)}>Cancel</Button>
                 <Button className="h-11 rounded-lg bg-[#00458e] text-white text-xs font-bold px-8" onClick={handleAdd}>Save Banner</Button>
              </DialogFooter>
           </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full h-80 flex flex-col items-center justify-center bg-white rounded-xl border border-slate-100 shadow-sm transition-all animate-pulse">
               <Loader2 className="h-10 w-10 animate-spin mb-4 text-[#00458e]/20" />
               <p className="font-bold text-xs tracking-widest text-slate-400">LOADING BANNERS...</p>
            </div>
          ) : banners.length === 0 ? (
            <div className="col-span-full h-80 flex flex-col items-center justify-center bg-white rounded-xl border border-slate-100 shadow-sm">
               <ImageIcon className="h-12 w-12 mb-4 text-slate-200" />
               <p className="font-bold text-xs tracking-widest text-slate-400">NO BANNERS DISCOVERED</p>
               <Button variant="link" className="text-[#00458e] mt-2 font-bold" onClick={() => setIsOpen(true)}>Create your first banner</Button>
            </div>
          ) : (
            banners.map((banner) => (
              <div key={banner.id} className="group bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all h-[360px] flex flex-col">
                <div className="h-44 w-full relative overflow-hidden bg-slate-50">
                   <img 
                     src={banner.image} 
                     alt={banner.title} 
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                     referrerPolicy="no-referrer"
                   />
                   <div className="absolute top-3 right-3 flex gap-2">
                     <Badge className={`rounded-full px-3 py-1 border-none font-bold text-[10px] uppercase shadow-sm ${
                        banner.status === 'active' ? 'bg-[#0db39e] text-white' : 'bg-slate-400 text-white'
                     }`}>
                        {banner.status}
                     </Badge>
                   </div>
                </div>

                <div className="p-5 flex-grow flex flex-col">
                   <div className="flex items-start justify-between mb-2">
                     <h3 className="font-bold text-slate-900 line-clamp-1">{banner.title || 'Untitled Banner'}</h3>
                   </div>
                   
                   <div className="space-y-3 mt-auto">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-50 pb-2">
                        <span className="font-medium uppercase tracking-wider">Position</span>
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{banner.type}</span>
                      </div>
                      
                      <div className="flex items-center justify-between gap-1 mt-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50" onClick={() => openEdit(banner)}>
                             <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(banner.id)}>
                             <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Button 
                          onClick={() => toggleStatus(banner)}
                          className={`h-9 px-4 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${
                            banner.status === 'active' 
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                            : 'bg-[#0db39e] text-white hover:bg-[#0da08d]'
                          }`}
                        >
                           {banner.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                   </div>
                </div>
              </div>
            ))
          )}
          
          <div 
            className="group h-[360px] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
             <div className="w-12 h-12 rounded-full border-2 border-slate-300 flex items-center justify-center mb-4 group-hover:border-[#00458e] transition-colors">
               <Plus className="h-6 w-6 group-hover:text-[#00458e]" />
             </div>
             <p className="font-bold uppercase text-[10px] tracking-widest group-hover:text-[#00458e]">New Banner</p>
          </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
           <DialogContent className="rounded-xl sm:max-w-md border-none shadow-2xl">
              <DialogHeader>
                 <DialogTitle className="text-xl font-bold text-slate-900">Edit Banner</DialogTitle>
              </DialogHeader>
              {editingBanner && (
                 <div className="space-y-5 py-4">
                    <div className="space-y-2">
                       <Label className="text-[12px] font-semibold text-slate-700">Banner Title</Label>
                       <Input 
                         className="h-11 rounded-lg border-slate-200 font-medium" 
                         value={editingBanner.title}
                         onChange={e => setEditingBanner({...editingBanner, title: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[12px] font-semibold text-slate-700">Image URL</Label>
                       <Input 
                         className="h-11 rounded-lg border-slate-200 font-medium" 
                         value={editingBanner.image}
                         onChange={e => {
                           const val = e.target.value;
                           const converted = convertGoogleDriveLink(val);
                           setEditingBanner({...editingBanner, image: converted});
                         }}
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[12px] font-semibold text-slate-700">Link</Label>
                       <Input 
                         className="h-11 rounded-lg border-slate-200 font-medium" 
                         value={editingBanner.link}
                         onChange={e => setEditingBanner({...editingBanner, link: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[12px] font-semibold text-slate-700">Position</Label>
                       <select 
                         className="w-full h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium outline-none"
                         value={editingBanner.type}
                         onChange={e => setEditingBanner({...editingBanner, type: e.target.value})}
                       >
                         <option value="hero">Main Hero Slider</option>
                         <option value="promo">Middle Promo Banner</option>
                         <option value="side">Grid Section Banner</option>
                       </select>
                    </div>
                 </div>
              )}
              <DialogFooter className="flex gap-3">
                 <Button variant="outline" className="h-11 rounded-lg text-xs font-bold" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                 <Button className="h-11 rounded-lg bg-[#00458e] text-white text-xs font-bold px-8" onClick={handleUpdate}>Update Changes</Button>
              </DialogFooter>
           </DialogContent>
        </Dialog>
    </div>
  );
};

export default AdminBanners;
