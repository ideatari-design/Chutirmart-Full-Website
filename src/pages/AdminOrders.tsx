import React, { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ExternalLink,
  Eye,
  CheckCircle2,
  Truck,
  XCircle,
  FileText,
  Package,
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
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filterStatus, setFilterStatus] = useState("All");

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

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses = [
    "All",
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-md text-[11px] font-medium bg-amber-50 text-amber-600 border border-amber-100 italic">
            Pending
          </div>
        );
      case "processing":
        return (
          <div className="inline-flex items-center px-4 py-1 rounded-md text-[11px] font-medium bg-blue-50 text-blue-600 border border-blue-100">
            Processing
          </div>
        );
      case "delivered":
        return (
          <div className="inline-flex items-center px-4 py-1 rounded-md text-[11px] font-medium bg-[#ecfdfa] text-[#0db39e] border border-[#0db39e]/30">
            Delivered
          </div>
        );
      case "cancelled":
        return (
          <div className="inline-flex items-center px-4 py-1 rounded-md text-[11px] font-medium bg-rose-50 text-rose-500 border border-rose-200">
            Cancel
          </div>
        );
      case "shipped":
        return (
          <div className="inline-flex items-center px-4 py-1 rounded-md text-[11px] font-medium bg-violet-50 text-violet-600 border border-violet-100">
            Shipped
          </div>
        );
      case "hold":
        return (
          <div className="inline-flex items-center px-4 py-1 rounded-md text-[11px] font-medium bg-amber-50 text-amber-500 border border-amber-200">
            Hold
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-4 py-1 rounded-md text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200 uppercase">
            {status}
          </div>
        );
    }
  };

  const getPaymentBadge = (status: string) => {
    return (
      <div className="inline-flex items-center px-4 py-1 rounded-md text-[11px] font-medium bg-[#ecfdfa] text-[#0db39e] border border-[#0db39e]/30 whitespace-nowrap">
        Cash On Delivery
      </div>
    );
  };

  const getStatusCount = (status: string) => {
    if (status === 'All') return orders.length;
    return orders.filter(o => o.status === status).length;
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Orders</h1>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors relative ${
                filterStatus === s
                  ? "text-[#00458e]"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)} ({getStatusCount(s)})
              {filterStatus === s && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00458e]"></div>
              )}
            </button>
          ))}
          <button className="px-4 py-3 text-xs font-semibold text-slate-500 hover:text-slate-700 whitespace-nowrap">
            Trash (0)
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center">
              <select className="h-10 px-4 pr-10 border border-slate-200 rounded-lg text-sm font-medium bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option>Bulk Action</option>
              </select>
              <div className="pointer-events-none -ml-8 flex items-center px-2 text-slate-400">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
              <Button className="h-10 ml-3 bg-[#00458e] hover:bg-blue-800 text-white px-6 rounded-lg font-semibold text-xs">
                Apply
              </Button>
            </div>

            <div className="flex items-center">
              <select className="h-10 px-4 pr-10 border border-slate-200 rounded-lg text-sm font-medium bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option>All Date</option>
              </select>
              <div className="pointer-events-none -ml-8 flex items-center px-2 text-slate-400">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>

            <div className="flex items-center">
              <select className="h-10 px-4 pr-10 border border-slate-200 rounded-lg text-sm font-medium bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option>All Sales Channels</option>
              </select>
              <div className="pointer-events-none -ml-8 flex items-center px-2 text-slate-400">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search Order, Mobile, email, company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 w-[300px] border-slate-200 rounded-lg text-sm bg-white"
              />
            </div>
            <Button className="h-10 bg-[#00458e] hover:bg-blue-800 text-white rounded-lg font-semibold text-xs px-5">
              New Sales Order
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-[-1rem]">
          <div className="w-[150px] h-8 border border-slate-200 rounded-md"></div>
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
            <select className="h-10 px-4 pr-8 text-sm font-medium bg-white appearance-none focus:outline-none">
              <option>Products</option>
            </select>
            <div className="pointer-events-none -ml-6 flex items-center px-2 text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
          <Button className="h-10 bg-[#00458e] hover:bg-blue-800 text-white px-6 rounded-lg font-semibold text-xs">
            Apply
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden border border-[#0db39e]/20 shadow-sm">
        <Table>
          <TableHeader className="bg-[#ecfdfa]">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="pl-6 w-12">
                <div className="w-4 h-4 border border-[#0db39e] rounded bg-[#0db39e]/10"></div>
              </TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">
                Order
              </TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">
                Customer Name
              </TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">
                Customer Address
              </TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">
                Date
              </TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">
                Status
              </TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">
                Amount
              </TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">
                Payment
              </TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">
                Send To Courier
              </TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">
                Origin
              </TableHead>
              <TableHead className="text-right pr-6 text-[12px] font-medium text-slate-600">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="py-20 text-center font-medium italic opacity-50"
                >
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : currentOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="py-20 text-center font-medium italic opacity-50"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              currentOrders.map((o) => (
                <TableRow
                  key={o.id}
                  className="hover:bg-slate-50 transition-colors border-b border-slate-100"
                >
                  <TableCell className="pl-6 w-12">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-slate-200 rounded"></div>
                      <div className="w-2.5 h-2.5 rounded-full border border-slate-300"></div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-800 text-[12px] whitespace-nowrap">
                    {o.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900 text-[12px]">
                        {o.customerName}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {o.customerPhone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <p
                      className="text-[11px] text-slate-500 truncate"
                      title={o.shippingAddress}
                    >
                      {o.shippingAddress ||
                        "Bangirchor, Karimgonj Kishorgon Dhaka Bangladesh, Mirpur-14...."}
                    </p>
                  </TableCell>
                  <TableCell className="text-[12px] text-slate-600 whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell>{getStatusBadge(o.status)}</TableCell>
                  <TableCell className="font-medium text-slate-900 text-[12px] whitespace-nowrap">
                    ৳ {o.total.toLocaleString()}
                  </TableCell>
                  <TableCell>{getPaymentBadge(o.paymentStatus)}</TableCell>
                  <TableCell>
                    <Button className="h-7 bg-[#00458e] hover:bg-blue-800 text-white px-4 rounded font-semibold text-[10px] uppercase">
                      Send
                    </Button>
                  </TableCell>
                  <TableCell className="text-[12px] text-slate-500 whitespace-nowrap">
                    Source: FB
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Dialog>
                      <DialogTrigger
                        nativeButton={true}
                        render={
                          <button className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-[#ecfdfa] text-[#0db39e] cursor-pointer hover:bg-[#d1f7f1] transition-colors border-none outline-none">
                            <Eye className="h-4 w-4" />
                          </button>
                        }
                      />
                      <DialogContent className="max-w-xl">
                        <DialogHeader>
                          <DialogTitle>Order Details ({o.id})</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-secondary/30 rounded-2xl">
                              <p className="text-xs text-muted-foreground font-bold uppercase mb-1">
                                Customer Info
                              </p>
                              <p className="font-bold">{o.customerName}</p>
                              <p className="text-sm">{o.customerPhone}</p>
                            </div>
                            <div className="p-4 bg-secondary/30 rounded-2xl">
                              <p className="text-xs text-muted-foreground font-bold uppercase mb-1">
                                Order Date
                              </p>
                              <p className="font-bold">
                                {new Date(o.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-bold text-sm uppercase text-muted-foreground">
                              Order Items
                            </h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                              {o.items && o.items.length > 0 ? (
                                o.items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-white rounded-lg border flex items-center justify-center text-[10px] font-bold text-slate-400 overflow-hidden">
                                        {item.images &&
                                        item.images.length > 0 ? (
                                          <img
                                            src={item.images[0]}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <Package className="h-4 w-4" />
                                        )}
                                      </div>
                                      <div>
                                        <p className="text-sm font-bold leading-tight">
                                          {item.name}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground">
                                          Qty: {item.quantity}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="text-sm font-bold text-primary">
                                      ৳{" "}
                                      {(
                                        item.price * item.quantity
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm italic text-muted-foreground p-4 bg-slate-50 rounded-xl text-center border border-dashed">
                                  No items found in this order
                                </p>
                              )}
                            </div>
                            <div className="flex justify-between items-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
                              <span className="font-bold text-sm">
                                Total Amount
                              </span>
                              <span className="font-black text-lg text-primary">
                                ৳ {o.total.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-bold text-sm">
                              Update Order Status
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant={
                                  o.status === "delivered"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                className="rounded-lg gap-2"
                                onClick={() => updateStatus(o.id, "delivered")}
                              >
                                <CheckCircle2 className="h-3 w-3" /> Delivered
                              </Button>
                              <Button
                                variant={
                                  o.status === "shipped" ? "default" : "outline"
                                }
                                size="sm"
                                className="rounded-lg gap-2"
                                onClick={() => updateStatus(o.id, "shipped")}
                              >
                                <Truck className="h-3 w-3" /> Shipped
                              </Button>
                              <Button
                                variant={
                                  o.status === "cancelled"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                className="rounded-lg gap-2 text-destructive hover:bg-destructive/10"
                                onClick={() => updateStatus(o.id, "cancelled")}
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
              ))
            )}
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
