import React, { useMemo, useEffect, useState } from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  ChevronRight,
  AlertCircle,
  BadgeCheck,
  LayoutDashboard,
  Truck,
  PlusCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis
} from 'recharts';
import { orderService } from '@/services/orderService';
import { productService } from '@/services/productService';
import { Order, Product } from '@/types';

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [orderData, productData] = await Promise.all([
        orderService.getAllOrders(),
        productService.getAllProducts()
      ]);
      setOrders(orderData);
      setProducts(productData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const totalOrdersCount = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const incompleteOrdersCount = orders.filter(o => o.status === 'pending').length; 
    const successRate = totalOrdersCount > 0 ? Math.round(((totalOrdersCount - incompleteOrdersCount) / totalOrdersCount) * 100) : 0;

    return [
      { 
        label: 'Total Orders', 
        value: `৳ ${totalRevenue.toLocaleString()}`, 
        detail: 'Trending up this week ↑',
        subDetail: 'Data from selected period',
        icon: <ShoppingCart className="h-6 w-6" />, 
        color: 'bg-white border-l-4 border-indigo-500',
        iconColor: 'text-indigo-500 bg-indigo-50'
      },
      { 
        label: 'Total Purchase', 
        value: `৳ 0.00`, 
        detail: 'Consistent buying trend ↑',
        subDetail: 'Stable vendor activity',
        icon: <Package className="h-6 w-6" />, 
        color: 'bg-white border-l-4 border-emerald-500',
        iconColor: 'text-emerald-500 bg-emerald-50'
      },
      { 
        label: 'Delivery Charge', 
        value: `৳ 0.00`, 
        detail: 'Regular logistic cost ↑',
        subDetail: 'Within expected range',
        icon: <Truck className="h-6 w-6" />, 
        color: 'bg-white border-l-4 border-amber-500',
        iconColor: 'text-amber-500 bg-amber-50'
      },
    ];
  }, [orders]);

  const salesData = useMemo(() => {
     const months = ['June', 'July', 'August', 'September', 'October', 'November', 'January', 'February', 'March', 'April', 'May'];
     return months.map(month => ({
        name: month,
        sales: Math.floor(Math.random() * 5000),
        expenses: Math.floor(Math.random() * 3000)
     }));
  }, []);

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading dashboard statistics...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <LayoutDashboard className="h-3 w-3" />
            <span>Dashboard</span>
            <ChevronRight className="h-3 w-3" />
            <span>Profile</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-900 border-b border-primary/30 pb-0.5">Shorab Elite Mart</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
          <Button variant="ghost" size="sm" className="text-[10px] h-8 font-black rounded-lg px-4 bg-slate-900 text-white hover:bg-slate-800 hover:text-white transition-all shadow-md">7D</Button>
          <Button variant="ghost" size="sm" className="text-[10px] h-8 font-black rounded-lg px-4 text-slate-400 hover:bg-slate-50">30D</Button>
          <Button variant="outline" size="sm" className="text-[10px] h-8 font-black rounded-lg px-4 text-rose-500 border-rose-200 hover:bg-rose-50 hover:text-rose-600 gap-2">
            <BarChart3 className="h-3 w-3" /> Source
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group ${stat.color}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
              </div>
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 shadow-sm ${stat.iconColor}`}>
                {stat.icon}
              </div>
            </div>
            <div className="space-y-1 pt-2">
              <p className="text-[11px] font-bold text-slate-900 flex items-center gap-1">
                {stat.detail}
              </p>
              <p className="text-[9px] font-medium text-slate-400">{stat.subDetail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50">
             <h3 className="font-black text-slate-900 tracking-tight text-sm uppercase">Sales / Income Overview</h3>
          </div>
          <div className="p-6 flex-grow h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0db39e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0db39e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }}
                />
                <Area 
                  type="step" 
                  dataKey="sales" 
                  stroke="#0db39e" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
             <p className="text-[10px] text-slate-400 font-medium text-center pb-2">After every 4 hours chart data will automatically update</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-8 text-center space-y-6">
         <div className="flex flex-col items-center space-y-4">
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Top Selling Products</h3>
            <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center text-primary">
               <Package className="h-8 w-8" />
            </div>
            <div className="space-y-1">
               <h4 className="font-bold text-slate-900">No Top Selling Products Yet</h4>
               <p className="text-sm text-slate-500 max-w-md">Start seeing your best performers here once you start making sales. Add more products to boost your inventory.</p>
            </div>
            <Link to="/admin/products/add">
               <Button className="rounded-xl h-12 px-8 bg-slate-900 text-white hover:bg-slate-800 gap-3 font-bold shadow-lg shadow-slate-200">
                  <PlusCircle className="h-5 w-5" /> ADD PRODUCT
               </Button>
            </Link>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
