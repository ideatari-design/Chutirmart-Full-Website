import React, { useState } from 'react';
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
  Search, 
  Eye,
  CheckCircle2,
  Truck,
  XCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { orderService } from '@/services/orderService';
import { Order } from '@/types';
import { toast } from 'sonner';

const AdminIncompleteOrders = () => {
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await orderService.getAllOrders();
    // Filter for incomplete orders: unpaid or partially paid and not delivered
    const incomplete = data.filter(o => 
      (o.paymentStatus === 'unpaid' || o.paymentStatus === 'partially_paid') && 
      o.status !== 'delivered' && o.status !== 'cancelled'
    );
    setOrders(incomplete);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const success = await orderService.updateOrderStatus(id, status);
    if (success) {
      toast.success("অর্ডার স্ট্যাটাস আপডেট হয়েছে");
      fetchOrders();
    } else {
      toast.error("আপডেট করা সম্ভব হয়নি");
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.customerPhone.includes(search) ||
    o.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">পেন্ডিং</Badge>;
      case 'processing': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">প্রসেসিং</Badge>;
      case 'delivered': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">ডেলিভারড</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
     switch (status) {
       case 'paid': return <Badge className="bg-green-500 hover:bg-green-600">পরিশোধিত</Badge>;
       case 'partially_paid': return <Badge className="bg-accent hover:bg-accent/90">আংশিক</Badge>;
       case 'unpaid': return <Badge variant="destructive">বাকি</Badge>;
       default: return <Badge>{status}</Badge>;
     }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-bold flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
              অসম্পূর্ণ অর্ডারসমূহ
           </h2>
           <p className="text-muted-foreground font-medium">যেসব অর্ডার এখনও সম্পন্ন হয়নি বা পেমেন্ট বাকি আছে</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="rounded-xl h-12 px-6 gap-2 border-primary/20 hover:bg-primary/5">
             <FileText className="h-4 w-4" /> রিপোর্ট এক্সপোর্ট
           </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 py-4 px-6 bg-white rounded-2xl shadow-sm border border-primary/5">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="অর্ডার আইডি বা মোবাইল দিয়ে খুঁজুন..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl bg-secondary/20 border-none" 
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-primary/5">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="pl-6 font-bold text-primary">অর্ডার আইডি</TableHead>
              <TableHead className="font-bold text-primary">কাস্টমার</TableHead>
              <TableHead className="font-bold text-primary">পেমেন্ট</TableHead>
              <TableHead className="font-bold text-primary">স্টেটাস</TableHead>
              <TableHead className="font-bold text-primary">মোট মূল্য</TableHead>
              <TableHead className="font-bold text-primary text-right pr-6">অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((o) => (
                <TableRow key={o.id} className="hover:bg-secondary/10 transition-colors border-b-primary/5">
                  <TableCell className="pl-6 font-bold text-primary">{o.id}</TableCell>
                  <TableCell>
                    <p className="font-bold text-sm">{o.customerName}</p>
                    <p className="text-xs text-muted-foreground">{o.customerPhone}</p>
                  </TableCell>
                  <TableCell>{getPaymentBadge(o.paymentStatus)}</TableCell>
                  <TableCell>{getStatusBadge(o.status)}</TableCell>
                  <TableCell className="font-bold">৳ {o.total.toLocaleString()}</TableCell>
                  <TableCell className="text-right pr-6">
                    <Dialog>
                      <DialogTrigger render={
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary hover:bg-primary/5 rounded-lg">
                          <Eye className="h-4 w-4" />
                        </Button>
                      } />
                      <DialogContent className="max-w-xl rounded-3xl">
                         <DialogHeader>
                            <DialogTitle className="text-xl font-black">অর্ডার বিস্তারিত ({o.id})</DialogTitle>
                         </DialogHeader>
                         <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                               <div className="p-4 bg-secondary/30 rounded-2xl">
                                  <p className="text-[10px] text-muted-foreground font-black uppercase mb-2">কাস্টমার তথ্য</p>
                                  <p className="font-bold">{o.customerName}</p>
                                  <p className="text-sm font-medium">{o.customerPhone}</p>
                               </div>
                               <div className="p-4 bg-secondary/30 rounded-2xl">
                                  <p className="text-[10px] text-muted-foreground font-black uppercase mb-2">অর্ডার তারিখ</p>
                                  <p className="font-bold">{new Date(o.createdAt).toLocaleDateString('bn-BD')}</p>
                               </div>
                            </div>
                            
                            <div className="space-y-4">
                               <h4 className="font-bold text-sm uppercase text-[#666]">অর্ডার স্ট্যাটাস আপডেট করুন</h4>
                               <div className="flex flex-wrap gap-2">
                                  <Button 
                                    variant={o.status === 'delivered' ? 'default' : 'outline'} 
                                    size="sm" 
                                    className="rounded-xl gap-2 font-bold h-10 px-4"
                                    onClick={() => updateStatus(o.id, 'delivered')}
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5" /> ডেলিভারড
                                  </Button>
                                  <Button 
                                    variant={o.status === 'shipped' ? 'default' : 'outline'} 
                                    size="sm" 
                                    className="rounded-xl gap-2 font-bold h-10 px-4"
                                    onClick={() => updateStatus(o.id, 'shipped')}
                                  >
                                    <Truck className="h-3.5 w-3.5" /> শিপিং
                                  </Button>
                                  <Button 
                                    variant={o.status === 'cancelled' ? 'default' : 'outline'} 
                                    size="sm" 
                                    className="rounded-xl gap-2 font-bold h-10 px-4 text-destructive hover:bg-destructive/10"
                                    onClick={() => updateStatus(o.id, 'cancelled')}
                                  >
                                    <XCircle className="h-3.5 w-3.5" /> ক্যানসেল
                                  </Button>
                               </div>
                            </div>
                         </div>
                         <DialogFooter>
                            <Button className="w-full h-12 rounded-xl font-bold uppercase text-xs">ইনভয়েস প্রিন্ট করুন</Button>
                         </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-20 text-center">
                   <div className="flex flex-col items-center gap-3">
                      <AlertCircle className="h-12 w-12 text-muted-foreground opacity-20" />
                      <p className="text-muted-foreground font-medium italic">কোন অসম্পূর্ণ অর্ডার পাওয়া যায়নি</p>
                   </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminIncompleteOrders;
