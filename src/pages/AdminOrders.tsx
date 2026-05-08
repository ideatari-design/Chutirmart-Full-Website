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
  ExternalLink, 
  Eye,
  CheckCircle2,
  Truck,
  XCircle,
  FileText,
  Package
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
import AdminPagination from '@/components/AdminPagination';

const AdminOrders = () => {
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filterStatus, setFilterStatus] = useState('All');

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await orderService.getAllOrders();
    setOrders(data);
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
    const matchesStatus = filterStatus === 'All' || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses = ['All', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 uppercase text-[10px] font-bold">Pending</Badge>;
      case 'processing': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 uppercase text-[10px] font-bold">Processing</Badge>;
      case 'delivered': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 uppercase text-[10px] font-bold">Delivered</Badge>;
      case 'cancelled': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 uppercase text-[10px] font-bold">Cancelled</Badge>;
      case 'shipped': return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 uppercase text-[10px] font-bold">Shipped</Badge>;
      default: return <Badge variant="outline" className="uppercase text-[10px] font-bold">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
     switch (status) {
       case 'paid': return <Badge className="bg-green-500 hover:bg-green-600 uppercase text-[10px] font-bold">Paid</Badge>;
       case 'partially_paid': return <Badge className="bg-accent hover:bg-accent/90 uppercase text-[10px] font-bold">Partial</Badge>;
       case 'unpaid': return <Badge variant="destructive" className="uppercase text-[10px] font-bold">Unpaid</Badge>;
       default: return <Badge className="uppercase text-[10px] font-bold">{status}</Badge>;
     }
  };

  return (
    <div className="space-y-6">
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
           <span className="hidden sm:block text-xs font-bold text-muted-foreground uppercase">Status:</span>
           <select 
             className="h-10 rounded-xl bg-secondary/20 border-none px-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
             value={filterStatus}
             onChange={(e) => setFilterStatus(e.target.value)}
           >
              {statuses.map(s => (
                 <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
           </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-primary/5">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="pl-6 font-bold text-primary">Order ID</TableHead>
              <TableHead className="font-bold text-primary">Customer</TableHead>
              <TableHead className="font-bold text-primary">Payment</TableHead>
              <TableHead className="font-bold text-primary">Status</TableHead>
              <TableHead className="font-bold text-primary">Total Price</TableHead>
              <TableHead className="font-bold text-primary text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
               <TableRow>
                  <TableCell colSpan={6} className="py-20 text-center font-medium italic opacity-50">Loading orders...</TableCell>
               </TableRow>
            ) : currentOrders.length === 0 ? (
               <TableRow>
                  <TableCell colSpan={6} className="py-20 text-center font-medium italic opacity-50">No orders found.</TableCell>
               </TableRow>
            ) : currentOrders.map((o) => (
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
                    <DialogTrigger nativeButton={true} render={
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary hover:bg-primary/5 rounded-lg">
                        <Eye className="h-4 w-4" />
                      </Button>
                    } />
                    <DialogContent className="max-w-xl">
                       <DialogHeader>
                          <DialogTitle>Order Details ({o.id})</DialogTitle>
                       </DialogHeader>
                       <div className="space-y-6 py-4">
                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-4 bg-secondary/30 rounded-2xl">
                                <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Customer Info</p>
                                <p className="font-bold">{o.customerName}</p>
                                <p className="text-sm">{o.customerPhone}</p>
                             </div>
                             <div className="p-4 bg-secondary/30 rounded-2xl">
                                <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Order Date</p>
                                <p className="font-bold">{new Date(o.createdAt).toLocaleDateString()}</p>
                             </div>
                          </div>
                          
                          <div className="space-y-3">
                             <h4 className="font-bold text-sm uppercase text-muted-foreground">Order Items</h4>
                             <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                {o.items && o.items.length > 0 ? (
                                   o.items.map((item, idx) => (
                                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                         <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-lg border flex items-center justify-center text-[10px] font-bold text-slate-400 overflow-hidden">
                                               {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <Package className="h-4 w-4" />}
                                            </div>
                                            <div>
                                               <p className="text-sm font-bold leading-tight">{item.name}</p>
                                               <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                         </div>
                                         <p className="text-sm font-bold text-primary">৳ {(item.price * item.quantity).toLocaleString()}</p>
                                      </div>
                                   ))
                                ) : (
                                   <p className="text-sm italic text-muted-foreground p-4 bg-slate-50 rounded-xl text-center border border-dashed">No items found in this order</p>
                                )}
                             </div>
                             <div className="flex justify-between items-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                <span className="font-bold text-sm">Total Amount</span>
                                <span className="font-black text-lg text-primary">৳ {o.total.toLocaleString()}</span>
                             </div>
                          </div>
                          
                          <div className="space-y-3">
                             <h4 className="font-bold text-sm">Update Order Status</h4>
                             <div className="flex flex-wrap gap-2">
                                <Button 
                                  variant={o.status === 'delivered' ? 'default' : 'outline'} 
                                  size="sm" 
                                  className="rounded-lg gap-2"
                                  onClick={() => updateStatus(o.id, 'delivered')}
                                >
                                  <CheckCircle2 className="h-3 w-3" /> Delivered
                                </Button>
                                <Button 
                                  variant={o.status === 'shipped' ? 'default' : 'outline'} 
                                  size="sm" 
                                  className="rounded-lg gap-2"
                                  onClick={() => updateStatus(o.id, 'shipped')}
                                >
                                  <Truck className="h-3 w-3" /> Shipped
                                </Button>
                                <Button 
                                  variant={o.status === 'cancelled' ? 'default' : 'outline'} 
                                  size="sm" 
                                  className="rounded-lg gap-2 text-destructive hover:bg-destructive/10"
                                  onClick={() => updateStatus(o.id, 'cancelled')}
                                >
                                  <XCircle className="h-3 w-3" /> Cancel
                                </Button>
                             </div>
                          </div>
                       </div>
                       <DialogFooter>
                          <Button className="w-full">Print Invoice</Button>
                       </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <AdminPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredOrders.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default AdminOrders;
