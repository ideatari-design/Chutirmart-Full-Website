import React, { useState, useEffect, useMemo } from 'react';
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
  Eye,
  Filter,
  Package,
  Zap,
  Sparkles,
  Trophy,
  RefreshCcw,
  PlusCircle,
  MoreVertical,
  Layers,
  ChevronDown,
  LayoutGrid,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { toast } from 'sonner';
import AdminPagination from '@/components/AdminPagination';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [filterTab, setFilterTab] = useState('All');
  
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error("Fetch products failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!productToDelete) return;
    const success = await productService.deleteProduct(productToDelete);
    if (success) {
      toast.success("Product deleted successfully");
      setProducts(prev => prev.filter(p => p.id !== productToDelete));
      setIsDeleteOpen(false);
      setProductToDelete(null);
    } else {
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
       return p.name.toLowerCase().includes(search.toLowerCase()) || (p.nameBn && p.nameBn.includes(search));
    });

    switch(filterTab) {
      case 'Active': result = result.filter(p => p.stock > 0); break;
      case 'Draft': result = result.filter(p => p.status === 'draft'); break;
      case 'Out of Stock': result = result.filter(p => p.stock === 0); break;
      case 'New Arrival': result = result.filter(p => p.isNewArrival); break;
      case 'Flash Sale': result = result.filter(p => p.isFlashSale); break;
    }

    return result;
  }, [products, search, filterTab]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const tabs = [
    { name: 'All', count: products.length },
    { name: 'Active', count: products.filter(p => p.stock > 0).length },
    { name: 'Draft', count: products.filter(p => p.status === 'draft').length },
    { name: 'Out of Stock', count: products.filter(p => p.stock === 0).length },
    { name: 'New Arrival', count: products.filter(p => p.isNewArrival).length },
    { name: 'Flash Sale', count: products.filter(p => p.isFlashSale).length },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
           <div className="flex flex-col space-y-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manage Products</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Organize and control your entire inventory — add, edit, or remove products instantly.</p>
           </div>
           <Button 
             onClick={() => navigate('/admin/products/add')}
             className="h-11 bg-[#00458e] hover:bg-blue-800 text-white rounded-xl font-black text-[11px] uppercase px-6 gap-2 shadow-lg shadow-blue-100 transition-all hover:scale-105 active:scale-95"
           >
              <PlusCircle className="h-4 w-4" /> Add New Product
           </Button>
        </div>

        {/* Categories / Tabs */}
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto no-scrollbar gap-1">
           {tabs.map((tab) => (
             <button
               key={tab.name}
               onClick={() => { setFilterTab(tab.name); setCurrentPage(1); }}
               className={`flex items-center gap-2 px-5 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300 ${
                 filterTab === tab.name 
                   ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' 
                   : 'text-slate-500 hover:bg-slate-50'
               }`}
             >
               <span className="text-[11px] font-bold uppercase tracking-tight">{tab.name}</span>
               <span className={`text-[10px] px-2 py-0.5 rounded-lg font-black ${
                 filterTab === tab.name ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
               }`}>
                 {tab.count}
               </span>
             </button>
           ))}
        </div>

        {/* Search & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
           <div className="relative w-full md:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search products by name or code..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-12 pl-12 rounded-2xl border-slate-100 bg-white shadow-sm ring-0 focus:ring-2 focus:ring-primary/10 text-sm font-medium"
              />
           </div>
           <div className="flex items-center gap-3">
              <div className="flex items-center bg-white border border-slate-100 rounded-2xl shadow-sm h-12 overflow-hidden px-1">
                 <select className="h-full bg-transparent text-[11px] font-bold uppercase tracking-tight text-slate-500 outline-none px-4 cursor-pointer">
                    <option>Bulk Action</option>
                    <option>Sort by Price</option>
                    <option>Sort by Date</option>
                 </select>
                 <Button size="icon" className="h-10 w-10 bg-slate-900 text-white rounded-xl shadow-md">
                    <Filter className="h-4 w-4" />
                 </Button>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => { setSearch(''); setFilterTab('All'); }}
                className="h-12 w-12 rounded-2xl border border-slate-100 bg-white text-slate-400 hover:text-slate-900 shadow-sm"
              >
                 <RefreshCcw className="h-4 w-4" />
              </Button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
         <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
           <Table>
             <TableHeader className="bg-slate-50/50 border-b border-slate-100">
               <TableRow className="h-14 hover:bg-transparent">
                 <TableHead className="pl-8 w-20 text-[11px] font-black uppercase text-slate-400 tracking-widest">Image</TableHead>
                 <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Product Information</TableHead>
                 <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Category</TableHead>
                 <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Pricing</TableHead>
                 <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Stock</TableHead>
                 <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Status</TableHead>
                 <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Added Date</TableHead>
                 <TableHead className="text-right pr-8 text-[11px] font-black uppercase text-slate-400 tracking-widest">Actions</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {loading ? (
                 <TableRow>
                   <TableCell colSpan={8} className="py-40 text-center">
                     <div className="flex flex-col items-center gap-4 opacity-30">
                        <RefreshCcw className="h-12 w-12 animate-spin text-primary" />
                        <p className="text-sm font-black italic uppercase tracking-widest">Synchronizing products...</p>
                     </div>
                   </TableCell>
                 </TableRow>
               ) : currentProducts.length === 0 ? (
                 <TableRow>
                   <TableCell colSpan={8} className="py-40 text-center">
                     <div className="flex flex-col items-center gap-5 opacity-30 px-10">
                        <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center">
                           <LayoutGrid className="h-10 w-10 text-slate-400" />
                        </div>
                        <p className="text-sm font-black italic uppercase tracking-widest max-w-[250px]">No products match your search or filter.</p>
                        <Button variant="outline" className="rounded-full font-bold text-xs" onClick={() => { setSearch(''); setFilterTab('All'); }}>Reset Filters</Button>
                     </div>
                   </TableCell>
                 </TableRow>
               ) : (
                 currentProducts.map((p) => (
                   <TableRow key={p.id} className="h-20 hover:bg-slate-50/50 transition-colors border-b border-slate-50 group">
                     <TableCell className="pl-8">
                       <div className="h-14 w-14 rounded-2xl border border-slate-100 overflow-hidden bg-white shadow-sm transition-transform group-hover:scale-110 duration-300">
                         <img 
                           src={p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200'} 
                           alt={p.name} 
                           className="w-full h-full object-cover" 
                           referrerPolicy="no-referrer"
                         />
                       </div>
                     </TableCell>
                     <TableCell>
                       <div className="flex flex-col space-y-0.5">
                         <div className="flex items-center gap-2">
                            <span className="text-[14px] font-black text-slate-900 group-hover:text-primary transition-colors">{p.name}</span>
                            {p.isFlashSale && <Zap className="h-3 w-3 text-orange-500 fill-orange-500" />}
                            {p.isNewArrival && <Sparkles className="h-3 w-3 text-blue-500 fill-blue-500" />}
                         </div>
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase">Code: PRODUCT-{p.id.substring(0, 4)}</span>
                            <span className="text-[10px] font-bold text-primary tracking-tighter uppercase px-2 py-0.5 bg-primary/5 rounded-md">Featured</span>
                         </div>
                       </div>
                     </TableCell>
                     <TableCell>
                       <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-slate-200"></div>
                          <span className="text-[13px] font-bold text-slate-500 uppercase tracking-tight">{p.category}</span>
                       </div>
                     </TableCell>
                     <TableCell>
                        <div className="flex flex-col">
                           <span className="text-[15px] font-black text-slate-900 tracking-tight">৳ {p.price.toLocaleString()}</span>
                           <span className="text-[9px] text-slate-400 font-black line-through italic uppercase tracking-tighter decoration-rose-500/30 decoration-2">WAS ৳ {(p.price * 1.2).toFixed(0)}</span>
                        </div>
                     </TableCell>
                     <TableCell>
                        <div className="flex flex-col space-y-1">
                           <div className="flex items-center justify-between w-16 px-1">
                              <span className={`text-[13px] font-black ${p.stock < 10 ? 'text-rose-500 animate-pulse' : 'text-slate-900'}`}>{p.stock}</span>
                              <span className="text-[10px] font-bold text-slate-400">PCS</span>
                           </div>
                           <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                 className={`h-full rounded-full ${p.stock < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                 style={{ width: `${Math.min(100, (p.stock / 50) * 100)}%` }}
                              ></div>
                           </div>
                        </div>
                     </TableCell>
                     <TableCell>
                        <div className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          p.stock > 0 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-100' 
                            : 'bg-rose-50 text-rose-500 border-rose-100 group-hover:bg-rose-100'
                        }`}>
                           {p.stock > 0 ? 'In Stock' : 'Sold Out'}
                        </div>
                     </TableCell>
                     <TableCell>
                        <div className="flex flex-col">
                           <span className="text-[12px] font-bold text-slate-500">{p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-GB') : '12/04/2026'}</span>
                           <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Added By Admin</span>
                        </div>
                     </TableCell>
                     <TableCell className="text-right pr-8">
                       <div className="flex items-center justify-end gap-2">
                          <button className="h-9 w-9 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-500 hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-100">
                             <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                            className="h-9 w-9 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-500 hover:bg-[#00458e] hover:text-white transition-all shadow-sm border border-slate-100"
                          >
                             <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => { setProductToDelete(p.id); setIsDeleteOpen(true); }}
                            className="h-9 w-9 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-slate-100"
                          >
                             <Trash2 className="h-4 w-4" />
                          </button>
                       </div>
                     </TableCell>
                   </TableRow>
                 ))
               )}
             </TableBody>
           </Table>

           <div className="p-8 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="h-10 px-4 flex items-center gap-2 bg-white rounded-2xl border border-slate-100 text-xs font-black text-slate-400 uppercase tracking-tighter shadow-sm">
                    Showing <span className="text-slate-900">{Math.min(currentProducts.length, itemsPerPage)}</span> of <span className="text-slate-900">{filteredProducts.length}</span> Products
                 </div>
              </div>
              <AdminPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredProducts.length}
                itemsPerPage={itemsPerPage}
              />
           </div>
         </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md rounded-[32px] border-none shadow-2xl p-10">
          <DialogHeader className="items-center text-center space-y-4">
            <div className="h-20 w-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 shadow-inner">
               <AlertTriangle className="h-10 w-10 animate-bounce" />
            </div>
            <DialogTitle className="text-2xl font-black text-slate-900">Are you absolutely sure?</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-slate-500 font-medium leading-relaxed">
              This action will permanently remove <span className="font-black text-slate-900 underline decoration-rose-500 decoration-2 underline-offset-4 tracking-tight">this product</span> from your database and cannot be recovered.
            </p>
          </div>
          <DialogFooter className="grid grid-cols-2 gap-4 sm:space-x-0 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="rounded-2xl h-14 font-black uppercase text-xs tracking-widest border-slate-200"
            >
              No, Keep It
            </Button>
            <Button
              onClick={handleDelete}
              className="rounded-2xl h-14 font-black uppercase text-xs tracking-widest bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-100"
            >
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
