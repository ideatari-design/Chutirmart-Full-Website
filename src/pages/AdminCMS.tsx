import React, { useState } from 'react';
import { 
  FileText, 
  Save, 
  Eye, 
  History,
  Info,
  Phone,
  ShieldAlert,
  RotateCcw,
  HelpCircle,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const AdminCMS = () => {
  const [activeTab, setActiveTab] = useState('about');
  
  const [content, setContent] = useState({
    about: {
      title: 'About Our Shop',
      text: 'Ojala Shop is committed to providing high-quality products to our customers in Bangladesh. We started our journey in 2024 with a vision to redefine the online shopping experience.',
      metaDescription: 'Learn more about Ojala Shop - the best online shopping destination in Bangladesh.'
    },
    contact: {
      address: 'Plot 12, Road 5, Block B, Nikunja 2, Dhaka 1229',
      phone: '01812345678',
      email: 'support@ojala.com',
      whatsapp: '01812345678'
    },
    terms: {
      title: 'Terms & Conditions',
      text: 'By using Ojala Shop, you agree to comply with our policies. We reserve the right to change these terms at any time...',
    },
    return_policy: {
      title: 'Return & Refund Policy',
      text: 'We offer a 7-day return policy for unused items in original packaging. Refunds are processed within 3-5 working days.',
    }
  });

  const handleSave = () => {
    toast.success(`${activeTab.toUpperCase()} content saved successfully!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
             <FileText className="h-8 w-8 text-primary" /> Content Management (CMS)
           </h2>
           <p className="text-muted-foreground font-medium">Manage your store's static pages and information</p>
        </div>
        
        <div className="flex gap-2">
           <Button variant="outline" className="rounded-xl h-12 shadow-sm border-slate-200 gap-2">
              <Eye className="h-4 w-4" /> Preview Live
           </Button>
           <Button className="rounded-xl h-12 px-6 gap-2 bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20" onClick={handleSave}>
             <Save className="h-5 w-5" /> Save Changes
           </Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-primary/5 p-2 overflow-hidden">
        <Tabs defaultValue="about" onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-50 p-1 rounded-2xl h-auto mb-6 flex flex-wrap gap-1">
            <TabsTrigger value="about" className="rounded-xl h-11 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-bold transition-all gap-2">
              <Info className="h-4 w-4" /> About Us
            </TabsTrigger>
            <TabsTrigger value="contact" className="rounded-xl h-11 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-bold transition-all gap-2">
              <Phone className="h-4 w-4" /> Contact Info
            </TabsTrigger>
            <TabsTrigger value="terms" className="rounded-xl h-11 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-bold transition-all gap-2">
              <ShieldAlert className="h-4 w-4" /> Terms & Conditions
            </TabsTrigger>
            <TabsTrigger value="policy" className="rounded-xl h-11 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-bold transition-all gap-2">
              <RotateCcw className="h-4 w-4" /> Return Policy
            </TabsTrigger>
            <TabsTrigger value="faq" className="rounded-xl h-11 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-bold transition-all gap-2">
              <HelpCircle className="h-4 w-4" /> FAQs
            </TabsTrigger>
          </TabsList>

          <div className="p-4 sm:p-6 lg:p-8">
            <TabsContent value="about" className="space-y-6 mt-0">
               <div className="space-y-4 max-w-4xl">
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-800 ml-1">Page Title</Label>
                    <Input 
                      value={content.about.title}
                      onChange={e => setContent({...content, about: {...content.about, title: e.target.value}})}
                      className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-bold text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-800 ml-1">Page Content</Label>
                    <textarea 
                      value={content.about.text}
                      onChange={e => setContent({...content, about: {...content.about, text: e.target.value}})}
                      className="w-full h-64 rounded-2xl border bg-background px-4 py-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 shadow-sm font-medium leading-relaxed"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-800 ml-1 flex items-center gap-2">
                      Meta Description <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-400 font-normal">SEO</span>
                    </Label>
                    <Input 
                      value={content.about.metaDescription}
                      onChange={e => setContent({...content, about: {...content.about, metaDescription: e.target.value}})}
                      className="h-12 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all text-muted-foreground"
                    />
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6 mt-0">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-800 ml-1">Store Address</Label>
                    <Input 
                      value={content.contact.address}
                      onChange={e => setContent({...content, contact: {...content.contact, address: e.target.value}})}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-800 ml-1">Support Email</Label>
                    <Input 
                      value={content.contact.email}
                      onChange={e => setContent({...content, contact: {...content.contact, email: e.target.value}})}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-800 ml-1">Phone Number</Label>
                    <Input 
                      value={content.contact.phone}
                      onChange={e => setContent({...content, contact: {...content.contact, phone: e.target.value}})}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-800 ml-1">WhatsApp Number</Label>
                    <Input 
                      value={content.contact.whatsapp}
                      onChange={e => setContent({...content, contact: {...content.contact, whatsapp: e.target.value}})}
                      className="h-12 rounded-xl"
                    />
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="terms" className="space-y-6 mt-0 text-center py-20">
               <FileText className="h-16 w-16 text-slate-200 mx-auto" />
               <p className="text-slate-400 font-medium italic">Rich text editor for Terms & Conditions coming soon...</p>
               <Button variant="outline" className="rounded-xl font-bold">Use Basic Text Editor Instead</Button>
            </TabsContent>

            <TabsContent value="policy" className="space-y-6 mt-0 text-center py-20">
               <RotateCcw className="h-16 w-16 text-slate-200 mx-auto" />
               <p className="text-slate-400 font-medium italic">Return policy editor feature under construction</p>
            </TabsContent>

            <TabsContent value="faq" className="space-y-6 mt-0 max-w-4xl">
               <div className="flex items-center justify-between">
                  <h3 className="font-black text-xl text-slate-800">Frequently Asked Questions</h3>
                  <Button className="rounded-xl h-10 gap-2 bg-slate-900 text-white hover:bg-slate-800 font-bold">
                    <Plus className="h-4 w-4" /> Add FAQ Item
                  </Button>
               </div>
               <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                       <HelpCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                       <div className="space-y-3 flex-grow">
                          <Input className="bg-white rounded-xl border-none font-bold" placeholder="Question Title" />
                          <textarea className="w-full bg-white rounded-xl border-none p-3 text-sm min-h-[100px]" placeholder="Answer Content" />
                       </div>
                       <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/5 rounded-lg">
                          <Minus className="h-4 w-4" />
                       </Button>
                    </div>
                  ))}
               </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

const Minus = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14"/>
  </svg>
);

export default AdminCMS;
