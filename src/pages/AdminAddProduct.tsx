import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  Save, 
  Image as ImageIcon, 
  Plus, 
  Minus,
  Trash2, 
  X,
  PlusCircle,
  HelpCircle,
  LayoutGrid,
  Info,
  Maximize2,
  Upload,
  Search,
  Check,
  ChevronsUpDown,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { convertGoogleDriveLink } from '@/lib/imageUtils';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AdminAddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [product, setProduct] = useState({
    name: '',
    price: 0,
    oldPrice: 0,
    category: 'Uncategorized',
    images: [] as string[],
    stock: 0,
    description: '',
    specs: {} as Record<string, string>,
    isFeatured: false,
    isFlashSale: false,
    isNewArrival: false,
    isBestSelling: false,
    status: 'active'
  });

  const [imageUrl, setImageUrl] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    try {
      const data = await productService.getProductById(productId);
      if (data) {
        setProduct({
          name: data.name,
          price: data.price,
          oldPrice: data.oldPrice || 0,
          category: data.category,
          images: data.images || [],
          stock: data.stock || 0,
          description: data.description || '',
          specs: data.specs || {},
          isFeatured: !!data.isFeatured,
          isFlashSale: !!data.isFlashSale,
          isNewArrival: !!data.isNewArrival,
          isBestSelling: !!data.isBestSelling,
          status: data.status || 'active'
        });
      }
    } catch (err) {
      toast.error("Failed to load product data");
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await categoryService.getAllCategories();
      setCategories(cats);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const addImage = () => {
    if (!imageUrl) return;
    const finalUrl = convertGoogleDriveLink(imageUrl);
    setProduct({ ...product, images: [...product.images, finalUrl] });
    setImageUrl('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file.`);
        return null;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          return data.url;
        } else {
          toast.error(data.message || `Upload failed for ${file.name}`);
          return null;
        }
      } catch (err) {
        toast.error(`Upload failed for ${file.name}`);
        return null;
      }
    });

    try {
      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter((url): url is string => url !== null);
      if (validUrls.length > 0) {
        setProduct(prev => ({ ...prev, images: [...prev.images, ...validUrls] }));
        toast.success(`${validUrls.length} image(s) uploaded successfully!`);
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...product.images];
    newImages.splice(index, 1);
    setProduct({ ...product, images: newImages });
  };

  const addSpec = () => {
    if (!specKey || !specValue) return;
    setProduct({
      ...product,
      specs: { ...product.specs, [specKey]: specValue }
    });
    setSpecKey('');
    setSpecValue('');
  };

  const removeSpec = (key: string) => {
    const newSpecs = { ...product.specs };
    delete newSpecs[key];
    setProduct({ ...product, specs: newSpecs });
  };

  const handleSave = async (isDraft = false) => {
    try {
      if (!product.name || !product.price) {
        toast.error("Name and Price are required!");
        return;
      }
      
      const payload = { ...product, status: isDraft ? 'draft' : 'active' };
      
      let result;
      if (id) {
        result = await productService.updateProduct(id, payload as any);
      } else {
        result = await productService.addProduct(payload as any);
      }

      if (result) {
        toast.success(id ? "Product updated successfully!" : (isDraft ? "Product saved as draft!" : "Product published successfully!"));
        navigate('/admin/products');
      }
    } catch (err) {
      toast.error("Failed to save product. Check required fields.");
    }
  };

  const adjustStock = (amount: number) => {
    setProduct(prev => ({ ...prev, stock: Math.max(0, prev.stock + amount) }));
  };

  const createCategory = async () => {
    if (!categorySearch) return;
    try {
      const newCat = await categoryService.addCategory({ name: categorySearch });
      setCategories([...categories, newCat]);
      setProduct({ ...product, category: newCat.name });
      setIsCategoryDropdownOpen(false);
      setCategorySearch('');
      toast.success("New category created!");
    } catch (err) {
      toast.error("Failed to create category");
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-xl bg-white border shadow-sm"
              onClick={() => navigate('/admin/products')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{id ? 'Edit Product' : 'Add New Product'}</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{id ? 'Update existing product details.' : 'List a new product in your inventory with full details.'}</p>
            </div>
          </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="h-12 px-6 rounded-xl font-black text-[11px] uppercase border-slate-200"
            onClick={() => handleSave(true)}
          >
            Save as Draft
          </Button>
          <Button 
            className="h-12 px-8 bg-[#00458e] text-white rounded-xl font-black text-[11px] uppercase shadow-lg shadow-blue-100 transition-all hover:scale-105"
            onClick={() => handleSave(false)}
          >
            Publish Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* General Section */}
           <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 space-y-6">
              <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                 <LayoutGrid className="h-4 w-4" /> Basic Information
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                 <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700 ml-1">Product Title (English)</Label>
                    <Input 
                      placeholder="e.g. Wireless Noise Cancelling Headphones"
                      className="h-14 rounded-xl border-slate-100 bg-slate-50 focus:bg-white font-bold"
                      value={product.name}
                      onChange={e => setProduct({...product, name: e.target.value})}
                    />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-700 ml-1">Selling Price (৳)</Label>
                      <Input 
                        type="number"
                        className="h-14 rounded-xl border-slate-100 bg-slate-50 focus:bg-white font-black text-lg text-emerald-600"
                        value={product.price}
                        onChange={e => setProduct({...product, price: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-700 ml-1">Old Price (৳)</Label>
                      <Input 
                        type="number"
                        className="h-14 rounded-xl border-slate-100 bg-slate-50 focus:bg-white font-black text-lg text-slate-400"
                        value={product.oldPrice}
                        onChange={e => setProduct({...product, oldPrice: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                 </div>
              </div>
           </div>

           {/* Description Section */}
           <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 space-y-6">
              <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                 <Info className="h-4 w-4" /> Description & Features
              </h3>
              <div className="quill-container">
                <ReactQuill 
                  theme="snow"
                  value={product.description}
                  onChange={content => setProduct({...product, description: content})}
                  placeholder="Tell your customers about the product features and quality..."
                  className="rounded-xl overflow-hidden border border-slate-100"
                />
              </div>
              <style>{`
                .quill-container .ql-toolbar {
                  border-top-left-radius: 0.75rem;
                  border-top-right-radius: 0.75rem;
                  border-color: #f1f5f9;
                  background: #f8fafc;
                }
                .quill-container .ql-container {
                  border-bottom-left-radius: 0.75rem;
                  border-bottom-right-radius: 0.75rem;
                  border-color: #f1f5f9;
                  min-height: 200px;
                  font-family: inherit;
                }
                .quill-container .ql-editor {
                  min-height: 200px;
                  font-size: 0.875rem;
                }
              `}</style>
           </div>

           {/* Specifications Section */}
           <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 space-y-6">
              <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                 <Maximize2 className="h-4 w-4" /> Technical Specifications
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input 
                   placeholder="Key (e.g. Battery Life)"
                   className="h-12 rounded-xl border-slate-100"
                   value={specKey}
                   onChange={e => setSpecKey(e.target.value)}
                 />
                 <div className="flex gap-2">
                    <Input 
                      placeholder="Value (e.g. 40 Hours)"
                      className="h-12 flex-grow rounded-xl border-slate-100"
                      value={specValue}
                      onChange={e => setSpecValue(e.target.value)}
                    />
                    <Button 
                      type="button" 
                      className="h-12 w-12 rounded-xl bg-slate-900 text-white"
                      onClick={addSpec}
                    >
                       <Plus className="h-5 w-5" />
                    </Button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                 {Object.entries(product.specs).map(([k, v]) => (
                   <div key={k} className="flex items-center justify-between p-3 px-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{k}</span>
                        <span className="text-sm font-black text-slate-900">{v}</span>
                      </div>
                      <button onClick={() => removeSpec(k)} className="text-slate-300 hover:text-red-500 transition-colors">
                         <X className="h-4 w-4" />
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="space-y-8">
           {/* Media Section */}
           <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 space-y-6">
              <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                 <ImageIcon className="h-4 w-4" /> Product Media
              </h3>
              
              <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="h-12 rounded-xl border-slate-100 bg-slate-50 hover:bg-slate-100 flex items-center justify-center gap-2 text-xs font-bold"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                       <Upload className="h-4 w-4" />
                       {isUploading ? "Uploading..." : "Upload Images"}
                    </Button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      multiple
                      onChange={handleFileUpload} 
                    />
                    
                    <div className="flex gap-2">
                       <Input 
                         placeholder="Image URL..." 
                         className="h-12 rounded-xl border-slate-100 font-bold text-xs flex-grow"
                         value={imageUrl}
                         onChange={e => setImageUrl(e.target.value)}
                       />
                       <Button className="h-12 w-12 rounded-xl bg-slate-900 shrink-0" onClick={addImage}>
                          <Plus className="h-5 w-5" />
                       </Button>
                    </div>
                 </div>
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {product.images.map((img, i) => (
                      <div 
                        key={i} 
                        className="relative group h-24 rounded-xl overflow-hidden border border-slate-100 shadow-sm transition-all hover:scale-105 cursor-pointer"
                        onClick={() => setPreviewImage(img)}
                      >
                         <img src={img} alt="Product" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button 
                              variant="secondary" 
                              size="icon" 
                              className="h-8 w-8 rounded-lg bg-white/20 hover:bg-white text-white hover:text-slate-900 border-none"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewImage(img);
                              }}
                            >
                               <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              className="h-8 w-8 rounded-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(i);
                              }}
                            >
                               <Trash2 className="h-4 w-4" />
                            </Button>
                         </div>
                      </div>
                    ))}
                    {product.images.length === 0 && (
                      <div className="col-span-3 md:col-span-4 h-24 rounded-xl border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-300">
                         <span className="text-[10px] font-black uppercase">No Images</span>
                      </div>
                    )}
                 </div>
              </div>
           </div>

            {/* Attributes Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 space-y-6">
               <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" /> Inventory & Attributes
               </h3>
               
               <div className="space-y-5">
                  <div className="space-y-2 relative">
                     <Label className="text-xs font-bold text-slate-700 ml-1">Category</Label>
                     <div className="relative">
                        <Button
                          variant="outline"
                          type="button"
                          className="w-full h-12 justify-between rounded-xl bg-slate-50 border-slate-100 px-4 text-sm font-bold active:scale-95"
                          onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                        >
                          {product.category || "Select category..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>

                        {isCategoryDropdownOpen && (
                          <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl border border-slate-100 shadow-2xl z-50 overflow-hidden">
                             <div className="p-2 border-b border-slate-50">
                                <div className="relative">
                                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                   <Input 
                                     placeholder="Search category..." 
                                     className="h-9 pl-9 rounded-lg border-none bg-slate-50 text-xs focus:ring-0"
                                     value={categorySearch}
                                     onChange={e => setCategorySearch(e.target.value)}
                                   />
                                </div>
                             </div>
                             <div className="max-h-60 overflow-y-auto p-1">
                                {filteredCategories.map((c) => (
                                  <button
                                    key={c.id}
                                    className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-between group"
                                    onClick={() => {
                                      setProduct({...product, category: c.name});
                                      setIsCategoryDropdownOpen(false);
                                    }}
                                  >
                                    {c.name}
                                    {product.category === c.name && <Check className="h-3.5 w-3.5 text-emerald-500" />}
                                  </button>
                                ))}
                                {filteredCategories.length === 0 && (
                                  <div className="px-3 py-4 text-center">
                                     <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">No category found</p>
                                     <Button 
                                       size="sm" 
                                       className="h-8 rounded-lg bg-slate-900 text-white text-[10px] font-black uppercase w-full"
                                       onClick={createCategory}
                                     >
                                        Create "{categorySearch}"
                                     </Button>
                                  </div>
                                )}
                             </div>
                          </div>
                        )}
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label className="text-xs font-bold text-slate-700 ml-1">Current Stock Level</Label>
                     <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-12 w-12 rounded-xl border-slate-100 bg-slate-50 shrink-0"
                          onClick={() => adjustStock(-1)}
                        >
                           <Minus className="h-4 w-4" />
                        </Button>
                        <Input 
                          type="number"
                          className="h-12 rounded-xl border-slate-100 font-black text-center"
                          value={product.stock}
                          onChange={e => setProduct({...product, stock: parseInt(e.target.value) || 0})}
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-12 w-12 rounded-xl border-slate-100 bg-slate-50 shrink-0"
                          onClick={() => adjustStock(1)}
                        >
                           <Plus className="h-4 w-4" />
                        </Button>
                     </div>
                     <div className="flex gap-2 pt-1 overflow-x-auto no-scrollbar">
                        {[5, 10, 20].map(val => (
                          <Button 
                            key={`plus-${val}`}
                            variant="ghost" 
                            size="sm" 
                            className="h-8 flex-1 min-w-[50px] rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black border border-emerald-100 hover:bg-emerald-100"
                            onClick={() => adjustStock(val)}
                          >
                            +{val}
                          </Button>
                        ))}
                        {[5, 10, 20].map(val => (
                          <Button 
                            key={`minus-${val}`}
                            variant="ghost" 
                            size="sm" 
                            className="h-8 flex-1 min-w-[50px] rounded-lg bg-rose-50 text-rose-600 text-[10px] font-black border border-rose-100 hover:bg-rose-100"
                            onClick={() => adjustStock(-val)}
                          >
                            -{val}
                          </Button>
                        ))}
                     </div>
                  </div>

                 <div className="pt-4 space-y-4">
                    {[
                      { key: 'isFeatured', label: 'Featured Product' },
                      { key: 'isFlashSale', label: 'Flash Sale' },
                      { key: 'isNewArrival', label: 'New Arrival' },
                      { key: 'isBestSelling', label: 'Best Selling' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-2">
                         <span className="text-xs font-bold text-slate-600">{item.label}</span>
                         <label className="relative inline-flex items-center cursor-pointer">
                           <input 
                             type="checkbox" 
                             className="sr-only peer" 
                             checked={(product as any)[item.key]}
                             onChange={e => setProduct({...product, [item.key]: e.target.checked})}
                           />
                           <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00458e]"></div>
                         </label>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>

      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-transparent border-none shadow-none">
          <div className="relative group">
            <img 
              src={previewImage || ''} 
              alt="Preview" 
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl mx-auto shadow-2xl" 
              referrerPolicy="no-referrer"
            />
            <button 
              className="absolute top-4 right-4 h-10 w-10 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md hover:bg-black/70 transition-all shadow-lg"
              onClick={() => setPreviewImage(null)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAddProduct;
