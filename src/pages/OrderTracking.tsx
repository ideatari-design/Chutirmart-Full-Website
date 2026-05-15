import React, { useState } from 'react';
import { Search, Package, MapPin, Clock, CheckCircle2, ChevronRight, FileText, Headset, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'motion/react';

import { orderService } from '@/services/orderService';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [loadingHot, setLoadingHot] = useState(true);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    if (searchParams.get('id')) {
      const id = searchParams.get('id');
      if (id) handleTrackById(id);
    }
    
    // Fetch hot products
    const fetchHot = async () => {
      setLoadingHot(true);
      const products = await productService.getFeaturedProducts();
      setHotProducts(products.slice(0, 4));
      setLoadingHot(false);
    };
    fetchHot();
  }, [searchParams]);

  const handleTrackById = async (id: string) => {
    setLoading(true);
    setTrackingData(null);
    try {
      const order = await orderService.getOrderById(id);
      if (order) {
        // Derive steps from status
        const statuses = ['pending', 'processing', 'shipped', 'delivered'];
        const currentIdx = statuses.indexOf(order.status);
        
        const steps = [
          { status: 'Order Accepted', date: new Date(order.createdAt).toLocaleString(), completed: true },
          { status: 'Packing in Progress', date: currentIdx >= 1 ? 'Completed' : 'Pending', completed: currentIdx >= 1 },
          { status: 'In Transit', date: currentIdx >= 2 ? 'Completed' : 'Pending', completed: currentIdx >= 2 },
          { status: 'Delivered', date: currentIdx >= 3 ? 'Completed' : 'Pending', completed: currentIdx >= 3 },
        ];

        setTrackingData({
          ...order,
          date: new Date(order.createdAt).toLocaleDateString(),
          steps
        });
      } else {
        toast.error("Order not found.");
      }
    } catch (err) {
      toast.error("Error loading order data.");
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    handleTrackById(orderId);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
            <Package className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-black mb-4">Thank You for Your Order!</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            We appreciate your business. Your order is being processed with priority. 
            Expect delivery within <span className="text-foreground font-bold italic">24 hours</span> inside Dhaka and 
            <span className="text-foreground font-bold italic"> 2-3 days</span> outside Dhaka.
          </p>
          <Button 
            onClick={() => navigate('/products')}
            className="rounded-xl h-14 px-8 font-bold gap-2 text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all"
          >
            <ShoppingBag className="h-5 w-5" />
            Continue Shopping & Go to Store
          </Button>
        </div>

        <Card className="border-none shadow-xl rounded-xl md:rounded-3xl overflow-hidden bg-white mb-12">
          <CardContent className="p-8">
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                <Input 
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. #123456" 
                  className="pl-12 h-14 rounded-xl bg-secondary/30 border-none text-lg"
                />
              </div>
              <Button size="lg" className="h-14 px-10 rounded-xl text-lg shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? 'Loading...' : 'Submit'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <AnimatePresence>
          {trackingData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-xl md:rounded-2xl border-primary/5 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <Badge variant="outline" className="mb-2 bg-primary/5">Order ID</Badge>
                    <p className="font-bold text-xl">{trackingData.id}</p>
                  </CardContent>
                </Card>
                <Card className="rounded-xl md:rounded-2xl border-primary/5 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <Badge variant="outline" className="mb-2 bg-primary/5">Order Date</Badge>
                    <p className="font-bold text-xl">{trackingData.date}</p>
                  </CardContent>
                </Card>
                <Card className="rounded-xl md:rounded-2xl border-primary/5 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <Badge variant="outline" className="mb-2 bg-primary/5">Payment Status</Badge>
                    <p className="font-bold text-xl text-accent">
                      {trackingData.paymentStatus === 'partially_paid' ? 'Partially Paid' : 
                       trackingData.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="rounded-xl md:rounded-3xl border-primary/5 shadow-xl p-8">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="font-bold text-xl flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" /> Shipping Status
                  </h3>
                  <Button variant="outline" className="gap-2 rounded-lg md:rounded-xl">
                    <FileText className="h-4 w-4" /> Download Invoice
                  </Button>
                </div>

                <div className="relative space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-muted">
                  {trackingData.steps.map((step: any, i: number) => (
                    <div key={i} className="relative pl-10">
                      <div className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white z-10 ${step.completed ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                        {step.completed ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-3 w-3" />}
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div>
                          <p className={`font-bold ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>{step.status}</p>
                          <p className="text-xs text-muted-foreground mt-1">{step.date}</p>
                        </div>
                        {step.completed && (
                          <Badge variant="secondary" className="w-fit bg-primary/10 text-primary">Completed</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="p-6 bg-secondary/50 rounded-xl md:rounded-2xl flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-white rounded-lg md:rounded-xl shadow-sm flex items-center justify-center">
                       <Headset className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                       <p className="font-bold text-sm">Need Help?</p>
                       <p className="text-xs text-muted-foreground">Call our customer support</p>
                    </div>
                 </div>
                 <Button className="rounded-lg md:rounded-xl">+8801700000000</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hot Selling Products Section */}
      <section className="mt-16 md:mt-32 py-24 bg-white border-t">
        <div className="max-w-[1140px] mx-auto px-0 sm:px-4">
          <div className="flex flex-col md:flex-row justify-between items-center sm:items-end mb-16 md:mb-20 gap-8 px-4 sm:px-0 text-center sm:text-left">
            <div className="space-y-4 sm:space-y-2">
              <div className="flex justify-center sm:justify-start">
                <Badge className="bg-accent text-white border-none px-4 py-1 rounded-lg md:rounded-full text-[10px] font-black uppercase tracking-widest">
                  Top Recommendations
                </Badge>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-foreground">Hot Selling Product Guru</h2>
              <p className="text-muted-foreground font-medium">Don't miss out on our most popular items today!</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/products')}
              className="group font-bold text-primary gap-2 hover:bg-primary/5 rounded-lg md:rounded-xl pr-2 w-full sm:w-auto justify-center sm:justify-start transition-all"
            >
              Explore More Products
              <div className="h-10 w-10 rounded-lg md:rounded-xl bg-primary text-white flex items-center justify-center group-hover:translate-x-1 transition-transform hidden sm:flex">
                <ArrowRight className="h-5 w-5" />
              </div>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 px-4 sm:px-0">
            {loadingHot ? (
              [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
            ) : (
              hotProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
          
          <div className="mt-16 md:mt-24 text-center px-4 sm:px-0">
             <Button 
               variant="outline" 
               size="lg"
               onClick={() => navigate('/products')}
               className="h-14 md:h-20 px-10 md:px-16 rounded-xl md:rounded-[2rem] border-2 font-black text-base md:text-xl gap-4 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-xl w-full sm:w-auto"
             >
               <ShoppingBag className="h-6 w-6 md:h-8 md:w-8" />
               Visit Full Shop Again
             </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderTracking;
