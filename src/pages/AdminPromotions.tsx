import React, { useState } from 'react';
import { 
  Zap, 
  Clock, 
  Target, 
  MousePointer2, 
  ArrowRight,
  Sparkles,
  BarChart,
  Megaphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminPromotions = () => {
  const campaigns = [
    { id: 1, name: 'Summer Mega Sale', reach: '12.4k', clicks: 840, conversion: '6.2%', status: 'Active', color: 'bg-emerald-500' },
    { id: 2, name: 'Free Shipping Weekend', reach: '5.2k', clicks: 310, conversion: '4.1%', status: 'Scheduled', color: 'bg-amber-500' },
    { id: 3, name: 'Flash Deal Friday', reach: '20.1k', clicks: 1.2, conversion: '8.4%', status: 'Active', color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col space-y-2">
         <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
           <Megaphone className="h-8 w-8 text-[#00458e]" />
           Promotions Center
         </h1>
         <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em]">Boost your sales with targeted campaigns and flash deals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Flash Sales', icon: <Zap className="h-6 w-6" />, desc: 'Limited time urgency offers', count: 12, color: 'text-amber-500' },
          { label: 'Bulk Discount', icon: <Target className="h-6 w-6" />, desc: 'Quantity based pricing', count: 5, color: 'text-indigo-500' },
          { label: 'Ad Campaigns', icon: <BarChart className="h-6 w-6" />, desc: 'Track external traffic', count: 8, color: 'text-blue-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 group cursor-pointer hover:scale-[1.02] transition-all">
             <div className={`h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:text-white transition-colors ${stat.color}`}>
                {stat.icon}
             </div>
             <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{stat.label}</p>
                <h4 className="text-2xl font-black text-slate-900">{stat.count} Active</h4>
                <p className="text-xs text-slate-500 font-medium">{stat.desc}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
         <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-black text-lg text-slate-900 tracking-tight flex items-center gap-2">
               <Sparkles className="h-5 w-5 text-amber-400" /> Recent Campaign Performance
            </h3>
            <Button variant="ghost" className="text-[11px] font-black uppercase tracking-widest text-[#00458e] gap-2">
               View All Reports <ArrowRight className="h-4 w-4" />
            </Button>
         </div>
         <div className="p-8">
            <div className="space-y-4">
               {campaigns.map((camp) => (
                 <div key={camp.id} className="flex flex-wrap items-center justify-between p-6 bg-slate-50 rounded-3xl border border-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 min-w-[200px]">
                       <div className={`h-3 w-3 rounded-full ${camp.color} animate-pulse`} />
                       <div>
                          <p className="font-black text-slate-900">{camp.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{camp.status}</p>
                       </div>
                    </div>
                    <div className="flex gap-12">
                       <div className="text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Reach</p>
                          <p className="text-sm font-black text-slate-900">{camp.reach}</p>
                       </div>
                       <div className="text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Clicks</p>
                          <p className="text-sm font-black text-slate-900">{camp.clicks}</p>
                       </div>
                       <div className="text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Conv.</p>
                          <p className="text-sm font-black text-emerald-600">{camp.conversion}</p>
                       </div>
                    </div>
                    <Button className="h-10 bg-white border border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white rounded-xl text-xs font-black px-6 shadow-sm">
                       Manage
                    </Button>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminPromotions;
