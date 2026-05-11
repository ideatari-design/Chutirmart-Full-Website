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
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ImageIcon,
  Tags
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
    { id: '1', name: 'Smartphones', slug: 'smartphones', productCount: 124, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=300' },
    { id: '2', name: 'Home & Decor', slug: 'home-decor', productCount: 89, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e3a38?auto=format&fit=crop&q=80&w=300' },
    { id: '3', name: 'Makeup', slug: 'makeup', productCount: 56, image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=300' },
    { id: '4', name: 'Autoparts', slug: 'autoparts', productCount: 42, image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=300' },
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
      image: newCat.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300'
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
    <div className="space-y-8 pb-20">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger nativeButton={true} render={
              <Button className="h-10 bg-[#00458e] hover:bg-blue-800 text-white rounded-lg font-semibold text-xs px-5 flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Category
              </Button>
            } />
            <DialogContent className="rounded-xl sm:max-w-md border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-slate-900">Create New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-4">
                <div className="space-y-2">
                  <Label className="text-[12px] font-semibold text-slate-700">Category Name</Label>
                  <Input 
                    placeholder="e.g. Fashion" 
                    className="h-11 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 font-medium" 
                    value={newCat.name}
                    onChange={e => setNewCat({...newCat, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] font-semibold text-slate-700">URL Slug</Label>
                  <Input 
                    placeholder="e.g. fashion" 
                    className="h-11 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 font-medium" 
                    value={newCat.slug}
                    onChange={e => setNewCat({...newCat, slug: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] font-semibold text-slate-700">Image URL</Label>
                  <Input 
                    placeholder="Paste link here..." 
                    className="h-11 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 font-medium" 
                    value={newCat.image}
                    onChange={e => {
                      const val = e.target.value;
                      const converted = convertGoogleDriveLink(val);
                      setNewCat({...newCat, image: converted});
                    }}
                  />
                </div>
              </div>
              <DialogFooter className="flex gap-3">
                <Button variant="outline" className="h-11 rounded-lg text-xs font-bold" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button className="h-11 rounded-lg bg-[#00458e] text-white text-xs font-bold px-8" onClick={handleAdd}>Save Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
             <div className="flex items-center">
                <select className="h-10 px-4 pr-10 border border-slate-200 rounded-lg text-sm font-medium bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option>Bulk Action</option>
                </select>
                <div className="pointer-events-none -ml-8 flex items-center px-2 text-slate-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
                <Button className="h-10 ml-3 bg-[#00458e] hover:bg-blue-800 text-white px-6 rounded-lg font-semibold text-xs">Apply</Button>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search Categories..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 w-[300px] border-slate-200 rounded-lg text-sm bg-white" 
                />
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden border border-[#0db39e]/20 shadow-sm">
        <Table>
          <TableHeader className="bg-[#ecfdfa]">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="pl-6 w-12"><div className="w-4 h-4 border border-[#0db39e] rounded bg-[#0db39e]/10"></div></TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Icon / Image</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Category Name</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Slug</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Products</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600 text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((cat) => (
              <TableRow key={cat.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 h-16">
                <TableCell className="pl-6"><div className="w-4 h-4 border border-slate-200 rounded"></div></TableCell>
                <TableCell>
                  <div className="w-10 h-10 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden flex items-center justify-center p-1">
                     <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-[13px] font-semibold text-slate-900">{cat.name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-[12px] text-slate-500 font-medium">{cat.slug}</span>
                </TableCell>
                <TableCell>
                   <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#00458e] text-[10px] font-bold border border-blue-100/50">
                     {cat.productCount} Items
                   </span>
                </TableCell>
                <TableCell className="text-right pr-6">
                   <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#00458e] hover:bg-blue-50" onClick={() => openEdit(cat)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(cat.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                   </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="rounded-xl sm:max-w-md border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Edit Category</DialogTitle>
          </DialogHeader>
          {editingCat && (
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-700">Category Name</Label>
                <Input 
                  className="h-11 rounded-lg border-slate-200 font-medium" 
                  value={editingCat.name}
                  onChange={e => setEditingCat({...editingCat, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-700">Slug</Label>
                <Input 
                  className="h-11 rounded-lg border-slate-200 font-medium" 
                  value={editingCat.slug}
                  onChange={e => setEditingCat({...editingCat, slug: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-700">Image URL</Label>
                <Input 
                  className="h-11 rounded-lg border-slate-200 font-medium" 
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
          <DialogFooter className="flex gap-3">
             <Button variant="outline" className="h-11 rounded-lg text-xs font-bold" onClick={() => setIsEditOpen(false)}>Cancel</Button>
             <Button className="h-11 rounded-lg bg-[#00458e] text-white text-xs font-bold px-8" onClick={handleUpdate}>Update Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
