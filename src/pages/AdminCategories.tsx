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
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ImageIcon,
  Tags
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

const AdminCategories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'স্মার্টফোন', slug: 'smartphones', productCount: 124, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=200' },
    { id: 2, name: 'হোম ও ডেকর', slug: 'home-decor', productCount: 89, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e3a38?auto=format&fit=crop&q=80&w=200' },
    { id: 3, name: 'মেকআপ', slug: 'makeup', productCount: 56, image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=200' },
    { id: 4, name: 'অটোপার্টস', slug: 'autoparts', productCount: 42, image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=200' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-black flex items-center gap-3">
              <Tags className="h-8 w-8 text-primary" />
              ক্যাটাগরি ম্যানেজমেন্ট
           </h2>
           <p className="text-muted-foreground font-medium">আপনার শপের সকল ক্যাটাগরি এখান থেকে নিয়ন্ত্রণ করুন</p>
        </div>
        <Dialog>
           <DialogTrigger render={
              <Button className="rounded-xl h-12 px-6 gap-2 bg-primary hover:bg-primary/90 font-bold">
                <Plus className="h-5 w-5" /> নতুন ক্যাটাগরি
              </Button>
           } />
           <DialogContent className="rounded-[2rem] sm:max-w-md">
              <DialogHeader>
                 <DialogTitle className="text-xl font-black">নতুন ক্যাটাগরি তৈরি করুন</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                 <div className="space-y-2">
                    <Label className="font-bold">ক্যাটাগরির নাম (বাংলা)</Label>
                    <Input placeholder="যেমন: ফ্যাশন" className="h-12 rounded-xl" />
                 </div>
                 <div className="space-y-2">
                    <Label className="font-bold">স্লাগ (Slug)</Label>
                    <Input placeholder="যেমন: fashion" className="h-12 rounded-xl" />
                 </div>
                 <div className="space-y-2">
                    <Label className="font-bold">ইমেজ URL</Label>
                    <div className="flex gap-2">
                       <Input placeholder="https://..." className="h-12 rounded-xl" />
                       <Button variant="secondary" className="h-12 rounded-xl">
                          <ImageIcon className="h-5 w-5" />
                       </Button>
                    </div>
                 </div>
              </div>
              <DialogFooter>
                 <Button className="w-full h-12 rounded-xl font-bold uppercase text-xs">সেভ করুন</Button>
              </DialogFooter>
           </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 py-4 px-6 bg-white rounded-2xl shadow-sm border border-primary/5">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="ক্যাটাগরির নাম দিয়ে খুঁজুন..." 
            className="pl-10 rounded-xl bg-secondary/20 border-none" 
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-primary/5">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="pl-6 font-bold text-primary">ইমেজ</TableHead>
              <TableHead className="font-bold text-primary">নাম</TableHead>
              <TableHead className="font-bold text-primary">স্লাগ</TableHead>
              <TableHead className="font-bold text-primary">পণ্য সংখ্যা</TableHead>
              <TableHead className="font-bold text-primary text-right pr-6">অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id} className="hover:bg-secondary/10 transition-colors border-b-primary/5">
                <TableCell className="pl-6 py-4">
                   <div className="w-12 h-12 bg-secondary/50 rounded-xl overflow-hidden border">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                   </div>
                </TableCell>
                <TableCell className="font-bold text-primary">{cat.name}</TableCell>
                <TableCell className="text-muted-foreground font-medium">{cat.slug}</TableCell>
                <TableCell>
                   <Badge variant="outline" className="font-bold border-primary/20 text-primary">{cat.productCount}টি পণ্য</Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                   <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary hover:bg-primary/5 rounded-lg">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive hover:bg-destructive/5 rounded-lg">
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

export default AdminCategories;
