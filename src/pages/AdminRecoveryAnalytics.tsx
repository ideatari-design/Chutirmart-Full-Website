import React, { useEffect, useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  MousePointer2,
  PieChart as PieChartIcon,
  ArrowUpRight,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { orderService } from '@/services/orderService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const AdminRecoveryAnalytics = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    const data = await orderService.getRecoveryStats();
    setStats(data);
    setLoading(false);
  };

  const funnelData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Total Incomplete', value: stats.totalIncomplete, fill: '#6366f1' },
      { name: 'Recovered', value: stats.recoveredOrders, fill: '#0db39e' },
    ];
  }, [stats]);

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#00458e] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-500 font-bold animate-pulse uppercase text-[10px] tracking-widest leading-none">Crunching Recovery Data...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Recovery Analytics</h1>
        <p className="text-slate-500 text-sm font-medium">Track your performance in recovering abandoned checkouts.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-2xl shadow-sm border-slate-100 hover:shadow-xl transition-all duration-300">
           <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Incomplete</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stats?.totalIncomplete || 0}</h3>
                 </div>
                 <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <ShoppingBag className="h-5 w-5" />
                 </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-slate-500">
                 <MousePointer2 className="h-3 w-3" />
                 <span>Potential customers lost</span>
              </div>
           </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-slate-100 hover:shadow-xl transition-all duration-300">
           <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recovered Orders</p>
                    <h3 className="text-3xl font-black text-[#0db39e] tracking-tighter">{stats?.recoveredOrders || 0}</h3>
                 </div>
                 <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#0db39e]">
                    <RefreshCw className="h-5 w-5" />
                 </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-[#0db39e]">
                 <TrendingUp className="h-3 w-3" />
                 <span>Saved from abandonment</span>
              </div>
           </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-slate-100 hover:shadow-xl transition-all duration-300">
           <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conversion Rate</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stats?.recoveryConversionRate.toFixed(1) || 0}%</h3>
                 </div>
                 <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                    <PieChartIcon className="h-5 w-5" />
                 </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-amber-600">
                 <ArrowUpRight className="h-3 w-3" />
                 <span>Efficiency of recovery process</span>
              </div>
           </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-slate-100 hover:shadow-xl transition-all duration-300">
           <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recovered Revenue</p>
                    <h3 className="text-3xl font-black text-[#00458e] tracking-tighter">৳ {stats?.recoveredRevenue.toLocaleString() || 0}</h3>
                 </div>
                 <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#00458e]">
                    <DollarSign className="h-5 w-5" />
                 </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-[#00458e]">
                 <TrendingUp className="h-3 w-3" />
                 <span>Pure extra profit</span>
              </div>
           </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend Chart */}
        <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50">
            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
               <TrendingUp className="h-4 w-4 text-[#00458e]" />
               Recovery Trends Over Time
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase text-slate-400">Daily breakdown of abandonment vs recovery</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={stats?.trends || []}>
                  <defs>
                    <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0db39e" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0db39e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="incomplete" 
                    stroke="#6366f1" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorInc)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="recovered" 
                    stroke="#0db39e" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorRec)" 
                  />
               </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Funnel Visualization */}
        <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50">
            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
               <PieChartIcon className="h-4 w-4 text-[#00458e]" />
               Conversion Funnel
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase text-slate-400">Visualization of the recovery funnel</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 h-[400px] flex flex-col items-center justify-center">
             <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={funnelData}
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
             <div className="flex gap-8 mt-4">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-[#6366f1]" />
                   <span className="text-xs font-bold text-slate-600 uppercase">Incomplete</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-[#0db39e]" />
                   <span className="text-xs font-bold text-slate-600 uppercase">Recovered</span>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Recovered Table */}
      <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center justify-between">
             <div className="flex items-center gap-2 text-[#00458e]">
                <BarChart3 className="h-4 w-4" />
                Top Recovered Orders
             </div>
             <Button variant="ghost" className="text-[10px] font-black uppercase text-indigo-600">View All</Button>
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-slate-50/30 border-b border-slate-100">
                <tr>
                   <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Order ID</th>
                   <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Amount</th>
                   <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date</th>
                   <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                </tr>
             </thead>
             <tbody>
                {(stats?.topRecoveredAmounts || []).map((o: any) => (
                   <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 text-sm">{o.id}</td>
                      <td className="px-6 py-4 font-black text-emerald-600 text-sm">৳ {o.total.toLocaleString()}</td>
                      <td className="px-6 py-4 text-slate-500 text-xs font-medium">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                         <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 uppercase text-[9px] font-black px-2 py-0.5">COVERED</Badge>
                      </td>
                   </tr>
                ))}
                {(!stats?.topRecoveredAmounts || stats.topRecoveredAmounts.length === 0) && (
                   <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No recovered data available yet</td>
                   </tr>
                )}
             </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminRecoveryAnalytics;
