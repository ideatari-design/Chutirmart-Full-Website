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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-black flex items-center gap-3">
              <Tags className="h-8 w-8 text-primary" />
              Category Management
           </h2>
           <p className="text-muted-foreground font-medium">Control all your shop categories from here</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
           <DialogTrigger nativeButton={true} render={
              <Button className="rounded-xl h-12 px-6 gap-2 bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20">
                <Plus className="h-5 w-5" /> New Category
              </Button>
           } />
           <DialogContent className="rounded-[2rem] sm:max-w-md">
              <DialogHeader>
                 <DialogTitle className="text-2xl font-black">Create New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                 <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Category Name</Label>
                    <Input 
                      placeholder="e.g. Fashion" 
                      className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all" 
                      value={newCat.name}
                      onChange={e => setNewCat({...newCat, name: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Slug</Label>
                    <Input 
                      placeholder="e.g. fashion" 
                      className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all" 
                      value={newCat.slug}
                      onChange={e => setNewCat({...newCat, slug: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Image URL</Label>
                    <div className="flex gap-2">
                       <Input 
                        placeholder="https://..." 
                        className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all" 
                        value={newCat.image}
                        onChange={e => {
                           const val = e.target.value;
                           const converted = convertGoogleDriveLink(val);
                           setNewCat({...newCat, image: converted});
                        }}
                       />
                       <Button variant="secondary" className="h-12 w-12 p-0 rounded-xl">
                          <ImageIcon className="h-5 w-5" />
                       </Button>
                    </div>
                 </div>
              </div>
              <DialogFooter>
                 <Button className="w-full h-12 rounded-xl font-bold uppercase text-xs tracking-widest" onClick={handleAdd}>Save Category</Button>
              </DialogFooter>
           </DialogContent>
        </Dialog>
        
        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
           <DialogContent className="rounded-[2rem] sm:max-w-md">
              <DialogHeader>
                 <DialogTitle className="text-2xl font-black">Edit Category</DialogTitle>
              </DialogHeader>
              {editingCat && (
                 <div className="space-y-4 py-4">
                    <div className="space-y-2">
                       <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Category Name</Label>
                       <Input 
                         placeholder="e.g. Fashion" 
                         className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all" 
                         value={editingCat.name}
                         onChange={e => setEditingCat({...editingCat, name: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Slug</Label>
                       <Input 
                         placeholder="e.g. fashion" 
                         className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all" 
                         value={editingCat.slug}
                         onChange={e => setEditingCat({...editingCat, slug: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Image URL</Label>
                       <div className="flex gap-2">
                          <Input 
                           placeholder="https://..." 
                           className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all" 
                           value={editingCat.image}
                           onChange={e => {
                              const val = e.target.value;
                              const converted = convertGoogleDriveLink(val);
                              setEditingCat({...editingCat, image: converted});
                           }}
                          />
                          <Button variant="secondary" className="h-12 w-12 p-0 rounded-xl">
                             <ImageIcon className="h-5 w-5" />
                          </Button>
                       </div>
                    </div>
                 </div>
              )}
              <DialogFooter>
                 <Button className="w-full h-12 rounded-xl font-bold uppercase text-xs tracking-widest" onClick={handleUpdate}>Update Category</Button>
              </DialogFooter>
           </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 py-4 px-6 bg-white rounded-2xl shadow-sm border border-primary/5">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by category name..." 
            className="pl-10 rounded-xl bg-secondary/10 border-none h-11" 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-primary/5">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="pl-6 font-bold text-primary">Image</TableHead>
              <TableHead className="font-bold text-primary">Name</TableHead>
              <TableHead className="font-bold text-primary">Slug</TableHead>
              <TableHead className="font-bold text-primary">Product Count</TableHead>
              <TableHead className="font-bold text-primary text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((cat) => (
              <TableRow key={cat.id} className="hover:bg-secondary/10 transition-colors border-b-primary/5">
                <TableCell className="pl-6 py-4">
                   <div className="w-12 h-12 bg-secondary/50 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                   </div>
                </TableCell>
                <TableCell className="font-bold text-primary">{cat.name}</TableCell>
                <TableCell className="text-muted-foreground font-medium">{cat.slug}</TableCell>
                <TableCell>
                   <Badge variant="outline" className="font-bold border-primary/20 text-primary bg-primary/5">{cat.productCount} Products</Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                   <div className="flex justify-end gap-2 text-muted-foreground">
                      <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-primary hover:bg-primary/5 rounded-xl transition-all" onClick={() => openEdit(cat)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all" onClick={() => handleDelete(cat.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                   </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminCategories;
