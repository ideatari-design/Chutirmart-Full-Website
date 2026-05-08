import React, { useState } from 'react';
import { Search, Package, MapPin, Clock, CheckCircle2, ChevronRight, FileText, Headset } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'motion/react';

import { orderService } from '@/services/orderService';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    if (searchParams.get('id')) {
      const id = searchParams.get('id');
      if (id) handleTrackById(id.startsWith('#') ? id : `#${id}`);
    }
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
    handleTrackById(orderId.startsWith('#') ? orderId : `#${orderId}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Track Your Order</h1>
        <p className="text-muted-foreground">Enter your Order ID to see the status</p>
      </div>

      <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white mb-12">
        <CardContent className="p-8">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
              <Input 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. #123456" 
                className="pl-12 h-14 rounded-2xl bg-secondary/30 border-none text-lg"
              />
            </div>
            <Button size="lg" className="h-14 px-10 rounded-2xl text-lg shadow-lg shadow-primary/20" disabled={loading}>
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
              <Card className="rounded-2xl border-primary/5 shadow-sm">
                <CardContent className="p-6 text-center">
                  <Badge variant="outline" className="mb-2 bg-primary/5">Order ID</Badge>
                  <p className="font-bold text-xl">{trackingData.id}</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-primary/5 shadow-sm">
                <CardContent className="p-6 text-center">
                  <Badge variant="outline" className="mb-2 bg-primary/5">Order Date</Badge>
                  <p className="font-bold text-xl">{trackingData.date}</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-primary/5 shadow-sm">
                <CardContent className="p-6 text-center">
                  <Badge variant="outline" className="mb-2 bg-primary/5">Payment Status</Badge>
                  <p className="font-bold text-xl text-accent">
                    {trackingData.paymentStatus === 'partially_paid' ? 'Partially Paid' : 
                     trackingData.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-3xl border-primary/5 shadow-xl p-8">
              <div className="flex justify-between items-center mb-10">
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" /> Shipping Status
                </h3>
                <Button variant="outline" className="gap-2 rounded-xl">
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

            <div className="p-6 bg-secondary/50 rounded-2xl flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                     <Headset className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                     <p className="font-bold text-sm">Need Help?</p>
                     <p className="text-xs text-muted-foreground">Call our customer support</p>
                  </div>
               </div>
               <Button className="rounded-xl">+88017XXXXXXXX</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderTracking;
