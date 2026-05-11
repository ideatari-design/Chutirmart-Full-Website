import React, { useState, useEffect } from 'react';
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
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Filter,
  ExternalLink,
  Zap,
  Sparkles,
  Trophy
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
import { Checkbox } from '@/components/ui/checkbox';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { toast } from 'sonner';
import { convertGoogleDriveLink } from '@/lib/imageUtils';

import AdminPagination from '@/components/AdminPagination';

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    nameBn: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    mainImage: '',
    gallery: '',
    isFlashSale: false,
    isNewArrival: false,
    isBestSelling: false
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');

  const fetchProducts = async () => {
    setLoading(true);
    const data = await productService.getAllProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsSubmitting(true);
    try {
      const price = parseFloat(newProduct.price);
      const stock = parseInt(newProduct.stock) || 0;

      const galleryArray = newProduct.gallery 
        ? newProduct.gallery.split('\n').filter(url => url.trim() !== '') 
        : [];
      
      const images = [
        newProduct.mainImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
        ...galleryArray
      ];

      const added = await productService.addProduct({
        name: newProduct.name,
        nameBn: newProduct.nameBn || newProduct.name,
        price,
        stock,
        category: newProduct.category || 'Uncategorized',
        description: newProduct.description,
        isFlashSale: newProduct.isFlashSale,
        isNewArrival: newProduct.isNewArrival,
        isBestSelling: newProduct.isBestSelling,
        images
      });

      setIsSubmitting(false);
      if (added) {
        toast.success("Product added successfully!");
        setIsAddOpen(false);
        setNewProduct({ 
          name: '', 
          nameBn: '', 
          price: '', 
          stock: '', 
          category: '', 
          description: '',
          mainImage: '',
          gallery: '',
          isFlashSale: false,
          isNewArrival: false,
          isBestSelling: false
        });
        fetchProducts();
      } else {
        toast.error("Could not add product. Please check server logs or database settings.");
      }
    } catch (err: any) {
      setIsSubmitting(false);
      toast.error(`Add Error: ${err.message || 'Unknown error'}`);
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;
    
    setIsSubmitting(true);
    try {
      const updated = await productService.updateProduct(editingProduct.id, editingProduct);
      
      setIsSubmitting(false);
      if (updated) {
        toast.success("Product updated successfully!");
        setIsEditOpen(false);
        fetchProducts();
      } else {
        toast.error("Could not update product. Check if database is connected.");
      }
    } catch (err: any) {
      setIsSubmitting(false);
      toast.error(`Update Error: ${err.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: string) => {
    const deleted = await productService.deleteProduct(id);
    if (deleted) {
      toast.success("Product deleted successfully");
      fetchProducts();
    } else {
      toast.error("Could not delete product");
    }
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditOpen(true);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
      (p.nameBn && p.nameBn.includes(search));
    const matchesFilter = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger nativeButton={true} render={
              <Button className="h-10 bg-[#00458e] hover:bg-blue-800 text-white rounded-lg font-semibold text-xs px-5 flex items-center gap-2">
                <Plus className="h-4 w-4" /> New Product
              </Button>
            } />
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Add New Product</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="name" className="font-bold">Product Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter product name" 
                  className="rounded-xl h-12" 
                  value={newProduct.name}
                  onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="font-bold">Price (৳)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  placeholder="0.00" 
                  className="rounded-xl h-12" 
                  value={newProduct.price}
                  onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock" className="font-bold">Stock Quantity</Label>
                <Input 
                  id="stock" 
                  type="number" 
                  placeholder="0" 
                  className="rounded-xl h-12" 
                  value={newProduct.stock}
                  onChange={e => setNewProduct(p => ({ ...p, stock: e.target.value }))}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="category" className="font-bold">Category</Label>
                <div className="relative">
                  <Input 
                    id="category" 
                    placeholder="Type or select category" 
                    className="rounded-xl h-12 pr-10" 
                    value={newProduct.category}
                    onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}
                  />
                  {categories.length > 1 && (
                    <select 
                      className="absolute right-2 top-2 h-8 rounded-lg border bg-background text-xs outline-none"
                      onChange={e => {
                        if (e.target.value) {
                          setNewProduct(p => ({ ...p, category: e.target.value }));
                        }
                      }}
                      value=""
                    >
                      <option value="" disabled>Presets</option>
                      {categories.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div className="col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="mainImage" className="font-bold">Main Image URL</Label>
                  <a href="https://postimages.org/" target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline font-bold flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" /> Upload to get URL
                  </a>
                </div>
                <Input 
                  id="mainImage" 
                  placeholder="https://images.unsplash.com/..." 
                  className="rounded-xl h-12" 
                  value={newProduct.mainImage}
                  onChange={e => {
                    const val = e.target.value;
                    const converted = convertGoogleDriveLink(val);
                    setNewProduct(p => ({ ...p, mainImage: converted }));
                  }}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="gallery" className="font-bold">Gallery Image URLs (One URL per line)</Label>
                <textarea 
                  id="gallery" 
                  className="w-full h-24 rounded-xl border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
                  placeholder="Enter multiple image URLs here (one per line)..."
                  value={newProduct.gallery}
                  onChange={e => {
                    const val = e.target.value;
                    const lines = val.split('\n');
                    const convertedLines = lines.map(line => convertGoogleDriveLink(line.trim()));
                    setNewProduct(p => ({ ...p, gallery: convertedLines.join('\n') }));
                  }}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="desc" className="font-bold">Full Description</Label>
                <textarea 
                  id="desc" 
                  className="w-full h-32 rounded-xl border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
                  placeholder="Enter product description..."
                  value={newProduct.description}
                  onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))}
                />
              </div>
              <div className="col-span-2 space-y-4 pt-2">
                <Label className="font-bold">Homepage Sections</Label>
                <div className="flex flex-wrap gap-6 bg-secondary/20 p-4 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="flashsale" 
                      checked={newProduct.isFlashSale} 
                      onCheckedChange={(checked) => setNewProduct(p => ({ ...p, isFlashSale: checked === true }))}
                    />
                    <label htmlFor="flashsale" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1 cursor-pointer">
                      <Zap className="h-3 w-3 text-orange-500" /> Flash Sale
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="newarrival" 
                      checked={newProduct.isNewArrival} 
                      onCheckedChange={(checked) => setNewProduct(p => ({ ...p, isNewArrival: checked === true }))}
                    />
                    <label htmlFor="newarrival" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1 cursor-pointer">
                      <Sparkles className="h-3 w-3 text-blue-500" /> New Arrival
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="bestselling" 
                      checked={newProduct.isBestSelling} 
                      onCheckedChange={(checked) => setNewProduct(p => ({ ...p, isBestSelling: checked === true }))}
                    />
                    <label htmlFor="bestselling" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1 cursor-pointer">
                      <Trophy className="h-3 w-3 text-yellow-500" /> Best Selling
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" className="rounded-xl h-12" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddProduct} disabled={isSubmitting} className="rounded-xl h-12 px-8 font-bold uppercase text-xs tracking-widest">
                {isSubmitting ? 'Saving...' : 'Save Product'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
           <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem]">
              <DialogHeader>
                 <DialogTitle className="text-2xl font-black">Edit Product</DialogTitle>
              </DialogHeader>
              {editingProduct && (
                 <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="col-span-2 space-y-2">
                       <Label className="font-bold">Product Name</Label>
                       <Input 
                          value={editingProduct.name}
                          onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                          className="h-12 rounded-xl"
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="font-bold">Price (৳)</Label>
                       <Input 
                          type="number"
                          value={editingProduct.price}
                          onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                          className="h-12 rounded-xl"
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="font-bold">Stock</Label>
                       <Input 
                          type="number"
                          value={editingProduct.stock}
                          onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                          className="h-12 rounded-xl"
                       />
                    </div>
                    <div className="col-span-2 space-y-2">
                       <Label className="font-bold">Category</Label>
                       <div className="relative">
                          <Input 
                             value={editingProduct.category}
                             onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                             className="h-12 rounded-xl pr-10"
                             placeholder="Type or select category"
                          />
                          {categories.length > 1 && (
                             <select 
                                className="absolute right-2 top-2 h-8 rounded-lg border bg-background text-xs outline-none"
                                onChange={e => {
                                   if (e.target.value) {
                                      setEditingProduct({...editingProduct, category: e.target.value});
                                   }
                                }}
                                value=""
                             >
                                <option value="" disabled>Presets</option>
                                {categories.filter(c => c !== 'All').map(cat => (
                                   <option key={cat} value={cat}>{cat}</option>
                                ))}
                             </select>
                          )}
                       </div>
                    </div>
                    <div className="col-span-2 space-y-2">
                       <div className="flex items-center justify-between">
                          <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Main Image URL</Label>
                          <a href="https://postimages.org/" target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline font-bold flex items-center gap-1">
                             <ExternalLink className="h-3 w-3" /> Get URL
                          </a>
                       </div>
                       <Input 
                          placeholder="https://..." 
                          className="h-12 rounded-xl" 
                          value={editingProduct.images[0] || ''}
                          onChange={e => {
                             const val = e.target.value;
                             const converted = convertGoogleDriveLink(val);
                             const newImages = [...editingProduct.images];
                             newImages[0] = converted;
                             setEditingProduct({...editingProduct, images: newImages});
                          }}
                       />
                    </div>
                    <div className="col-span-2 space-y-2">
                       <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Gallery Image URLs (One URL per line)</Label>
                       <textarea 
                          className="w-full h-24 rounded-xl border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
                          placeholder="Enter multiple image URLs here..."
                          value={editingProduct.images.slice(1).join('\n')}
                          onChange={(e) => {
                             const val = e.target.value;
                             const lines = val.split('\n');
                             const gallery = lines.map(line => convertGoogleDriveLink(line.trim())).filter(url => url !== '');
                             const updatedImages = [editingProduct.images[0] || '', ...gallery];
                             setEditingProduct({ ...editingProduct, images: updatedImages });
                          }}
                       />
                    </div>
                    <div className="col-span-2 space-y-2">
                       <Label className="font-bold">Description</Label>
                       <textarea 
                          value={editingProduct.description}
                          onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                          className="w-full h-32 rounded-xl border px-3 py-2 text-sm"
                       />
                    </div>
                    <div className="col-span-2 space-y-4 pt-2">
                       <Label className="font-bold">Homepage Sections</Label>
                       <div className="flex flex-wrap gap-6 bg-secondary/20 p-4 rounded-2xl">
                          <div className="flex items-center space-x-2">
                             <Checkbox 
                                id="edit-flashsale" 
                                checked={editingProduct.isFlashSale} 
                                onCheckedChange={(checked) => setEditingProduct({...editingProduct, isFlashSale: checked === true})}
                             />
                             <label htmlFor="edit-flashsale" className="text-sm font-medium leading-none flex items-center gap-1 cursor-pointer">
                                <Zap className="h-3 w-3 text-orange-500" /> Flash Sale
                             </label>
                          </div>
                          <div className="flex items-center space-x-2">
                             <Checkbox 
                                id="edit-newarrival" 
                                checked={editingProduct.isNewArrival} 
                                onCheckedChange={(checked) => setEditingProduct({...editingProduct, isNewArrival: checked === true})}
                             />
                             <label htmlFor="edit-newarrival" className="text-sm font-medium leading-none flex items-center gap-1 cursor-pointer">
                                <Sparkles className="h-3 w-3 text-blue-500" /> New Arrival
                             </label>
                          </div>
                          <div className="flex items-center space-x-2">
                             <Checkbox 
                                id="edit-bestselling" 
                                checked={editingProduct.isBestSelling} 
                                onCheckedChange={(checked) => setEditingProduct({...editingProduct, isBestSelling: checked === true})}
                             />
                             <label htmlFor="edit-bestselling" className="text-sm font-medium leading-none flex items-center gap-1 cursor-pointer">
                                <Trophy className="h-3 w-3 text-yellow-500" /> Best Selling
                             </label>
                          </div>
                       </div>
                    </div>
                 </div>
              )}
              <DialogFooter>
                 <Button variant="outline" className="rounded-xl h-12" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                 <Button onClick={handleEditProduct} disabled={isSubmitting} className="rounded-xl h-12 px-8">
                    {isSubmitting ? 'Updating...' : 'Update Product'}
                 </Button>
              </DialogFooter>
           </DialogContent>
          </Dialog>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
          <button className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors relative ${filterCategory === 'All' ? 'text-[#00458e]' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setFilterCategory('All')}>
            All (100)
            {filterCategory === 'All' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00458e]"></div>}
          </button>
          <button className="px-4 py-3 text-xs font-semibold text-slate-500 hover:text-slate-700 whitespace-nowrap">
            Drafts (20)
          </button>
          <button className="px-4 py-3 text-xs font-semibold text-slate-500 hover:text-slate-700 whitespace-nowrap">
            New Arrival (15)
          </button>
          <button className="px-4 py-3 text-xs font-semibold text-slate-500 hover:text-slate-700 whitespace-nowrap">
            Flash Sale (5)
          </button>
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

             <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                <select className="h-10 px-4 pr-10 text-sm font-medium bg-white appearance-none focus:outline-none" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                   {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <div className="pointer-events-none -ml-8 flex items-center px-2 text-slate-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search Product Name..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 w-[250px] border-slate-200 rounded-lg text-sm bg-white" 
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
              <TableHead className="w-16">Image</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Name</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Category</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Price</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Stock</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Status</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Date Added</TableHead>
              <TableHead className="text-right pr-6 text-[12px] font-medium text-slate-600">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
               <TableRow>
                  <TableCell colSpan={9} className="py-20 text-center font-medium italic opacity-50">Loading products...</TableCell>
               </TableRow>
            ) : currentProducts.length === 0 ? (
               <TableRow>
                  <TableCell colSpan={9} className="py-20 text-center font-medium italic opacity-50">No products found.</TableCell>
               </TableRow>
            ) : currentProducts.map((p) => (
              <TableRow key={p.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 h-16">
                <TableCell className="pl-6"><div className="w-4 h-4 border border-slate-200 rounded"></div></TableCell>
                <TableCell>
                  <div className="w-10 h-10 rounded-full border border-slate-100 overflow-hidden bg-slate-50">
                    <img 
                      src={p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200'} 
                      alt={p.name} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200';
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-slate-900">{p.name}</span>
                    <span className="text-[11px] text-slate-400 font-medium">PK: 15478</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-[13px] font-medium text-slate-600">{p.category}</span>
                </TableCell>
                <TableCell>
                  <span className="text-[13px] font-semibold text-slate-900">৳ {p.price.toLocaleString()}</span>
                </TableCell>
                <TableCell>
                  <span className={`text-[13px] font-semibold ${p.stock < 10 ? 'text-orange-500' : 'text-slate-900'}`}>{p.stock}</span>
                </TableCell>
                <TableCell>
                   <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${p.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={`text-[12px] font-medium ${p.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>{p.stock > 0 ? 'Instock' : 'Out of Stock'}</span>
                   </div>
                </TableCell>
                <TableCell>
                   <span className="text-[13px] text-slate-500 font-medium">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Initial'}</span>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#00458e] hover:bg-slate-100" onClick={() => openEdit(p)}>
                       <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-slate-100" onClick={() => handleDelete(p.id)}>
                       <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <AdminPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredProducts.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default AdminProducts;
