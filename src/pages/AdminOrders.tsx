import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Trash2, 
  Printer, 
  Send, 
  ChevronRight, 
  Calendar,
  Filter,
  Eye,
  CheckCircle2,
  Truck,
  XCircle,
  Package,
  RotateCcw,
  Clock,
  ThumbsUp,
  Settings2,
  RefreshCcw,
  Smartphone,
  ChevronDown
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { orderService } from "@/services/orderService";
import { Order } from "@/types";
import { toast } from "sonner";
import AdminPagination from "@/components/AdminPagination";

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Latest 15 Orders");
  
  // Filters
  const [invoicePhone, setInvoicePhone] = useState("");
  const [orderType, setOrderType] = useState("All");
  const [orderDate, setOrderDate] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error("Fetch orders failed", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusFromTab = (tab: string) => {
    switch(tab) {
      case "Pending Orders": return "pending";
      case "Approved Orders": return "approved";
      case "Process Orders": return "processing";
      case "Courier": return "shipped";
      case "Delivered Orders": return "delivered";
      case "Cancelled Orders": return "cancelled";
      case "Return / Refund Orders": return "returned";
      default: return null;
    }
  };

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Status Tab Filter
    const targetStatus = getStatusFromTab(filterStatus);
    if (targetStatus) {
      result = result.filter(o => o.status === targetStatus);
    } else if (filterStatus === "Latest 15 Orders") {
      result = result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 15);
    } else if (filterStatus === "Trash / Delete") {
      result = result.filter(o => o.status === 'deleted');
    }

    // Secondary Filters
    if (invoicePhone) {
      result = result.filter(o => 
        o.id.toLowerCase().includes(invoicePhone.toLowerCase()) || 
        o.customerPhone.includes(invoicePhone)
      );
    }

    return result;
  }, [orders, filterStatus, invoicePhone]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = useMemo(() => {
    if (filterStatus === "Latest 15 Orders") return filteredOrders;
    return filteredOrders.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredOrders, currentPage, filterStatus]);

  const tabs = [
    { name: "Latest 15 Orders", icon: <Clock className="h-3.5 w-3.5" /> },
    { name: "Pending Orders", count: orders.filter(o => o.status === 'pending').length },
    { name: "Approved Orders", count: orders.filter(o => o.status === 'approved').length },
    { name: "Process Orders", count: orders.filter(o => o.status === 'processing').length },
    { name: "Courier", count: orders.filter(o => o.status === 'shipped').length },
    { name: "Delivered Orders", count: orders.filter(o => o.status === 'delivered').length },
    { name: "Cancelled Orders", count: orders.filter(o => o.status === 'cancelled').length },
    { name: "Return / Refund Orders", count: 0 },
    { name: "Trash / Delete", icon: <Trash2 className="h-3.5 w-3.5" /> },
  ];

  const formatOrderId = (id: string) => {
    // If not starting with CHU#, prepend it
    let displayId = id.startsWith('CHU#') ? id : `CHU#${id}`;
    if (displayId.length > 7) {
      return displayId.substring(0, 7) + '...';
    }
    return displayId;
  };

  const formatText = (text: string) => {
    if (!text) return "";
    const words = text.split(' ');
    if (words.length > 2) {
      return words.slice(0, 2).join(' ') + '...';
    }
    return text;
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100 italic';
      case 'approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100 font-bold';
      case 'processing': return 'bg-blue-50 text-blue-600 border-blue-100 font-bold';
      case 'delivered': return 'bg-teal-50 text-teal-600 border-teal-100 font-bold';
      case 'cancelled': return 'bg-rose-50 text-rose-500 border-rose-200 font-bold';
      case 'shipped': return 'bg-slate-50 text-slate-600 border-slate-200 font-bold';
      default: return 'bg-slate-50 text-slate-500 border-slate-100 font-bold';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
           <div className="flex flex-col space-y-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">All Orders</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Manage and track every customer order — from new requests to successful deliveries.</p>
           </div>
           <div className="flex items-center gap-2">
              <span className="h-5 w-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">1</span>
           </div>
        </div>

        {/* Status Tabs Navigation */}
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto no-scrollbar gap-1">
           {tabs.map((tab) => (
             <button
               key={tab.name}
               onClick={() => { setFilterStatus(tab.name); setCurrentPage(1); }}
               className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300 ${
                 filterStatus === tab.name 
                   ? 'bg-[#00458e] text-white shadow-lg shadow-blue-900/10' 
                   : 'text-slate-500 hover:bg-slate-50'
               }`}
             >
               {tab.icon}
               <span className="text-[11px] font-bold uppercase tracking-tight">{tab.name}</span>
               {tab.count !== undefined && (
                 <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black min-w-[20px] text-center ${
                   filterStatus === tab.name ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                 }`}>
                   {tab.count}
                 </span>
               )}
             </button>
           ))}
        </div>

        {/* Action Bar (Filters + Bulk Buttons) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-end mt-4">
           {/* Left Controls */}
           <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-col space-y-1.5 min-w-[150px]">
                 <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Invoice / Phone</label>
                 <div className="relative">
                    <Smartphone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-300 pointer-events-none" />
                    <Input 
                      placeholder="Invoice / Phone" 
                      value={invoicePhone}
                      onChange={(e) => setInvoicePhone(e.target.value)}
                      className="h-9 pl-9 text-[11px] font-bold border-slate-100 bg-white rounded-xl shadow-sm focus:ring-primary/20" 
                    />
                 </div>
              </div>
              <div className="flex flex-col space-y-1.5 min-w-[120px]">
                 <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Order Type</label>
                 <select 
                   value={orderType}
                   onChange={(e) => setOrderType(e.target.value)}
                   className="h-9 px-3 text-[11px] font-bold bg-white border border-slate-100 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                 >
                    <option value="All">All</option>
                    <option value="Multiple">Multiple Products</option>
                    <option value="Single">Single Product</option>
                 </select>
              </div>
              <div className="flex flex-col space-y-1.5 min-w-[150px]">
                 <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Order Date</label>
                 <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-300 pointer-events-none" />
                    <Input 
                      type="date"
                      value={orderDate}
                      onChange={(e) => setOrderDate(e.target.value)}
                      className="h-9 pl-9 text-[11px] font-bold border-slate-100 bg-white rounded-xl shadow-sm appearance-none" 
                    />
                 </div>
              </div>
              <div className="flex items-end h-[36px]">
                 <Button className="h-9 px-4 bg-slate-900 text-white rounded-xl gap-2 font-bold text-[10px] shadow-lg shadow-slate-200">
                    <Search className="h-3.5 w-3.5" /> Search
                 </Button>
                 <Button 
                   variant="ghost" 
                   onClick={() => { setInvoicePhone(""); setOrderType("All"); setOrderDate(""); }}
                   className="h-9 px-4 text-slate-400 hover:text-slate-900 gap-2 font-bold text-[10px] ml-1"
                 >
                    <RefreshCcw className="h-3.5 w-3.5" /> Clear
                 </Button>
              </div>
           </div>

           {/* Right Controls - Bulk Actions */}
           <div className="flex flex-wrap items-center justify-end gap-2">
              <Button className="h-9 bg-[#00458e] hover:bg-blue-800 text-white px-4 rounded-xl gap-2 font-black text-[10px] shadow-lg shadow-blue-100">
                 <Send className="h-3.5 w-3.5" /> Bulk Send to Courier
              </Button>
              <Button className="h-9 bg-slate-800 hover:bg-slate-900 text-white px-4 rounded-xl gap-2 font-black text-[10px] shadow-lg shadow-slate-200">
                 <Printer className="h-3.5 w-3.5" /> Bulk Print <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
              <Button className="h-9 bg-rose-500 hover:bg-rose-600 text-white px-4 rounded-xl gap-2 font-black text-[10px] shadow-lg shadow-rose-100">
                 <Trash2 className="h-3.5 w-3.5" /> Bulk Delete
              </Button>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
        <Table>
          <TableHeader className="bg-[#f8fafc] border-b border-slate-100">
            <TableRow className="hover:bg-transparent h-12">
              <TableHead className="pl-6 w-12">
                <input type="checkbox" className="w-4 h-4 border-slate-300 rounded text-primary focus:ring-primary/20 accent-[#00458e]" />
              </TableHead>
              <TableHead className="text-[12px] font-black text-slate-400 uppercase tracking-tight">Order ID</TableHead>
              <TableHead className="text-[12px] font-black text-slate-400 uppercase tracking-tight">Customer Name</TableHead>
              <TableHead className="text-[12px] font-black text-slate-400 uppercase tracking-tight">Customer Address</TableHead>
              <TableHead className="text-[12px] font-black text-slate-400 uppercase tracking-tight">Date</TableHead>
              <TableHead className="text-[12px] font-black text-slate-400 uppercase tracking-tight">Status</TableHead>
              <TableHead className="text-[12px] font-black text-slate-400 uppercase tracking-tight">Amount</TableHead>
              <TableHead className="text-[12px] font-black text-slate-400 uppercase tracking-tight">Payment</TableHead>
              <TableHead className="text-[12px] font-black text-slate-400 uppercase tracking-tight">Send to Courier</TableHead>
              <TableHead className="text-[12px] font-black text-slate-400 uppercase tracking-tight">Origin</TableHead>
              <TableHead className="text-right pr-6 text-[12px] font-black text-slate-400 uppercase tracking-tight">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={11} className="py-32 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-40">
                     <RefreshCcw className="h-10 w-10 animate-spin" />
                     <p className="text-sm font-bold italic">Gathering orders...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : currentOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="py-32 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-40">
                     <Package className="h-12 w-12" />
                     <p className="text-sm font-bold italic">No orders found in this section.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              currentOrders.map((o) => (
                <TableRow key={o.id} className="hover:bg-slate-50/50 transition-colors h-20 group">
                  <TableCell className="pl-6 w-12">
                    <input type="checkbox" className="w-4 h-4 border-slate-300 rounded accent-[#00458e]" />
                  </TableCell>
                  <TableCell className="font-black text-slate-900 text-sm whitespace-nowrap">
                    {formatOrderId(o.id)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-[14px]">
                        {formatText(o.customerName)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold tracking-tight">
                        {o.customerPhone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <p className="text-[14px] font-medium text-slate-500" title={o.shippingAddress}>
                      {formatText(o.shippingAddress || "Bangirchor, Karimgonj Kishorgon Dhaka Bangladesh")}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-500 whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell>
                     <div className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight border ${getStatusStyle(o.status)}`}>
                        {o.status}
                     </div>
                  </TableCell>
                  <TableCell className="font-black text-slate-900 text-[14px] whitespace-nowrap">
                    ৳ {o.total.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-tight">
                       {o.paymentStatus === 'paid' ? 'Paid' : 'COD'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button className="h-8 bg-[#00458e] hover:bg-blue-800 text-white px-3 rounded-lg font-black text-[10px] uppercase shadow-md shadow-blue-100">
                      Send to Courier
                    </Button>
                  </TableCell>
                  <TableCell className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    FB Website
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                       <button className="h-8 w-8 flex items-center justify-center rounded-xl bg-white text-slate-500 hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-100">
                          <Eye className="h-4 w-4" />
                       </button>
                       <button className="h-8 w-8 flex items-center justify-center rounded-xl bg-white text-slate-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm border border-slate-100">
                          <CheckCircle2 className="h-4 w-4" />
                       </button>
                       <button className="h-8 w-8 flex items-center justify-center rounded-xl bg-white text-slate-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-slate-100">
                          <Trash2 className="h-4 w-4" />
                       </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="p-6 bg-[#f8fafc] border-t border-slate-100">
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredOrders.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
