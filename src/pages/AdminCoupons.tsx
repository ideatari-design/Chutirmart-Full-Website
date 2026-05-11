import React, { useState } from 'react';
import { 
  Ticket, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Copy,
  CheckCircle2,
  XCircle,
  Calendar,
  Percent
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const AdminCoupons = () => {
  const [search, setSearch] = useState('');
  const [coupons, setCoupons] = useState([
    { id: '1', code: 'WELCOME10', discount: 10, type: 'percentage', expiry: '2024-12-31', status: 'active', usage: 156 },
    { id: '2', code: 'EID2024', discount: 200, type: 'fixed', expiry: '2024-06-30', status: 'active', usage: 890 },
    { id: '3', code: 'OFF50', discount: 50, type: 'percentage', expiry: '2024-05-01', status: 'expired', usage: 45 },
  ]);

  const [newCoupon, setNewCoupon] = useState({ code: '', discount: 0, type: 'percentage', expiry: '', status: 'active' });
  const [isOpen, setIsOpen] = useState(false);

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!newCoupon.code || !newCoupon.discount) return;
    setCoupons([...coupons, { ...newCoupon, id: Math.random().toString(36).substr(2, 9), usage: 0 } as any]);
    setNewCoupon({ code: '', discount: 0, type: 'percentage', expiry: '', status: 'active' });
    setIsOpen(false);
    toast.success("Coupon created successfully!");
  };

  const handleDelete = (id: string) => {
    setCoupons(coupons.filter(c => c.id !== id));
    toast.success("Coupon deleted");
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Coupons</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger nativeButton={true} render={
              <Button className="h-10 bg-[#00458e] hover:bg-blue-800 text-white rounded-lg font-semibold text-xs px-5 flex items-center gap-2">
                <Plus className="h-4 w-4" /> Create Coupon
              </Button>
            } />
            <DialogContent className="rounded-xl sm:max-w-md border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-slate-900">Create New Coupon</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-4">
                <div className="space-y-2">
                  <Label className="text-[12px] font-semibold text-slate-700">Coupon Code</Label>
                  <Input 
                    placeholder="e.g. SUMMER25" 
                    className="h-11 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 font-bold uppercase tracking-wider" 
                    value={newCoupon.code}
                    onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[12px] font-semibold text-slate-700">Discount Value</Label>
                    <Input 
                      type="number"
                      placeholder="10" 
                      className="h-11 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 font-medium" 
                      value={newCoupon.discount}
                      onChange={e => setNewCoupon({...newCoupon, discount: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[12px] font-semibold text-slate-700">Type</Label>
                    <select 
                      className="w-full h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium outline-none"
                      value={newCoupon.type}
                      onChange={e => setNewCoupon({...newCoupon, type: e.target.value})}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed (৳)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] font-semibold text-slate-700">Expiry Date</Label>
                  <Input 
                    type="date"
                    className="h-11 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 font-medium" 
                    value={newCoupon.expiry}
                    onChange={e => setNewCoupon({...newCoupon, expiry: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter className="flex gap-3">
                <Button variant="outline" className="h-11 rounded-lg text-xs font-bold" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button className="h-11 rounded-lg bg-[#00458e] text-white text-xs font-bold px-8" onClick={handleAdd}>Activate Code</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
             <div className="flex items-center">
                <select className="h-10 px-4 pr-10 border border-slate-200 rounded-lg text-sm font-medium bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option>Bulk Action</option>
                </select>
                <div className="pointer-events-none -ml-8 flex items-center px-2 text-slate-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
                <Button className="h-10 ml-3 bg-[#00458e] hover:bg-blue-800 text-white px-6 rounded-lg font-semibold text-xs">Apply</Button>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search code..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 w-[300px] border-slate-200 rounded-lg text-sm bg-white" 
                />
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden border border-[#0db39e]/20 shadow-sm">
        <Table>
          <TableHeader className="bg-[#ecfdfa]">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="pl-6 w-12"><div className="w-4 h-4 border border-[#0db39e] rounded bg-[#0db39e]/10"></div></TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600">Coupon Code</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600 text-center">Discount</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600 text-center">Usages</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600 text-center">Expiry</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600 text-center">Status</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600 text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCoupons.map((coupon) => (
              <TableRow key={coupon.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 h-16">
                <TableCell className="pl-6"><div className="w-4 h-4 border border-slate-200 rounded"></div></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-[#00458e] border border-blue-100 rounded text-[11px] font-bold tracking-widest uppercase">
                       {coupon.code}
                    </span>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400" onClick={() => copyToClipboard(coupon.code)}>
                       <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-[13px] font-bold text-slate-800">
                    {coupon.type === 'percentage' ? `${coupon.discount}%` : `৳ ${coupon.discount.toLocaleString()}`}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-[12px] font-medium text-slate-500">{coupon.usage}</span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-slate-300" />
                    {coupon.expiry}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                   <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                     coupon.status === 'active' ? 'bg-green-50 text-[#0db39e]' : 'bg-slate-50 text-slate-400'
                   }`}>
                      {coupon.status}
                   </span>
                </TableCell>
                <TableCell className="text-right pr-6">
                   <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#00458e] hover:bg-blue-50">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(coupon.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                   </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminCoupons;
