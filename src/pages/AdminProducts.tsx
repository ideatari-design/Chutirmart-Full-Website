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
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { toast } from 'sonner';

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    nameBn: '',
    price: '',
    stock: '',
    category: '',
    description: ''
  });

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

    const price = parseFloat(newProduct.price);
    const stock = parseInt(newProduct.stock) || 0;

    const added = await productService.addProduct({
      name: newProduct.name,
      nameBn: newProduct.nameBn || newProduct.name,
      price,
      stock,
      category: newProduct.category || 'Uncategorized',
      description: newProduct.description,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800']
    });

    if (added) {
      toast.success("Product added successfully!");
      setIsAddOpen(false);
      setNewProduct({ name: '', nameBn: '', price: '', stock: '', category: '', description: '' });
      fetchProducts();
    } else {
      toast.error("Could not add product");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const deleted = await productService.deleteProduct(id);
      if (deleted) {
        toast.success("Product deleted successfully");
        fetchProducts();
      } else {
        toast.error("Could not delete product");
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.nameBn && p.nameBn.includes(search))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-bold">Products</h2>
           <p className="text-muted-foreground">Manage your shop's inventory here</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger nativeButton={true} render={
            <Button size="lg" className="rounded-xl gap-2 h-12 px-6" />
          }>
               <Plus className="h-4 w-4" /> Add New Product
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter product name" 
                  className="rounded-xl" 
                  value={newProduct.name}
                  onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (৳)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  placeholder="0.00" 
                  className="rounded-xl" 
                  value={newProduct.price}
                  onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input 
                  id="stock" 
                  type="number" 
                  placeholder="0" 
                  className="rounded-xl" 
                  value={newProduct.stock}
                  onChange={e => setNewProduct(p => ({ ...p, stock: e.target.value }))}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category" 
                  placeholder="e.g. Electronics" 
                  className="rounded-xl" 
                  value={newProduct.category}
                  onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="desc">Full Description</Label>
                <textarea 
                  id="desc" 
                  className="w-full h-32 rounded-xl border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
                  placeholder="Enter product description..."
                  value={newProduct.description}
                  onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddProduct}>Save Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 py-4 px-6 bg-white rounded-2xl shadow-sm border border-primary/5">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl bg-secondary/20 border-none" 
          />
        </div>
        <Button variant="outline" className="rounded-xl gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-primary/5">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-20 pl-6 font-bold text-primary">Image</TableHead>
              <TableHead className="font-bold text-primary">Name</TableHead>
              <TableHead className="font-bold text-primary">Category</TableHead>
              <TableHead className="font-bold text-primary">Price</TableHead>
              <TableHead className="font-bold text-primary text-center">Stock</TableHead>
              <TableHead className="font-bold text-primary text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((p) => (
              <TableRow key={p.id} className="hover:bg-secondary/10 transition-colors border-b-primary/5">
                <TableCell className="pl-6">
                  <div className="w-12 h-12 bg-secondary rounded-lg overflow-hidden border">
                    <img 
                      src={p.images[0]} 
                      alt={p.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200';
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-bold text-sm">{p.name}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/5">{p.category}</Badge>
                </TableCell>
                <TableCell className="font-bold">৳ {p.price.toLocaleString()}</TableCell>
                <TableCell className="text-center">
                   <span className={`font-bold ${p.stock < 5 ? 'text-destructive' : 'text-foreground'}`}>{p.stock}</span>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary hover:bg-primary/5 rounded-lg"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive hover:bg-destructive/5 rounded-lg" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
           <p>Showing 1 to {filteredProducts.length} of {products.length}</p>
           <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-lg h-8 w-8 p-0" disabled><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" className="rounded-lg h-8 w-8 p-0" disabled><ChevronRight className="h-4 w-4" /></Button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
