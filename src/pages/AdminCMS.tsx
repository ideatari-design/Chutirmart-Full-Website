import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  FileText,
  Eye,
  Settings,
  Link as LinkIcon,
  Globe
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const AdminCMS = () => {
  const [pages, setPages] = useState([
    { id: '1', title: 'Privacy Policy', slug: 'privacy-policy', lastUpdated: '2024-02-15', status: 'published' },
    { id: '2', title: 'Terms & Conditions', slug: 'terms-and-conditions', lastUpdated: '2024-02-15', status: 'published' },
    { id: '3', title: 'About Us', slug: 'about-us', lastUpdated: '2024-01-10', status: 'published' },
    { id: '4', title: 'Refund Policy', slug: 'refund-policy', lastUpdated: '2024-03-20', status: 'draft' },
  ]);

  const [search, setSearch] = useState('');

  const filteredPages = pages.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
           <div className="flex flex-col space-y-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Content Management</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Create and manage your legal pages, blogs, and custom static content.</p>
           </div>
           <Button className="h-11 bg-[#00458e] hover:bg-blue-800 text-white rounded-xl font-black text-[11px] uppercase px-6 gap-2 shadow-lg shadow-blue-100 transition-all hover:scale-105">
              <PlusCircle className="h-4 w-4" /> Create New Page
           </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
           <div className="relative w-full md:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search pages..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-12 pl-12 rounded-2xl border-slate-100 bg-white shadow-sm font-medium"
              />
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
        <Table>
          <TableHeader className="bg-slate-50/50 border-b border-slate-100">
            <TableRow className="h-14">
              <TableHead className="pl-8 text-[11px] font-black uppercase text-slate-400 tracking-widest">Page Title</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Slug / URL Path</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Last Updated</TableHead>
              <TableHead className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Status</TableHead>
              <TableHead className="text-right pr-8 text-[11px] font-black uppercase text-slate-400 tracking-widest">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPages.map((page) => (
              <TableRow key={page.id} className="h-20 hover:bg-slate-50/50 transition-colors group border-b border-slate-50">
                <TableCell className="pl-8">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200">
                        <FileText className="h-5 w-5" />
                     </div>
                     <span className="text-[14px] font-black text-slate-900">{page.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px] uppercase underline underline-offset-4 decoration-slate-200 decoration-2">
                     <LinkIcon className="h-3 w-3" />
                     /{page.slug}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-[12px] font-bold text-slate-600">{page.lastUpdated}</span>
                </TableCell>
                <TableCell>
                   <Badge className={`rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-widest border-none ${
                     page.status === 'published' ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-100' : 'bg-amber-500 text-white shadow-sm shadow-amber-100'
                   }`}>
                      {page.status}
                   </Badge>
                </TableCell>
                <TableCell className="text-right pr-8">
                   <div className="flex justify-end gap-2">
                      <button className="h-9 w-9 flex items-center justify-center rounded-2xl bg-white text-slate-400 hover:bg-[#00458e] hover:text-white transition-all shadow-sm border border-slate-100">
                         <Eye className="h-4 w-4" />
                      </button>
                      <button className="h-9 w-9 flex items-center justify-center rounded-2xl bg-white text-slate-400 hover:bg-[#00458e] hover:text-white transition-all shadow-sm border border-slate-100">
                         <Edit className="h-4 w-4" />
                      </button>
                      <button className="h-9 w-9 flex items-center justify-center rounded-2xl bg-white text-slate-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-slate-100">
                         <Trash2 className="h-4 w-4" />
                      </button>
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

export default AdminCMS;
