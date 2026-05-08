import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MapPin, 
  CheckCircle2,
  XCircle,
  MoreVertical,
  ChevronDown
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

const AdminDeliveryZones = () => {
  const [search, setSearch] = useState('');
  const [zones, setZones] = useState([
    { id: '1', name: 'Inside Dhaka', region: 'Dhaka City', cost: 60, status: 'active', time: '1-2 days' },
    { id: '2', name: 'Outside Dhaka', region: 'All Districts', cost: 120, status: 'active', time: '3-5 days' },
    { id: '3', name: 'Express delivery', region: 'Dhaka City', cost: 150, status: 'inactive', time: 'Same day' },
  ]);

  const [newZone, setNewZone] = useState({ name: '', region: '', cost: 0, status: 'active', time: '' });
  const [isOpen, setIsOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const filteredZones = zones.filter(z => 
    z.name.toLowerCase().includes(search.toLowerCase()) ||
    z.region.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!newZone.name || !newZone.cost) return;
    const zone = {
      ...newZone,
      id: Math.random().toString(36).substr(2, 9)
    };
    setZones([...zones, zone]);
    setNewZone({ name: '', region: '', cost: 0, status: 'active', time: '' });
    setIsOpen(false);
    toast.success("Delivery zone added successfully!");
  };

  const handleUpdate = () => {
    if (!editingZone || !editingZone.name) return;
    setZones(zones.map(z => z.id === editingZone.id ? editingZone : z));
    setIsEditOpen(false);
    toast.success("Delivery zone updated successfully!");
  };

  const handleDelete = (id: string) => {
    setZones(zones.filter(z => z.id !== id));
    toast.success("Zone deleted successfully");
  };

  const openEdit = (zone: any) => {
    setEditingZone({...zone});
    setIsEditOpen(true);
  };

  const toggleStatus = (id: string) => {
    setZones(zones.map(z => 
      z.id === id ? { ...z, status: z.status === 'active' ? 'inactive' : 'active' } : z
    ));
    toast.success("Status updated");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
             <Truck className="h-8 w-8 text-primary" /> Delivery Zones
           </h2>
           <p className="text-muted-foreground font-medium">Configure shipping rates for different locations</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
           <DialogTrigger nativeButton={true} render={
              <Button className="rounded-xl h-12 px-6 gap-2 bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20">
                <Plus className="h-5 w-5" /> Add New Zone
              </Button>
           } />
           <DialogContent className="rounded-3xl sm:max-w-md">
              <DialogHeader>
                 <DialogTitle className="text-2xl font-black">Add Delivery Zone</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                 <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Zone Name</Label>
                    <Input 
                      placeholder="e.g. Inside Dhaka" 
                      className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
                      value={newZone.name}
                      onChange={e => setNewZone({...newZone, name: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Region/Coverage</Label>
                    <Input 
                      placeholder="e.g. Dhaka City" 
                      className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
                      value={newZone.region}
                      onChange={e => setNewZone({...newZone, region: e.target.value})}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Delivery Cost (৳)</Label>
                       <Input 
                         type="number"
                         placeholder="60" 
                         className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
                         value={newZone.cost}
                         onChange={e => setNewZone({...newZone, cost: parseInt(e.target.value) || 0})}
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Estimated Time</Label>
                       <Input 
                         placeholder="e.g. 1-2 days" 
                         className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
                         value={newZone.time}
                         onChange={e => setNewZone({...newZone, time: e.target.value})}
                       />
                    </div>
                 </div>
              </div>
              <DialogFooter>
                 <Button className="w-full h-12 rounded-xl font-bold uppercase text-xs tracking-widest bg-primary" onClick={handleAdd}>Save Zone</Button>
              </DialogFooter>
           </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-primary/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search delivery zones..." 
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
              <TableHead className="pl-6 h-14 font-bold text-xs uppercase tracking-wider text-slate-500">Zone Details</TableHead>
              <TableHead className="h-14 font-bold text-xs uppercase tracking-wider text-slate-500 text-center">Cost</TableHead>
              <TableHead className="h-14 font-bold text-xs uppercase tracking-wider text-slate-500 text-center">Time</TableHead>
              <TableHead className="h-14 font-bold text-xs uppercase tracking-wider text-slate-500 text-center">Status</TableHead>
              <TableHead className="pr-6 h-14 font-bold text-xs uppercase tracking-wider text-slate-500 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredZones.map((zone) => (
              <TableRow key={zone.id} className="hover:bg-slate-50/50 transition-colors border-b-primary/5">
                <TableCell className="pl-6 py-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{zone.name}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {zone.region}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center font-black text-primary">৳{zone.cost}</TableCell>
                <TableCell className="text-center">
                   <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-600 border-none font-bold text-[10px]">
                      {zone.time}
                   </Badge>
                </TableCell>
                <TableCell className="text-center">
                   <button 
                     onClick={() => toggleStatus(zone.id)}
                     className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                       zone.status === 'active' 
                       ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                       : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                     }`}
                   >
                      {zone.status === 'active' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {zone.status}
                   </button>
                </TableCell>
                <TableCell className="text-right pr-6">
                   <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                        onClick={() => openEdit(zone)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all"
                        onClick={() => handleDelete(zone.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                   </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
           <DialogContent className="rounded-3xl sm:max-w-md">
              <DialogHeader>
                 <DialogTitle className="text-2xl font-black">Edit Delivery Zone</DialogTitle>
              </DialogHeader>
              {editingZone && (
                 <div className="space-y-4 py-4">
                    <div className="space-y-2">
                       <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Zone Name</Label>
                       <Input 
                         placeholder="e.g. Inside Dhaka" 
                         className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
                         value={editingZone.name}
                         onChange={e => setEditingZone({...editingZone, name: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Region/Coverage</Label>
                       <Input 
                         placeholder="e.g. Dhaka City" 
                         className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
                         value={editingZone.region}
                         onChange={e => setEditingZone({...editingZone, region: e.target.value})}
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Delivery Cost (৳)</Label>
                          <Input 
                            type="number"
                            placeholder="60" 
                            className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
                            value={editingZone.cost}
                            onChange={e => setEditingZone({...editingZone, cost: parseInt(e.target.value) || 0})}
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="font-bold text-xs uppercase text-muted-foreground ml-1">Estimated Time</Label>
                          <Input 
                            placeholder="e.g. 1-2 days" 
                            className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
                            value={editingZone.time}
                            onChange={e => setEditingZone({...editingZone, time: e.target.value})}
                          />
                       </div>
                    </div>
                 </div>
              )}
              <DialogFooter>
                 <Button className="w-full h-12 rounded-xl font-bold uppercase text-xs tracking-widest bg-primary" onClick={handleUpdate}>Update Zone</Button>
              </DialogFooter>
           </DialogContent>
        </Dialog>
    </div>
  );
};

export default AdminDeliveryZones;
