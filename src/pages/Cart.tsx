import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ShoppingBag, 
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  BadgeCheck,
  User,
  Phone,
  MapPin,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { orderService } from '@/services/orderService';
import { toast } from 'sonner';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, itemCount, clearCart } = useCart();
  const navigate = useNavigate();

  const deliveryCharge = 80;
  const grandTotal = cartTotal + (cart.length > 0 ? deliveryCharge : 0);

  const [isCheckoutMode, setIsCheckoutMode] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    address: ''
  });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("Please fill in all required information");
      return;
    }

    setIsProcessing(true);
    try {
      const order = await orderService.createOrder({
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        items: cart,
        total: grandTotal,
        deposit: 0,
        status: 'pending',
        paymentStatus: 'unpaid'
      });

      if (order) {
        toast.success("Order placed successfully!");
        clearCart();
        navigate(`/track?id=${order.id.replace('#', '')}`);
      }
    } catch (err) {
      toast.error("Order failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12 md:py-20">
      <div className="max-w-[1140px] mx-auto px-4">
        <h1 className="text-4xl font-black text-slate-900 mb-12 flex items-center gap-4">
          {isCheckoutMode ? "Confirm Order Details" : "Shopping Cart"}
          <span className="text-lg font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{itemCount}</span>
        </h1>

        {cart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-12 md:p-20 text-center border border-slate-100 shadow-sm"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="h-10 w-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
            <p className="text-slate-500 mb-10 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet. Explore our latest products and find something you love!</p>
            <Link to="/products">
              <Button className="h-14 px-12 rounded-2xl font-bold bg-[#00458f] hover:opacity-90 shadow-xl shadow-[#00458f]/20 transition-all hover:scale-[1.02]">
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
            {/* Cart Items */}
            <div className="space-y-6">
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="hidden md:grid grid-cols-[1fr_120px_150px_120px] gap-4 p-6 border-b text-[10px] font-black uppercase text-slate-400">
                  <span>Product</span>
                  <span className="text-center">Price</span>
                  <span className="text-center">Quantity</span>
                  <span className="text-right">Total</span>
                </div>

                <div className="divide-y divide-slate-50">
                  <AnimatePresence initial={false}>
                    {cart.map((item) => (
                      <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-6 grid grid-cols-1 md:grid-cols-[1fr_120px_150px_120px] gap-6 items-center group relative"
                      >
                        {/* Product Info */}
                        <div className="flex gap-6 items-center min-w-0">
                          <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                            <Link to={`/product/${item.id}`}>
                              <img 
                                src={item.images[0]} 
                                alt={item.name} 
                                className="w-full h-full object-cover" 
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200';
                                }}
                              />
                            </Link>
                          </div>
                          <div className="min-w-0 flex-grow">
                            <Link to={`/product/${item.id}`} className="hover:text-[#00458f] transition-colors">
                              <h3 className="font-bold text-slate-900 leading-tight mb-1 line-clamp-2">{item.name}</h3>
                            </Link>
                            <p className="text-[10px] font-black uppercase text-slate-400">{item.category}</p>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase"
                            >
                              <Trash2 className="h-3 w-3" />
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="hidden md:flex justify-center font-bold text-slate-600">
                           ৳ {item.price.toLocaleString()}
                        </div>

                        {/* Quantity */}
                        <div className="flex justify-center">
                          <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                             <Button 
                               variant="ghost" 
                               size="icon" 
                               className="h-8 w-8 rounded-lg hover:bg-white hover:text-red-500 transition-all"
                               onClick={() => updateQuantity(item.id, item.quantity - 1)}
                             >
                               <Minus className="h-3 w-3" />
                             </Button>
                             <span className="w-10 text-center font-black text-sm">{item.quantity}</span>
                             <Button 
                               variant="ghost" 
                               size="icon" 
                               className="h-8 w-8 rounded-lg hover:bg-white hover:text-[#00458f] transition-all"
                               onClick={() => updateQuantity(item.id, item.quantity + 1)}
                             >
                               <Plus className="h-3 w-3" />
                             </Button>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="text-right font-black text-[#00458f] text-lg">
                           <span className="md:hidden text-xs text-slate-400 font-bold mr-2 uppercase">Total:</span>
                           ৳ {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Security & Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { icon: <Truck className="h-5 w-5 text-[#00458f]" />, title: "Free Shipping", desc: "For all orders over ৳5000" },
                   { icon: <RotateCcw className="h-5 w-5 text-[#00458f]" />, title: "Easy Returns", desc: "7 days return policy" },
                   { icon: <BadgeCheck className="h-5 w-5 text-[#00458f]" />, title: "Genuine Products", desc: "100% verified quality" }
                 ].map((feat, i) => (
                   <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4 group">
                      <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                         {feat.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase leading-none mb-1">{feat.title}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{feat.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            {/* Summary Sidebar */}
            <aside className="lg:sticky lg:top-28">
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-400 uppercase">Subtotal</span>
                      <span className="font-bold text-slate-900">৳ {cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-400 uppercase">Shipping</span>
                      <span className="font-bold text-slate-900">৳ {deliveryCharge.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {isCheckoutMode && (
                    <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-top-4 duration-500">
                       <h4 className="text-sm font-black uppercase text-slate-900 border-b pb-4">Checkout Information</h4>
                       <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Your Name</Label>
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                              <Input 
                                placeholder="Enter full name" 
                                className="h-12 pl-12 rounded-xl bg-slate-50 border-none"
                                value={formData.name}
                                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Phone Number</Label>
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                              <Input 
                                placeholder="017XXXXXXXX" 
                                className="h-12 pl-12 rounded-xl bg-slate-50 border-none"
                                value={formData.phone}
                                onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Shipping Address</Label>
                            <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                              <Input 
                                placeholder="House, Road, Area..." 
                                className="h-12 pl-12 rounded-xl bg-slate-50 border-none"
                                value={formData.address}
                                onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                              />
                            </div>
                          </div>
                       </div>
                    </div>
                  )}

                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-black text-slate-400 uppercase">Total Amount</span>
                    <span className="text-[28px] font-black text-slate-900 leading-none">৳ {grandTotal.toLocaleString()}</span>
                  </div>

                  <div className="space-y-4">
                    {!isCheckoutMode ? (
                      <Button 
                        onClick={() => setIsCheckoutMode(true)}
                        className="h-16 w-full text-sm font-black uppercase rounded-2xl bg-[#00458f] text-white shadow-xl shadow-[#00458f]/20 hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        Proceed to Checkout
                      </Button>
                    ) : (
                      <Button 
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="h-16 w-full text-sm font-black uppercase rounded-2xl bg-[#00458f] text-white shadow-xl shadow-[#00458f]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Placing Order...
                          </>
                        ) : (
                          <>Confirm Order Now</>
                        )}
                      </Button>
                    )}
                    
                    {isCheckoutMode && (
                      <Button 
                        variant="ghost" 
                        onClick={() => setIsCheckoutMode(false)}
                        className="w-full text-xs font-bold uppercase text-slate-400"
                        disabled={isProcessing}
                      >
                        Back to Cart
                      </Button>
                    )}

                    {!isCheckoutMode && (
                      <Link to="/products" className="block w-full">
                        <Button variant="outline" className="h-14 w-full text-xs font-bold uppercase rounded-2xl border-2 hover:bg-slate-50 transition-all">
                          Continue Shopping
                        </Button>
                      </Link>
                    )}
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] text-slate-500 font-medium">
                    <ShieldCheck className="h-4 w-4 text-[#00458f] shrink-0" />
                    <span>Your transaction is secured with 256-bit SSL encryption for a safe shopping experience.</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
