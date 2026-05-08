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
          { status: 'অর্ডার গ্রহণ করা হয়েছে', date: new Date(order.createdAt).toLocaleString('bn-BD'), completed: true },
          { status: 'প্যাকিং চলিতেছে', date: currentIdx >= 1 ? 'সম্পন্ন' : 'অপেক্ষমাণ', completed: currentIdx >= 1 },
          { status: 'ডেলিভারির জন্য পাঠানো হয়েছে', date: currentIdx >= 2 ? 'সম্পন্ন' : 'অপেক্ষমাণ', completed: currentIdx >= 2 },
          { status: 'ডেলিভারি সম্পন্ন', date: currentIdx >= 3 ? 'সম্পন্ন' : 'অপেক্ষমাণ', completed: currentIdx >= 3 },
        ];

        setTrackingData({
          ...order,
          date: new Date(order.createdAt).toLocaleDateString('bn-BD'),
          steps
        });
      } else {
        toast.error("অর্ডারটি খুঁজে পাওয়া যায়নি।");
      }
    } catch (err) {
      toast.error("তথ্য লোড করতে সমস্যা হয়েছে।");
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
        <h1 className="text-4xl font-bold mb-4">অর্ডার ট্র্যাক করুন</h1>
        <p className="text-muted-foreground">আপনার অর্ডার আইডি ব্যবহার করে বর্তমান অবস্থা জানুন</p>
      </div>

      <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white mb-12">
        <CardContent className="p-8">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
              <Input 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="যেমন: #123456" 
                className="pl-12 h-14 rounded-2xl bg-secondary/30 border-none text-lg"
              />
            </div>
            <Button size="lg" className="h-14 px-10 rounded-2xl text-lg shadow-lg shadow-primary/20" disabled={loading}>
              {loading ? 'লোড হচ্ছে...' : 'সাবমিট'}
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
                  <Badge variant="outline" className="mb-2 bg-primary/5">অর্ডার আইডি</Badge>
                  <p className="font-bold text-xl">{trackingData.id}</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-primary/5 shadow-sm">
                <CardContent className="p-6 text-center">
                  <Badge variant="outline" className="mb-2 bg-primary/5">অর্ডার তারিখ</Badge>
                  <p className="font-bold text-xl">{trackingData.date}</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-primary/5 shadow-sm">
                <CardContent className="p-6 text-center">
                  <Badge variant="outline" className="mb-2 bg-primary/5">পেমেন্ট অবস্থা</Badge>
                  <p className="font-bold text-xl text-accent">{trackingData.paymentStatus === 'partially_paid' ? 'আংশিক পরিশোধিত' : 'পরিশোধিত'}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-3xl border-primary/5 shadow-xl p-8">
              <div className="flex justify-between items-center mb-10">
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" /> শিপিং স্ট্যাটাস
                </h3>
                <Button variant="outline" className="gap-2 rounded-xl">
                  <FileText className="h-4 w-4" /> ইনভয়েস ডাউনলোড
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
                        <Badge variant="secondary" className="w-fit bg-primary/10 text-primary">সম্পন্ন</Badge>
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
                     <p className="font-bold text-sm">সহায়তা প্রয়োজন?</p>
                     <p className="text-xs text-muted-foreground">আমাদের কাস্টমার কেয়ারে কল করুন</p>
                  </div>
               </div>
               <Button className="rounded-xl">+৮৮০১৭xxxxxxxx</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderTracking;
