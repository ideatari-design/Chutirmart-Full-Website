import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  AlertCircle,
  Trash2,
  RefreshCw,
  Smartphone,
  Globe,
  Clock,
  ArrowRightCircle,
  Edit2
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
import { IncompleteOrder } from '@/types';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

const AdminIncompleteOrders = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('id') || '';
  const [search, setSearch] = useState(initialSearch);
  const [orders, setOrders] = useState<IncompleteOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<IncompleteOrder | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  // Edit form state
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Poll every 30s for "real-time"
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    const data = await orderService.getAllIncompleteOrders();
    setOrders(data);
    setLoading(false);
  };

  const handleRecover = async (id: string) => {
    setIsRecovering(true);
    const result = await orderService.recoverIncompleteOrder(id);
    if (result.success) {
      toast.success("Order recovered and moved to main orders!");
      fetchOrders();
      setIsDetailOpen(false);
    } else {
      toast.error("Failed to recover order");
    }
    setIsRecovering(false);
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || 
      (o.customerPhone || '').includes(search) ||
      (o.customerName || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || o.status === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'incomplete': return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 px-3 py-1 rounded-full uppercase text-[10px] font-black tracking-widest shadow-sm">Incomplete</Badge>;
      case 'recovered': return <Badge variant="outline" className="bg-sky-100 text-sky-700 border-sky-200 px-3 py-1 rounded-full uppercase text-[10px] font-black tracking-widest shadow-sm">Recovered</Badge>;
      case 'converted': return <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1 rounded-full uppercase text-[10px] font-black tracking-widest shadow-sm">Converted</Badge>;
      case 'expired': return <Badge variant="outline" className="bg-rose-100 text-rose-700 border-rose-200 px-3 py-1 rounded-full uppercase text-[10px] font-black tracking-widest shadow-sm">Expired</Badge>;
      default: return <Badge variant="outline" className="px-3 py-1 rounded-full uppercase text-[10px] font-black tracking-widest shadow-sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
               Incomplete Orders
               <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 text-[10px] font-bold border border-amber-100">Live Tracking</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">Monitor customers who haven't completed checkout in real-time.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={fetchOrders} className="h-10 rounded-lg text-xs font-bold flex items-center gap-2">
               <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
             <div className="flex items-center">
                <select 
                  className="h-10 px-4 pr-10 border border-slate-200 rounded-lg text-sm font-medium bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Drafts</option>
                  <option value="Incomplete">Incomplete</option>
                  <option value="Recovered">Recovered</option>
                  <option value="Converted">Converted</option>
                  <option value="Expired">Expired</option>
                </select>
                <div className="pointer-events-none -ml-8 flex items-center px-2 text-slate-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Draft ID / Customer..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 w-[300px] border-slate-200 rounded-lg text-sm bg-white" 
                />
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="text-[12px] font-bold text-slate-600 pl-6 uppercase tracking-wider">Time</TableHead>
              <TableHead className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Draft ID</TableHead>
              <TableHead className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Customer</TableHead>
              <TableHead className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Items</TableHead>
              <TableHead className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Total</TableHead>
              <TableHead className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Device/Source</TableHead>
              <TableHead className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-[12px] font-bold text-slate-600 text-right pr-6 uppercase tracking-wider">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="py-20 text-center text-slate-400 font-medium">Loading incomplete orders...</TableCell>
              </TableRow>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((o) => (
                <TableRow key={o.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 h-20">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock className="h-3 w-3" />
                      <span className="text-[11px] font-semibold">{new Date(o.updatedAt || o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[12px] font-bold text-[#00458e] tracking-tight">{o.id}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold text-slate-900">{o.customerName || 'N/A'}</span>
                      <span className="text-[11px] text-[#00458e] font-bold">{o.customerPhone || 'No Phone'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex -space-x-2">
                       {(o.items || []).slice(0, 3).map((item, idx) => (
                          <div key={idx} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                             <img 
                               src={item.images?.[0]} 
                               alt={item.name}
                               className="w-full h-full object-cover"
                             />
                          </div>
                       ))}
                       {(o.items || []).length > 3 && (
                         <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm">
                           +{(o.items || []).length - 3}
                         </div>
                       )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[13px] font-bold text-slate-900">
                      ৳ {o.total.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                          <Smartphone className="h-3 w-3" /> 
                          <span className="max-w-[120px] truncate">{o.deviceInfo?.split('(')[0] || 'Mobile'}</span>
                       </div>
                       <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                          <Globe className="h-3 w-3 text-emerald-500" />
                          <span>{o.trafficSource || 'Direct'}</span>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(o.status)}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog open={isDetailOpen && selectedOrder?.id === o.id} onOpenChange={(open) => {
                        setIsDetailOpen(open);
                        if(open) {
                          setSelectedOrder(o);
                          setEditData({
                            name: o.customerName || '',
                            phone: o.customerPhone || '',
                            address: o.customerAddress || ''
                          });
                        }
                      }}>
                        <DialogTrigger nativeButton={true} render={
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-[#00458e] hover:bg-blue-50 transition-all">
                            <Eye className="h-5 w-5" />
                          </Button>
                        } />
                        <DialogContent className="max-w-2xl rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
                           <div className="bg-[#00458e] p-6 text-white">
                              <DialogTitle className="text-xl font-bold flex items-center gap-3">
                                 <AlertCircle className="h-6 w-6 text-amber-400" />
                                 Order Recovery: {o.id}
                              </DialogTitle>
                              <p className="text-blue-100/70 text-xs mt-1">Capture details from abandoned checkout and convert to order.</p>
                           </div>
                           
                           <div className="p-8 space-y-8">
                              <div className="grid grid-cols-2 gap-8">
                                 <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Customer Info (Editable)</h4>
                                    <div className="space-y-4">
                                       <div className="space-y-2">
                                          <Label className="text-xs font-bold text-slate-600">Full Name</Label>
                                          <Input 
                                            value={editData.name} 
                                            onChange={e => setEditData(prev => ({...prev, name: e.target.value}))} 
                                            className="rounded-xl bg-slate-50 border-slate-100"
                                          />
                                       </div>
                                       <div className="space-y-2">
                                          <Label className="text-xs font-bold text-slate-600">Phone</Label>
                                          <Input 
                                            value={editData.phone} 
                                            onChange={e => setEditData(prev => ({...prev, phone: e.target.value}))} 
                                            className="rounded-xl bg-slate-50 border-slate-100"
                                          />
                                       </div>
                                    </div>
                                 </div>
                                 <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Order Context</h4>
                                    <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 relative overflow-hidden group">
                                       <div className="relative z-10">
                                          <p className="text-[10px] text-emerald-600 font-bold uppercase mb-1">Estimated Total</p>
                                          <p className="text-3xl font-black text-emerald-700 tracking-tighter">৳ {o.total.toLocaleString()}</p>
                                          <div className="flex items-center gap-2 mt-4 text-[11px] font-bold text-emerald-600/70">
                                             <Smartphone className="h-3 w-3" />
                                             <span>Capture from {o.deviceInfo?.split(')')[0].split('(')[1]?.slice(0, 15) || 'Mobile'}</span>
                                          </div>
                                       </div>
                                       <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                                          <ArrowRightCircle className="h-24 w-24 text-emerald-900" />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              
                              <div className="space-y-4">
                                 <Label className="text-xs font-bold text-slate-600">Full Shipping Address</Label>
                                 <textarea 
                                    className="w-full h-24 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    value={editData.address}
                                    onChange={e => setEditData(prev => ({...prev, address: e.target.value}))}
                                    placeholder="Enter address if missing..."
                                 />
                              </div>

                              <div className="space-y-4">
                                 <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Selected Items</h4>
                                 <div className="space-y-2 max-h-[120px] overflow-y-auto pr-2">
                                    {(o.items || []).map((item, idx) => (
                                       <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                                          <div className="flex items-center gap-3">
                                             <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-50">
                                                <img src={item.images?.[0]} className="w-full h-full object-cover" />
                                             </div>
                                             <div>
                                                <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold">QTY: {item.quantity}</p>
                                             </div>
                                          </div>
                                          <p className="text-sm font-black text-[#00458e]">৳ {(item.price * item.quantity).toLocaleString()}</p>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </div>

                           <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                              <Button variant="ghost" className="h-12 flex-1 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-all">Cancel</Button>
                              <Button 
                                className="h-12 flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 gap-2 transition-all active:scale-95"
                                disabled={isRecovering || o.status === 'converted'}
                                onClick={() => handleRecover(o.id)}
                              >
                                {isRecovering ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="h-5 w-5" />
                                )}
                                {o.status === 'converted' ? 'ORDER RECOVERED' : 'RECOVER & APPROVE ORDER'}
                              </Button>
                           </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="py-32 text-center">
                   <div className="flex flex-col items-center gap-4 max-w-xs mx-auto">
                      <div className="p-6 bg-amber-50 rounded-full border-4 border-white shadow-xl shadow-amber-900/5">
                        <AlertCircle className="h-12 w-12 text-amber-500" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-slate-900 font-black tracking-tight text-lg">No Incomplete Orders</h4>
                        <p className="text-slate-400 text-xs font-bold leading-relaxed uppercase tracking-wider">Passive monitoring is active. Checkouts will appear here as they happen.</p>
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
