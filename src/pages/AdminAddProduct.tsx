import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Save, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  X,
  PlusCircle,
  HelpCircle,
  LayoutGrid,
  Info,
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { convertGoogleDriveLink } from '@/lib/imageUtils';
import { productService } from '@/services/productService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AdminAddProduct = () => {
  const navigate = useNavigate();
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

  const addImage = () => {
    if (!imageUrl) return;
    const finalUrl = convertGoogleDriveLink(imageUrl);
    setProduct({ ...product, images: [...product.images, finalUrl] });
    setImageUrl('');
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
      const result = await productService.addProduct(payload as any);
      if (result) {
        toast.success(isDraft ? "Product saved as draft!" : "Product published successfully!");
        navigate('/admin/products');
      }
    } catch (err) {
      toast.error("Failed to save product. Check required fields.");
    }
  };

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
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Add New Product</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">List a new product in your inventory with full details.</p>
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
              <textarea 
                className="w-full h-40 rounded-xl border border-slate-100 bg-slate-50 p-6 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                placeholder="Tell your customers about the product features and quality..."
                value={product.description}
                onChange={e => setProduct({...product, description: e.target.value})}
              />
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
                 <div className="flex gap-2">
                    <Input 
                      placeholder="Image URL..." 
                      className="h-12 rounded-xl border-slate-100 font-bold"
                      value={imageUrl}
                      onChange={e => setImageUrl(e.target.value)}
                    />
                    <Button className="h-12 w-12 rounded-xl bg-slate-900" onClick={addImage}>
                       <Plus className="h-5 w-5" />
                    </Button>
                 </div>
                 
                 <div className="grid grid-cols-3 gap-3">
                    {product.images.map((img, i) => (
                      <div key={i} className="relative group h-24 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                         <img src={img} alt="Product" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                         <button 
                           onClick={() => removeImage(i)}
                           className="absolute top-1 right-1 h-6 w-6 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                            <Trash2 className="h-3 w-3" />
                         </button>
                      </div>
                    ))}
                    {product.images.length === 0 && (
                      <div className="col-span-3 h-24 rounded-xl border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-300">
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
                 <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700 ml-1">Category</Label>
                    <select 
                      className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 text-sm font-bold focus:bg-white outline-none"
                      value={product.category}
                      onChange={e => setProduct({...product, category: e.target.value})}
                    >
                       <option value="Uncategorized">Uncategorized</option>
                       <option value="Smartphones">Smartphones</option>
                       <option value="Electronics">Electronics</option>
                       <option value="Home & Decor">Home & Decor</option>
                       <option value="Fashion">Fashion</option>
                    </select>
                 </div>

                 <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700 ml-1">Current Stock Level</Label>
                    <Input 
                      type="number"
                      className="h-12 rounded-xl border-slate-100 font-black"
                      value={product.stock}
                      onChange={e => setProduct({...product, stock: parseInt(e.target.value) || 0})}
                    />
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
    </div>
  );
};

export default AdminAddProduct;
