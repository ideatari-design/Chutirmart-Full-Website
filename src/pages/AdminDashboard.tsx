import React, { useMemo, useEffect, useState } from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  ChevronRight,
  AlertCircle,
  BadgeCheck
} from 'lucide-react';
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
    const incompleteOrdersCount = orders.filter(o => o.status === 'pending').length; // Assuming pending as incomplete for now
    const successRate = totalOrdersCount > 0 ? Math.round(((totalOrdersCount - incompleteOrdersCount) / totalOrdersCount) * 100) : 0;

    return [
      { label: 'Incomplete Orders', value: incompleteOrdersCount.toLocaleString(), trend: '-2%', icon: <AlertCircle className="h-5 w-5" />, color: 'bg-red-50 text-red-600' },
      { label: 'All Orders', value: totalOrdersCount.toLocaleString(), trend: '+5%', icon: <ShoppingCart className="h-5 w-5" />, color: 'bg-blue-50 text-blue-600' },
      { label: 'Success Rate', value: `${successRate.toLocaleString()}%`, trend: '+8%', icon: <BadgeCheck className="h-5 w-5" />, color: 'bg-indigo-50 text-indigo-600' },
      { label: 'Total Revenue', value: `৳ ${totalRevenue.toLocaleString()}`, trend: '+10%', icon: <BarChart3 className="h-5 w-5" />, color: 'bg-green-50 text-green-600' },
    ];
  }, [orders]);

  const salesData = useMemo(() => {
     // Generate dummy weekly data for now as we don't have historical data in memory server
     const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
     return days.map(day => ({
        name: day,
        sales: Math.floor(Math.random() * 5000) + 1000
     }));
  }, []);

  if (loading) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 font-sans tracking-tight">Dashboard</h1>
        <p className="text-slate-500 text-sm font-medium">Welcome back, here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-[#0db39e]/10 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between relative z-10">
              <div className={`h-12 w-12 ${stat.color} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 leading-none">{stat.value}</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between relative z-10">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.trend} from last week
              </span>
            </div>
            {/* Abstract Background Shape */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#0db39e]/5 rounded-full blur-2xl group-hover:bg-[#0db39e]/10 transition-colors duration-500"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#0db39e]/10 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-[#0db39e]/10 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 tracking-tight">Sales Analytics</h3>
              <p className="text-xs text-slate-500 font-medium">Sales performance over the last 7 days</p>
            </div>
            <Button variant="outline" className="h-9 text-xs font-semibold rounded-lg border-slate-200">
              View All Report
            </Button>
          </div>
          <div className="p-6 flex-grow h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0db39e" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#0db39e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #f1f5f9', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)',
                    padding: '8px 12px'
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                  labelStyle={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', fontWeight: 500 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#0db39e" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                  activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#0db39e]/10 shadow-sm overflow-hidden flex flex-col max-h-[480px]">
          <div className="p-6 border-b border-[#0db39e]/10">
            <h3 className="font-bold text-slate-900 tracking-tight">Recent Orders</h3>
            <p className="text-xs text-slate-500 font-medium">Last processed transactions</p>
          </div>
          <div className="overflow-y-auto flex-grow p-4 space-y-3 pretty-scrollbar">
            {orders.slice(0, 8).map((o) => (
              <div key={o.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#ecfdfa] border border-[#0db39e]/20 flex items-center justify-center font-bold text-[10px] text-[#0db39e]">
                    {o.id.startsWith('CHU#') ? o.id.replace('CHU#', '#') : o.id.substring(0, 4)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-[#00458e] transition-colors">{o.customerName}</p>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">{o.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900">৳{o.total.toLocaleString()}</p>
                  <p className="text-[9px] font-medium text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-20 opacity-40">
                <Package className="h-10 w-10 mb-2" />
                <p className="text-xs font-medium italic">No recent orders</p>
              </div>
            )}
          </div>
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 mt-auto">
            <Button variant="ghost" className="w-full h-9 text-[11px] font-bold text-[#00458e] hover:text-[#00458e]/80 hover:bg-transparent">
              View All Orders <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
