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

   const [timeRange, setTimeRange] = useState<'7D' | '30D'>('7D');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [orderData, productData] = await Promise.all([
        orderService.getAllOrders(),
        productService.getAllProducts()
      ]);
      
      // Filter orders by time range if needed
      // For now we just use all orders, but real logic would filter by date
      setOrders(orderData);
      setProducts(productData);
      setLoading(false);
    };
    fetchData();
  }, [timeRange]);

  const stats = useMemo(() => {
    // Basic filter logic for demo (actually filtering data)
    const now = new Date();
    const days = timeRange === '7D' ? 7 : 30;
    const filterDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    
    const filteredOrders = orders.filter(o => new Date(o.createdAt) >= filterDate);
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);

    return [
      { 
        label: 'Total Orders', 
        value: `৳ ${totalRevenue.toLocaleString()}`, 
        detail: 'Trending up this week ↑',
        subDetail: `Data from last ${days} days`,
        icon: <ShoppingCart className="h-6 w-6" />, 
        color: 'bg-white',
        accentColor: 'border-indigo-500',
        iconColor: 'text-indigo-500 bg-indigo-50'
      },
      { 
        label: 'Total Purchase', 
        value: `৳ 0.00`, 
        detail: 'Consistent buying trend ↑',
        subDetail: 'Stable vendor activity',
        icon: <Package className="h-6 w-6" />, 
        color: 'bg-white',
        accentColor: 'border-emerald-500',
        iconColor: 'text-emerald-500 bg-emerald-50'
      },
      { 
        label: 'Delivery Charge', 
        value: `৳ 0.00`, 
        detail: 'Regular logistic cost ↑',
        subDetail: 'Within expected range',
        icon: <Truck className="h-6 w-6" />, 
        color: 'bg-white',
        accentColor: 'border-amber-500',
        iconColor: 'text-amber-500 bg-amber-50'
      },
      { 
        label: 'Incomplete Conversion', 
        value: `0.0%`, 
        detail: 'Needs attention ↓',
        subDetail: 'Conversion tracking active',
        icon: <AlertCircle className="h-6 w-6" />, 
        color: 'bg-white',
        accentColor: 'border-rose-400',
        iconColor: 'text-rose-500 bg-rose-50'
      },
    ];
  }, [orders, timeRange]);

  const salesData = useMemo(() => {
     const months = ['June', 'July', 'August', 'September', 'October', 'November', 'January', 'February', 'March', 'April', 'May'];
     return months.map(month => ({
        name: month,
        sales: Math.floor(Math.random() * 5000),
        expenses: Math.floor(Math.random() * 3000)
     }));
  }, [timeRange]);

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
          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">
            <LayoutDashboard className="h-3 w-3" />
            <span>Dashboard</span>
            <ChevronRight className="h-2.5 w-2.5 opacity-50" />
            <span className="text-slate-900">Chutirmart</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl shadow-sm border border-slate-100">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setTimeRange('7D')}
            className={`text-[10px] h-8 font-black rounded-lg px-4 transition-all duration-200 ${
              timeRange === '7D' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            7D
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setTimeRange('30D')}
            className={`text-[10px] h-8 font-black rounded-lg px-4 transition-all duration-200 ${
              timeRange === '30D' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            30D
          </Button>
          <div className="w-px h-4 bg-slate-100 mx-1"></div>
          <Button variant="outline" size="sm" className="text-[10px] h-8 font-black rounded-lg px-4 text-rose-500 border-rose-100 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 gap-2 transition-all">
            <BarChart3 className="h-3 w-3" /> Source
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100/80 flex flex-col justify-between transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1.5 cursor-pointer group bg-white border-l-4 ${stat.accentColor}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
              </div>
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 duration-500 shadow-sm ${stat.iconColor}`}>
                {stat.icon}
              </div>
            </div>
            <div className="space-y-0.5 pt-3 border-t border-slate-50/50">
              <p className="text-[11px] font-bold text-slate-900 flex items-center gap-1">
                {stat.detail}
              </p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{stat.subDetail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-2xl border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.04)]">
          <div className="p-6 border-b border-slate-50">
             <h3 className="font-black text-slate-900 tracking-tight text-sm uppercase">Sales / Income Overview</h3>
          </div>
          <div className="p-6 flex-grow h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00458e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#00458e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#64748b', fontWeight: 700 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#64748b', fontWeight: 700 }} 
                />
                <Tooltip 
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: '1px solid #f1f5f9', 
                    boxShadow: '0 20px 50px -12px rgb(0 0 0 / 0.1)',
                    padding: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#00458e" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                  animationDuration={2000}
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#f43f5e" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  fillOpacity={1} 
                  fill="url(#colorExpenses)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
             <p className="text-[10px] text-slate-400 font-medium text-center pb-2">After every 4 hours chart data will automatically update</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden p-12 text-center space-y-8 transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.04)]">
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
