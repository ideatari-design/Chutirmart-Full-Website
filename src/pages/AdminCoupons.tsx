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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
             <Ticket className="h-8 w-8 text-primary" /> Discount Coupons
           </h2>
           <p className="text-muted-foreground font-medium">Create and manage promo codes for your customers</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
           <DialogTrigger nativeButton={true} render={
              <Button className="rounded-xl h-12 px-6 gap-2 bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20">
                <Plus className="h-5 w-5" /> Create Coupon
              </Button>
           } />
           <DialogContent className="rounded-3xl sm:max-w-md">
              <DialogHeader>
                 <DialogTitle className="text-2xl font-black">Create New Coupon</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                 <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Coupon Code</Label>
                    <Input 
                      placeholder="e.g. SUMMER24" 
                      className="h-12 rounded-xl border-2 focus:border-primary uppercase font-black tracking-widest text-lg" 
                      value={newCoupon.code}
                      onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Discount Value</Label>
                       <Input 
                         type="number"
                         placeholder="10" 
                         className="h-12 rounded-xl" 
                         value={newCoupon.discount}
                         onChange={e => setNewCoupon({...newCoupon, discount: parseInt(e.target.value) || 0})}
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Type</Label>
                       <select 
                         className="w-full h-12 rounded-xl border bg-background px-3 text-sm font-bold outline-none"
                         value={newCoupon.type}
                         onChange={e => setNewCoupon({...newCoupon, type: e.target.value})}
                       >
                         <option value="percentage">Percentage (%)</option>
                         <option value="fixed">Fixed Amount (৳)</option>
                       </select>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Expiry Date</Label>
                    <Input 
                      type="date"
                      className="h-12 rounded-xl" 
                      value={newCoupon.expiry}
                      onChange={e => setNewCoupon({...newCoupon, expiry: e.target.value})}
                    />
                 </div>
              </div>
              <DialogFooter>
                 <Button className="w-full h-12 rounded-xl font-bold uppercase text-xs tracking-widest bg-primary" onClick={handleAdd}>Activate Coupon</Button>
              </DialogFooter>
           </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-primary/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search coupon codes..." 
            className="pl-10 rounded-xl bg-slate-50 border-none h-11" 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-primary/5">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-b-primary/5">
              <TableHead className="pl-6 h-14 font-bold text-xs uppercase tracking-wider text-slate-500">Coupon Code</TableHead>
              <TableHead className="h-14 font-bold text-xs uppercase tracking-wider text-slate-500 text-center">Discount</TableHead>
              <TableHead className="h-14 font-bold text-xs uppercase tracking-wider text-slate-500 text-center">Usages</TableHead>
              <TableHead className="h-14 font-bold text-xs uppercase tracking-wider text-slate-500 text-center">Expiry</TableHead>
              <TableHead className="h-14 font-bold text-xs uppercase tracking-wider text-slate-500 text-center">Status</TableHead>
              <TableHead className="pr-6 h-14 font-bold text-xs uppercase tracking-wider text-slate-500 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCoupons.map((coupon) => (
              <TableRow key={coupon.id} className="hover:bg-slate-50/50 transition-colors border-b-primary/5">
                <TableCell className="pl-6 py-5">
                   <div className="flex items-center gap-2">
                      <code className="px-3 py-1 bg-primary/5 text-primary border border-primary/20 rounded-lg font-black text-sm tracking-widest uppercase">
                        {coupon.code}
                      </code>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" onClick={() => copyToClipboard(coupon.code)}>
                         <Copy className="h-3 w-3" />
                      </Button>
                   </div>
                </TableCell>
                <TableCell className="text-center font-black text-slate-700">
                   {coupon.type === 'percentage' ? `${coupon.discount}%` : `৳${coupon.discount}`}
                </TableCell>
                <TableCell className="text-center font-bold text-slate-500">
                   {coupon.usage}
                </TableCell>
                <TableCell className="text-center">
                   <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <Calendar className="h-3 w-3" /> {coupon.expiry}
                   </div>
                </TableCell>
                <TableCell className="text-center">
                   <Badge className={`rounded-full px-3 py-0.5 border-none font-bold text-[9px] uppercase tracking-tighter ${
                     coupon.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'
                   }`}>
                      {coupon.status}
                   </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                   <div className="flex justify-end gap-2 text-muted-foreground">
                      <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all" onClick={() => handleDelete(coupon.id)}>
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
