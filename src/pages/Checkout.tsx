import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { 
  CreditCard, 
  MapPin, 
  Phone, 
  User, 
  ChevronRight, 
  Wallet,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

import { orderService } from '@/services/orderService';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [deliveryArea, setDeliveryArea] = useState<'inside' | 'outside'>('inside');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash'>('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const deliveryCharge = deliveryArea === 'inside' ? 80 : 130;
  const grandTotal = cartTotal + deliveryCharge;

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("অনুগ্রহ করে সব তথ্য পূরণ করুন");
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
        toast.success("আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!");
        clearCart();
        navigate(`/track?id=${order.id.replace('#', '')}`);
      }
    } catch (err) {
      toast.error("অর্ডার করতে সমস্যা হচ্ছে, আবার চেষ্টা করুন।");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
        <PackageCheck className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold">আপনার কার্ট খালি</h2>
      <Button onClick={() => navigate('/catalog')}>কেনাকাটা করুন</Button>
    </div>
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      <div className="max-w-[1240px] mx-auto px-4 pt-8 md:pt-20">
        <header className="flex items-center gap-4 mb-8 md:mb-12">
           <button 
             onClick={() => navigate(-1)}
             className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
           >
             <ChevronRight className="rotate-180 h-4 w-4 md:h-5 md:w-5" />
           </button>
           <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Checkout</h1>
        </header>

        <form onSubmit={handleOrder} className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-8 md:gap-12 items-start">
          {/* Main Info */}
          <div className="space-y-10 md:space-y-12">
            
            {/* Contact Information */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold">1</span>
                <h2 className="text-xl font-bold text-slate-800">Contact Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-slate-100">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase ml-1">আপনারা নাম লিখুন</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#00458F] transition-colors" />
                    <Input 
                      placeholder="মুবিন আহমেদ" 
                      className="pl-12 h-14 rounded-xl border-slate-200 focus:border-[#00458F] focus:ring-4 focus:ring-[#00458F]/10 transition-all bg-slate-50/30" 
                      value={formData.name}
                      onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase ml-1">আপনার মোবাইল নাম্বার লিখুন</Label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#00458F] transition-colors" />
                    <Input 
                      placeholder="017XXXXXXXX" 
                      className="pl-12 h-14 rounded-xl border-slate-200 focus:border-[#00458F] focus:ring-4 focus:ring-[#00458F]/10 transition-all bg-slate-50/30" 
                      value={formData.phone}
                      onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
                      required 
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase ml-1">আপনার সম্পূন্য ঠিকানা লিখুন</Label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#00458F] transition-colors" />
                    <Input 
                      placeholder="বাসা নং, রোড নং, এলাকা ও জেলা" 
                      className="pl-12 h-14 rounded-xl border-slate-200 focus:border-[#00458F] focus:ring-4 focus:ring-[#00458F]/10 transition-all bg-slate-50/30" 
                      value={formData.address}
                      onChange={e => setFormData(f => ({ ...f, address: e.target.value }))}
                      required 
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Delivery Method */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold">2</span>
                <h2 className="text-xl font-bold text-slate-800">Delivery Method</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div 
                   onClick={() => setDeliveryArea('inside')}
                   className={`relative p-5 sm:p-6 rounded-[1.5rem] sm:rounded-3xl border-2 transition-all cursor-pointer flex flex-col gap-4 bg-white shadow-sm ${deliveryArea === 'inside' ? 'border-[#00458F] bg-[#00458F]/5' : 'border-slate-100'}`}
                 >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${deliveryArea === 'inside' ? 'bg-[#00458F] text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">ঢাকার ভিতরে</h4>
                      <p className="text-sm text-slate-500">হোম ডেলিভারি</p>
                    </div>
                    <div className="mt-2 text-xl font-bold text-[#00458F]">৳ ৮০</div>
                    {deliveryArea === 'inside' && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-[#00458F] rounded-full flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      </div>
                    )}
                 </div>

                 <div 
                   onClick={() => setDeliveryArea('outside')}
                   className={`relative p-5 sm:p-6 rounded-[1.5rem] sm:rounded-3xl border-2 transition-all cursor-pointer flex flex-col gap-4 bg-white shadow-sm ${deliveryArea === 'outside' ? 'border-[#00458F] bg-[#00458F]/5' : 'border-slate-100'}`}
                 >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${deliveryArea === 'outside' ? 'bg-[#00458F] text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">ঢাকার বাহিরে</h4>
                      <p className="text-sm text-slate-500">কুরিয়ার ডেলিভারি</p>
                    </div>
                    <div className="mt-2 text-xl font-bold text-[#00458F]">৳ ১৩০</div>
                    {deliveryArea === 'outside' && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-[#00458F] rounded-full flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      </div>
                    )}
                 </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold">3</span>
                <h2 className="text-xl font-bold text-slate-800">Payment Method</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 shadow-sm">
                 <button 
                   type="button"
                   onClick={() => setPaymentMethod('cod')}
                   className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'cod' ? 'border-[#00458F] bg-[#00458F]/5' : 'border-slate-100 hover:border-slate-200'}`}
                 >
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${paymentMethod === 'cod' ? 'bg-[#00458F] text-white shadow-lg shadow-[#00458F]/20' : 'bg-slate-100 text-slate-400'}`}>
                      <PackageCheck className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <span className="font-bold text-slate-800 text-sm md:text-base">Cash on Delivery</span>
                 </button>

                 <button 
                   type="button"
                   disabled
                   className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 opacity-50 cursor-not-allowed bg-slate-50"
                 >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                      <Wallet className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <span className="font-bold text-slate-800 text-sm md:text-base">Bkash (Soon)</span>
                 </button>
              </div>
            </section>
          </div>

          {/* Sidebar: Order Summary */}
          <aside className="lg:sticky lg:top-28">
            <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
               <div className="p-6 md:p-8 pb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 md:mb-8">Order</h3>
                  
                  <div className="space-y-4 md:space-y-6 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                    {cart.map(item => (
                      <div key={item.id} className="group relative flex gap-4 md:gap-5 bg-slate-50 p-3 md:p-4 rounded-2xl md:rounded-3xl border border-transparent hover:border-slate-200 transition-all">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden bg-white border border-slate-100 p-2 shrink-0">
                          <img src={item.images[0]} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col justify-between py-1">
                          <div className="space-y-1">
                             <h4 className="font-medium text-slate-900 text-sm md:text-base leading-tight line-clamp-2">{item.name}</h4>
                             <p className="text-[10px] md:text-xs text-slate-400 font-bold">QTY: {item.quantity}</p>
                          </div>
                          <div className="text-lg md:text-xl font-bold text-[#00458F]">
                             ৳ {(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="p-6 md:p-8 pt-4 md:pt-6 space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs md:text-sm font-medium text-slate-500 uppercase">
                      <span>Subtotal</span>
                      <span className="text-slate-900">৳ {cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm font-medium text-slate-500 uppercase">
                      <span>Shipping</span>
                      <span className="text-slate-900">৳ {deliveryCharge.toLocaleString()}</span>
                    </div>
                  </div>

                  <Separator className="bg-slate-100" />

                  <div className="flex justify-between items-baseline">
                    <span className="text-base md:text-lg font-bold text-slate-500 uppercase">Total</span>
                    <span className="text-[25px] font-bold text-slate-900">৳ {grandTotal.toLocaleString()}</span>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 md:h-16 bg-[#00458F] hover:opacity-90 text-white rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-xl shadow-[#00458F]/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        PROCESSING...
                      </span>
                    ) : (
                      <>
                        Checkout <ChevronRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] text-slate-500 font-medium leading-relaxed">
                    <ShieldCheck className="h-4 w-4 text-[#00458F] shrink-0" />
                    <span>অর্ডার কনফার্ম করার মাধ্যমে আপনি আমাদের শর্তাবলীর সাথে একমত হতে সম্মত হচ্ছেন।</span>
                  </div>
               </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
