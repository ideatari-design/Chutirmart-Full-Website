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
    <div className="space-y-8 pb-20">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
             Incomplete Orders
             <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-600 text-[10px] font-bold border border-red-100">Review Required</span>
          </h1>
          <Button variant="outline" className="h-10 rounded-lg text-xs font-bold flex items-center gap-2">
             <FileText className="h-4 w-4" /> Export Report
          </Button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
             <div className="flex items-center">
                <select 
                  className="h-10 px-4 pr-10 border border-slate-200 rounded-lg text-sm font-medium bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                >
                  <option value="All">All Incomplete</option>
                  <option value="unpaid">Unpaid Only</option>
                  <option value="partially_paid">Partial Only</option>
                </select>
                <div className="pointer-events-none -ml-8 flex items-center px-2 text-slate-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
                <Button className="h-10 ml-3 bg-[#00458e] hover:bg-blue-800 text-white px-6 rounded-lg font-semibold text-xs">Filter</Button>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Order ID / Customer..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 w-[300px] border-slate-200 rounded-lg text-sm bg-white" 
                />
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden border border-red-100 shadow-sm shadow-red-900/5">
        <Table>
          <TableHeader className="bg-red-50/30">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="pl-6 w-12"><div className="w-4 h-4 border border-red-200 rounded bg-red-50"></div></TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Product</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Order ID</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Customer</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Payment</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Status</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Total</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600 text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((o) => (
                <TableRow key={o.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 h-20">
                  <TableCell className="pl-6"><div className="w-4 h-4 border border-slate-200 rounded"></div></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg border border-slate-100 bg-slate-50 overflow-hidden shadow-sm flex items-center justify-center">
                          {o.items && o.items.length > 0 ? (
                             <img 
                                src={o.items[0].images?.[0] || 'https://via.placeholder.com/48'} 
                                alt={o.items[0].name} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                             />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-slate-300" />
                          )}
                        </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-bold text-[#00458e] tracking-tight">{o.id}</span>
                      <span className="text-[11px] text-slate-400 font-medium">{new Date(o.createdAt).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold text-slate-900">{o.customerName}</span>
                      <span className="text-[11px] text-slate-500 font-medium">{o.customerPhone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      o.paymentStatus === 'paid' ? 'bg-green-50 text-[#0db39e]' : 
                      o.paymentStatus === 'partially_paid' ? 'bg-blue-50 text-[#00458e]' : 
                      'bg-red-50 text-red-600'
                    }`}>
                      {o.paymentStatus.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase border border-slate-200">
                      {o.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-[13px] font-bold text-slate-900 underline decoration-[#0db39e]/30 decoration-2 underline-offset-4">
                      ৳ {o.total.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Dialog>
                      <DialogTrigger nativeButton={true} render={
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#00458e] hover:bg-blue-50">
                          <Eye className="h-4 w-4" />
                        </Button>
                      } />
                      <DialogContent className="max-w-xl rounded-xl border-none shadow-2xl">
                         <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-slate-900">Order Context ({o.id})</DialogTitle>
                         </DialogHeader>
                         <div className="space-y-8 py-6">
                            <div className="grid grid-cols-2 gap-6">
                               <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Customer Details</p>
                                  <p className="font-bold text-slate-900">{o.customerName}</p>
                                  <p className="text-sm font-medium text-slate-600">{o.customerPhone}</p>
                                </div>
                                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Order Summary</p>
                                   <p className="text-lg font-black text-[#00458e]">৳ {o.total.toLocaleString()}</p>
                                   <p className="text-xs text-slate-500 font-medium">{new Date(o.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                               <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-widest px-1">Update Status</h4>
                               <div className="grid grid-cols-3 gap-3">
                                  <Button 
                                    variant="outline"
                                    className="rounded-lg h-24 flex flex-col gap-2 hover:border-[#0db39e] hover:text-[#0db39e] hover:bg-green-50 transition-all font-bold"
                                    onClick={() => updateStatus(o.id, 'delivered')}
                                  >
                                    <CheckCircle2 className="h-6 w-6" /> 
                                    <span className="text-[10px] uppercase">Delivered</span>
                                  </Button>
                                  <Button 
                                    variant="outline"
                                    className="rounded-lg h-24 flex flex-col gap-2 hover:border-[#00458e] hover:text-[#00458e] hover:bg-blue-50 transition-all font-bold"
                                    onClick={() => updateStatus(o.id, 'shipped')}
                                  >
                                    <Truck className="h-6 w-6" />
                                    <span className="text-[10px] uppercase">Shipped</span>
                                  </Button>
                                  <Button 
                                    variant="outline"
                                    className="rounded-lg h-24 flex flex-col gap-2 hover:border-red-600 hover:text-red-600 hover:bg-red-50 transition-all font-bold"
                                    onClick={() => updateStatus(o.id, 'cancelled')}
                                  >
                                    <XCircle className="h-6 w-6" />
                                    <span className="text-[10px] uppercase">Cancel</span>
                                  </Button>
                               </div>
                            </div>
                         </div>
                         <DialogFooter className="flex gap-3">
                            <Button variant="outline" className="h-10 rounded-lg text-xs font-bold w-full">Print Invoice</Button>
                            <Button className="h-10 rounded-lg bg-[#00458e] text-white text-xs font-bold px-8 w-full">Mark as Complete</Button>
                         </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="py-32 text-center">
                   <div className="flex flex-col items-center gap-4 max-w-xs mx-auto">
                      <div className="p-4 bg-slate-50 rounded-full">
                        <AlertCircle className="h-10 w-10 text-slate-200" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-slate-900 font-bold">No Incomplete Orders</h4>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">Everything looks healthy! Use filters to see other statuses if needed.</p>
                      </div>
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
