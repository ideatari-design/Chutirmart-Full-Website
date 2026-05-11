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
    <div className="space-y-8 pb-20">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Delivery Zones</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger nativeButton={true} render={
              <Button className="h-10 bg-[#00458e] hover:bg-blue-800 text-white rounded-lg font-semibold text-xs px-5 flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add New Zone
              </Button>
            } />
            <DialogContent className="rounded-xl sm:max-w-md border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-slate-900">Add Delivery Zone</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-4">
                <div className="space-y-2">
                  <Label className="text-[12px] font-semibold text-slate-700">Zone Name</Label>
                  <Input 
                    placeholder="e.g. Inside Dhaka" 
                    className="h-11 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 font-medium" 
                    value={newZone.name}
                    onChange={e => setNewZone({...newZone, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] font-semibold text-slate-700">Region/Coverage</Label>
                  <Input 
                    placeholder="e.g. Dhaka City" 
                    className="h-11 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 font-medium" 
                    value={newZone.region}
                    onChange={e => setNewZone({...newZone, region: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[12px] font-semibold text-slate-700">Delivery Cost (৳)</Label>
                    <Input 
                      type="number"
                      placeholder="60" 
                      className="h-11 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 font-medium" 
                      value={newZone.cost}
                      onChange={e => setNewZone({...newZone, cost: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[12px] font-semibold text-slate-700">Estimated Time</Label>
                    <Input 
                      placeholder="e.g. 1-2 days" 
                      className="h-11 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 font-medium" 
                      value={newZone.time}
                      onChange={e => setNewZone({...newZone, time: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="flex gap-3">
                <Button variant="outline" className="h-11 rounded-lg text-xs font-bold" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button className="h-11 rounded-lg bg-[#00458e] text-white text-xs font-bold px-8" onClick={handleAdd}>Save Zone</Button>
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
                  placeholder="Search zone..." 
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
              <TableHead className="text-[12px] font-medium text-slate-600">Zone Details</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600 text-center">Cost</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600 text-center">Time</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600 text-center">Status</TableHead>
              <TableHead className="text-[12px] font-medium text-slate-600 text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredZones.map((zone) => (
              <TableRow key={zone.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 h-20">
                <TableCell className="pl-6"><div className="w-4 h-4 border border-slate-200 rounded"></div></TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-slate-900">{zone.name}</span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <MapPin className="h-3 w-3 text-slate-300" /> {zone.region}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-[13px] font-bold text-[#00458e]">৳{zone.cost}</span>
                </TableCell>
                <TableCell className="text-center">
                   <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">
                      {zone.time}
                   </span>
                </TableCell>
                <TableCell className="text-center">
                   <button 
                     onClick={() => toggleStatus(zone.id)}
                     className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                       zone.status === 'active' 
                       ? 'bg-green-50 text-[#0db39e]' 
                       : 'bg-slate-50 text-slate-400'
                     }`}
                   >
                      {zone.status === 'active' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {zone.status}
                   </button>
                </TableCell>
                <TableCell className="text-right pr-6">
                   <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#00458e] hover:bg-blue-50" onClick={() => openEdit(zone)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(zone.id)}>
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
        <DialogContent className="rounded-xl sm:max-w-md border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Edit Delivery Zone</DialogTitle>
          </DialogHeader>
          {editingZone && (
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-700">Zone Name</Label>
                <Input 
                  className="h-11 rounded-lg border-slate-200 font-medium" 
                  value={editingZone.name}
                  onChange={e => setEditingZone({...editingZone, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-700">Region/Coverage</Label>
                <Input 
                  className="h-11 rounded-lg border-slate-200 font-medium" 
                  value={editingZone.region}
                  onChange={e => setEditingZone({...editingZone, region: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[12px] font-semibold text-slate-700">Delivery Cost (৳)</Label>
                  <Input 
                    type="number"
                    className="h-11 rounded-lg border-slate-200 font-medium" 
                    value={editingZone.cost}
                    onChange={e => setEditingZone({...editingZone, cost: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] font-semibold text-slate-700">Estimated Time</Label>
                  <Input 
                    className="h-11 rounded-lg border-slate-200 font-medium" 
                    value={editingZone.time}
                    onChange={e => setEditingZone({...editingZone, time: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-3">
             <Button variant="outline" className="h-11 rounded-lg text-xs font-bold" onClick={() => setIsEditOpen(false)}>Cancel</Button>
             <Button className="h-11 rounded-lg bg-[#00458e] text-white text-xs font-bold px-8" onClick={handleUpdate}>Update Zone</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDeliveryZones;
