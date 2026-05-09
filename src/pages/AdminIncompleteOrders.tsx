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
  const [filterPayment, setFilterPayment] = useState('All');

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
      toast.success("Order status updated successfully");
      fetchOrders();
    } else {
      toast.error("Could not update order status");
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || 
      o.customerPhone.includes(search) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesPayment = filterPayment === 'All' || o.paymentStatus === filterPayment;
    return matchesSearch && matchesPayment;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 px-3 py-1 rounded-full uppercase text-[10px] font-black tracking-widest shadow-sm">Pending</Badge>;
      case 'processing': return <Badge variant="outline" className="bg-sky-100 text-sky-700 border-sky-200 px-3 py-1 rounded-full uppercase text-[10px] font-black tracking-widest shadow-sm">Processing</Badge>;
      case 'delivered': return <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1 rounded-full uppercase text-[10px] font-black tracking-widest shadow-sm">Delivered</Badge>;
      case 'cancelled': return <Badge variant="outline" className="bg-rose-100 text-rose-700 border-rose-200 px-3 py-1 rounded-full uppercase text-[10px] font-black tracking-widest shadow-sm">Cancelled</Badge>;
      case 'shipped': return <Badge variant="outline" className="bg-violet-100 text-violet-700 border-violet-200 px-3 py-1 rounded-full uppercase text-[10px] font-black tracking-widest shadow-sm">Shipped</Badge>;
      default: return <Badge variant="outline" className="px-3 py-1 rounded-full uppercase text-[10px] font-black tracking-widest shadow-sm">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
     switch (status) {
       case 'paid': return <Badge className="bg-emerald-500 hover:bg-emerald-600 px-3 py-1 rounded-full uppercase text-[10px] font-black tracking-widest shadow-lg shadow-emerald-500/20">Paid</Badge>;
       case 'partially_paid': return <Badge className="bg-primary hover:bg-primary/90 px-3 py-1 rounded-full uppercase text-[10px] font-black tracking-widest shadow-lg shadow-primary/20">Partial</Badge>;
       case 'unpaid': return <Badge variant="destructive" className="px-3 py-1 rounded-full uppercase text-[10px] font-black tracking-widest shadow-lg shadow-destructive/20">Unpaid</Badge>;
       default: return <Badge className="px-3 py-1 rounded-full uppercase text-[10px] font-black tracking-widest shadow-sm">{status}</Badge>;
     }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-bold flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
              Incomplete Orders
           </h2>
           <p className="text-muted-foreground font-medium">Orders that are pending completion or payment</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="rounded-xl h-12 px-6 gap-2 border-primary/20 hover:bg-primary/5">
             <FileText className="h-4 w-4" /> Export Report
           </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 py-4 px-6 bg-white rounded-2xl shadow-sm border border-primary/5">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by Order ID or mobile..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl bg-secondary/20 border-none" 
          />
        </div>
        <div className="flex items-center gap-2">
           <span className="hidden sm:block text-xs font-bold text-muted-foreground uppercase">Payment:</span>
           <select 
             className="h-10 rounded-xl bg-secondary/20 border-none px-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
             value={filterPayment}
             onChange={(e) => setFilterPayment(e.target.value)}
           >
              <option value="All">All Incomplete</option>
              <option value="unpaid">Unpaid</option>
              <option value="partially_paid">Partial</option>
           </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-primary/5">
        <Table>
          <TableHeader className="bg-secondary/10 border-b">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="pl-6 font-bold text-primary uppercase text-[10px] tracking-wider">Product</TableHead>
              <TableHead className="font-bold text-primary uppercase text-[10px] tracking-wider">Order ID</TableHead>
              <TableHead className="font-bold text-primary uppercase text-[10px] tracking-wider">Date</TableHead>
              <TableHead className="font-bold text-primary uppercase text-[10px] tracking-wider">Customer</TableHead>
              <TableHead className="font-bold text-primary uppercase text-[10px] tracking-wider">Payment</TableHead>
              <TableHead className="font-bold text-primary uppercase text-[10px] tracking-wider">Status</TableHead>
              <TableHead className="font-bold text-primary uppercase text-[10px] tracking-wider">Total</TableHead>
              <TableHead className="font-bold text-primary text-right pr-6 uppercase text-[10px] tracking-wider">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((o) => (
                <TableRow key={o.id} className="hover:bg-secondary/5 transition-colors border-b border-secondary/20">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl border border-border bg-secondary flex items-center justify-center overflow-hidden shadow-sm">
                          {o.items && o.items.length > 0 ? (
                             <img 
                                src={o.items[0].images?.[0] || 'https://via.placeholder.com/48'} 
                                alt={o.items[0].name} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200';
                                }}
                             />
                          ) : (
                            <Package className="h-5 w-5 text-muted-foreground/30" />
                          )}
                        </div>
                        {o.items && o.items.length > 1 && (
                          <div className="absolute -top-2 -right-2 bg-primary text-white text-[9px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10">
                            +{o.items.length - 1}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-primary text-xs">{o.id}</TableCell>
                  <TableCell>
                    <p className="text-xs font-bold text-slate-600">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-bold text-sm text-slate-700">{o.customerName}</p>
                    <p className="text-[10px] text-muted-foreground">{o.customerPhone}</p>
                  </TableCell>
                  <TableCell>{getPaymentBadge(o.paymentStatus)}</TableCell>
                  <TableCell>{getStatusBadge(o.status)}</TableCell>
                  <TableCell className="font-black text-primary">৳ {o.total.toLocaleString()}</TableCell>
                  <TableCell className="text-right pr-6">
                    <Dialog>
                      <DialogTrigger nativeButton={true} render={
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary hover:bg-primary/5 rounded-lg">
                          <Eye className="h-4 w-4" />
                        </Button>
                      } />
                      <DialogContent className="max-w-xl rounded-3xl">
                         <DialogHeader>
                            <DialogTitle className="text-xl font-black">Order Details ({o.id})</DialogTitle>
                         </DialogHeader>
                         <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                               <div className="p-4 bg-secondary/30 rounded-2xl">
                                  <p className="text-[10px] text-muted-foreground font-black uppercase mb-2">Customer Info</p>
                                  <p className="font-bold">{o.customerName}</p>
                                  <p className="text-sm font-medium">{o.customerPhone}</p>
                               </div>
                               <div className="p-4 bg-secondary/30 rounded-2xl">
                                  <p className="text-[10px] text-muted-foreground font-black uppercase mb-2">Order Date</p>
                                  <p className="font-bold">{new Date(o.createdAt).toLocaleDateString()}</p>
                               </div>
                            </div>
                            
                            <div className="space-y-4">
                               <h4 className="font-bold text-sm uppercase text-[#666]">Update Order Status</h4>
                               <div className="flex flex-wrap gap-2">
                                  <Button 
                                    variant={o.status === 'delivered' ? 'default' : 'outline'} 
                                    size="sm" 
                                    className="rounded-xl gap-2 font-bold h-10 px-4"
                                    onClick={() => updateStatus(o.id, 'delivered')}
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Delivered
                                  </Button>
                                  <Button 
                                    variant={o.status === 'shipped' ? 'default' : 'outline'} 
                                    size="sm" 
                                    className="rounded-xl gap-2 font-bold h-10 px-4"
                                    onClick={() => updateStatus(o.id, 'shipped')}
                                  >
                                    <Truck className="h-3.5 w-3.5" /> Shipped
                                  </Button>
                                  <Button 
                                    variant={o.status === 'cancelled' ? 'default' : 'outline'} 
                                    size="sm" 
                                    className="rounded-xl gap-2 font-bold h-10 px-4 text-destructive hover:bg-destructive/10"
                                    onClick={() => updateStatus(o.id, 'cancelled')}
                                  >
                                    <XCircle className="h-3.5 w-3.5" /> Cancel
                                  </Button>
                               </div>
                            </div>
                         </div>
                         <DialogFooter>
                            <Button className="w-full h-12 rounded-xl font-bold uppercase text-xs">Print Invoice</Button>
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
                      <p className="text-muted-foreground font-medium italic">No incomplete orders found</p>
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
