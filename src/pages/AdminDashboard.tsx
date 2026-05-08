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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Dashboard Overview</h2>
        <div className="flex items-center gap-3">
           <Button variant="outline">Download Report</Button>
           <Button>Admin Settings</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 ${stat.color} rounded-2xl flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                  {stat.trend}
                </Badge>
              </div>
              <p className="text-sm font-bold text-muted-foreground uppercase">{stat.label}</p>
              <h3 className="text-3xl font-black mt-2">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Sales Graph (Weekly)</CardTitle>
            <CardDescription>Total sales data for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2d5a27" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2d5a27" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#2d5a27" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm h-full">
          <CardHeader>
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <CardDescription>List of the latest 5 orders</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {orders.slice(0, 5).map((o, i) => (
                   <div key={o.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-xl hover:bg-secondary/40 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-xs uppercase border">
                            {o.id.substring(0, 3)}
                         </div>
                         <div>
                            <p className="text-sm font-bold">Order {o.id}</p>
                            <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-none shadow-none uppercase text-[10px] font-bold">{o.status}</Badge>
                         <span className="font-bold text-sm">৳ {o.total.toLocaleString()}</span>
                         <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                   </div>
                ))}
                {orders.length === 0 && <p className="text-center text-muted-foreground py-10">No orders found</p>}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
