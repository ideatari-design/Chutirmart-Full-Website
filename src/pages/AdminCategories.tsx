import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  RefreshCcw,
  PlusCircle,
  AlertTriangle,
  LayoutGrid,
  FileText,
  ChevronDown,
  Filter
} from 'lucide-react';
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
import { convertGoogleDriveLink } from '@/lib/imageUtils';

const AdminCategories = () => {
  const [categories, setCategories] = useState([
    { id: '1', name: 'Smartphones', slug: 'smartphones', productCount: 124, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=300', status: 'active' },
    { id: '2', name: 'Home & Decor', slug: 'home-decor', productCount: 89, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e3a38?auto=format&fit=crop&q=80&w=300', status: 'active' },
    { id: '3', name: 'Makeup', slug: 'makeup', productCount: 56, image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=300', status: 'active' },
    { id: '4', name: 'Autoparts', slug: 'autoparts', productCount: 42, image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=300', status: 'active' },
  ]);

  const [newCat, setNewCat] = useState({ name: '', slug: '', image: '' });
  const [isOpen, setIsOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!newCat.name) return;
    const added = {
      id: String(Date.now()),
      ...newCat,
      slug: newCat.slug || newCat.name.toLowerCase().replace(/\s+/g, '-'),
      productCount: 0,
      image: newCat.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300',
      status: 'active'
    };
    setCategories([...categories, added]);
    setNewCat({ name: '', slug: '', image: '' });
    setIsOpen(false);
    toast.success("Category added successfully!");
  };

  const handleUpdate = () => {
    if (!editingCat || !editingCat.name) return;
    setCategories(categories.map(c => c.id === editingCat.id ? editingCat : c));
    setIsEditOpen(false);
    toast.success("Category updated successfully!");
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    toast.success("Category deleted");
  };

  const openEdit = (cat: any) => {
    setEditingCat({...cat});
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
           <div className="flex flex-col space-y-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Categories</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Group your products into organized collections for easier browsing and management.</p>
           </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger nativeButton={true} render={
              <Button className="h-11 bg-[#00458e] hover:bg-blue-800 text-white rounded-lg font-black text-[11px] uppercase px-6 gap-2 shadow-lg shadow-blue-100 transition-all hover:scale-105 active:scale-95">
                <PlusCircle className="h-4 w-4" /> Add New Category
              </Button>
            } />
            <DialogContent className="rounded-xl sm:max-w-md border-none shadow-2xl p-8">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-slate-900">Create Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-black text-slate-400 uppercase ml-1">Category Name</Label>
                  <Input 
                    placeholder="e.g. Fashion & Apparel" 
                    className="h-12 rounded-lg border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/10 font-bold transition-all" 
                    value={newCat.name}
                    onChange={e => setNewCat({...newCat, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-black text-slate-400 uppercase ml-1">SEO URL Slug</Label>
                  <Input 
                    placeholder="e.g. fashion-apparel" 
                    className="h-12 rounded-lg border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/10 font-bold transition-all" 
                    value={newCat.slug}
                    onChange={e => setNewCat({...newCat, slug: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-black text-slate-400 uppercase ml-1">Category Image URL</Label>
                  <Input 
                    placeholder="https://images..." 
                    className="h-12 rounded-lg border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/10 font-bold transition-all" 
                    value={newCat.image}
                    onChange={e => {
                      const val = e.target.value;
                      const converted = convertGoogleDriveLink(val);
                      setNewCat({...newCat, image: converted});
                    }}
                  />
                </div>
              </div>
              <DialogFooter className="grid grid-cols-2 gap-4 sm:space-x-0 mt-4">
                <Button variant="ghost" className="h-14 rounded-lg font-black uppercase text-xs tracking-widest text-slate-400" onClick={() => setIsOpen(false)}>Discard</Button>
                <Button className="h-14 rounded-lg bg-[#00458e] text-white font-black uppercase text-xs tracking-widest px-8 shadow-lg shadow-blue-100" onClick={handleAdd}>Save Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search & Tabs Block */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
           <div className="relative w-full md:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search categories by name..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-12 pl-12 rounded-lg border-slate-100 bg-white shadow-sm ring-0 focus:ring-2 focus:ring-primary/10 text-sm font-medium"
              />
           </div>
           <div className="flex items-center gap-3">
              <Button className="h-12 px-6 bg-[#00458e] text-white rounded-lg gap-2 font-black text-[11px] uppercase shadow-lg shadow-blue-50 transition-all hover:scale-105">
                 <RefreshCcw className="h-4 w-4" /> Reset Filters
              </Button>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
        <Table>
          <TableHeader className="bg-slate-50/50 border-b border-slate-100">
            <TableRow className="hover:bg-transparent h-14">
              <TableHead className="pl-8 w-24 text-[11px] font-black uppercase text-slate-400 tracking-widest">Image</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Category Name</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">SEO Slug</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Products</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Status</TableHead>
              <TableHead className="text-right pr-8 text-[11px] font-black uppercase text-slate-400 tracking-widest">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length === 0 ? (
               <TableRow>
                  <TableCell colSpan={6} className="py-40 text-center">
                     <div className="flex flex-col items-center gap-5 opacity-30 px-10">
                        <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center">
                           <LayoutGrid className="h-8 w-8 text-slate-400" />
                        </div>
                        <p className="text-sm font-black italic uppercase tracking-widest max-w-[250px]">No categories found.</p>
                     </div>
                  </TableCell>
               </TableRow>
            ) : filteredCategories.map((cat) => (
              <TableRow key={cat.id} className="hover:bg-slate-50/50 transition-colors h-20 group border-b border-slate-50">
                <TableCell className="pl-8">
                  <div className="h-14 w-14 bg-white rounded-lg border border-slate-100 overflow-hidden flex items-center justify-center p-0.5 shadow-sm transition-transform group-hover:scale-110 duration-300">
                     <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-md" referrerPolicy="no-referrer" />
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-[14px] font-black text-slate-900 group-hover:text-primary transition-colors">{cat.name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-[12px] text-slate-400 font-bold uppercase tracking-tight">{cat.slug}</span>
                </TableCell>
                <TableCell>
                   <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <span className="text-[11px] font-black">{cat.productCount}</span>
                      <span className="text-[9px] font-black uppercase tracking-tighter opacity-70 whitespace-nowrap">Items Linked</span>
                   </div>
                </TableCell>
                <TableCell>
                   <div className="flex items-center gap-2">
                       <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></div>
                       <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600">Active</span>
                   </div>
                </TableCell>
                <TableCell className="text-right pr-8">
                   <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openEdit(cat)}
                        className="h-9 w-9 flex items-center justify-center rounded-lg bg-white text-slate-400 hover:bg-[#00458e] hover:text-white transition-all shadow-sm border border-slate-100"
                      >
                         <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        className="h-9 w-9 flex items-center justify-center rounded-lg bg-white text-slate-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-slate-100"
                      >
                         <Trash2 className="h-4 w-4" />
                      </button>
                   </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="rounded-[32px] sm:max-w-md border-none shadow-2xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900">Edit Category</DialogTitle>
          </DialogHeader>
          {editingCat && (
            <div className="space-y-6 py-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-black text-slate-400 uppercase ml-1">Category Name</Label>
                <Input 
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/10 font-bold transition-all" 
                  value={editingCat.name}
                  onChange={e => setEditingCat({...editingCat, name: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-black text-slate-400 uppercase ml-1">SEO URL Slug</Label>
                <Input 
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/10 font-bold transition-all" 
                  value={editingCat.slug}
                  onChange={e => setEditingCat({...editingCat, slug: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-black text-slate-400 uppercase ml-1">Category Image URL</Label>
                <Input 
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/10 font-bold transition-all" 
                  value={editingCat.image}
                  onChange={e => {
                    const val = e.target.value;
                    const converted = convertGoogleDriveLink(val);
                    setEditingCat({...editingCat, image: converted});
                  }}
                />
              </div>
            </div>
          )}
          <DialogFooter className="grid grid-cols-2 gap-4 sm:space-x-0 mt-4">
             <Button variant="ghost" className="h-14 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-400" onClick={() => setIsEditOpen(false)}>Discard</Button>
             <Button className="h-14 rounded-2xl bg-[#00458e] text-white font-black uppercase text-xs tracking-widest px-8 shadow-lg shadow-blue-100" onClick={handleUpdate}>Update Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
