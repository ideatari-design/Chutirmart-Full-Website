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
    <div className="space-y-8 pb-20">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">CMS Management</h1>
          <div className="flex gap-3">
             <Button variant="outline" className="h-10 rounded-lg text-xs font-bold flex items-center gap-2">
                <Eye className="h-4 w-4" /> Preview Live
             </Button>
             <Button className="h-10 bg-[#00458e] hover:bg-blue-800 text-white rounded-lg font-semibold text-xs px-6 flex items-center gap-2 shadow-lg shadow-blue-900/10" onClick={handleSave}>
               <Save className="h-4 w-4" /> Save Changes
             </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#0db39e]/20 overflow-hidden">
        <Tabs defaultValue="about" onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-slate-100 bg-slate-50/50 px-6 pt-6">
            <TabsList className="bg-transparent p-0 h-auto gap-8 flex justify-start items-center">
              <TabsTrigger value="about" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00458e] data-[state=active]:text-[#00458e] data-[state=active]:bg-transparent shadow-none px-0 pb-4 text-xs font-bold uppercase tracking-wider transition-all gap-2 text-slate-400">
                About Us
              </TabsTrigger>
              <TabsTrigger value="contact" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00458e] data-[state=active]:text-[#00458e] data-[state=active]:bg-transparent shadow-none px-0 pb-4 text-xs font-bold uppercase tracking-wider transition-all gap-2 text-slate-400">
                Contact Info
              </TabsTrigger>
              <TabsTrigger value="terms" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00458e] data-[state=active]:text-[#00458e] data-[state=active]:bg-transparent shadow-none px-0 pb-4 text-xs font-bold uppercase tracking-wider transition-all gap-2 text-slate-400">
                Terms
              </TabsTrigger>
              <TabsTrigger value="policy" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00458e] data-[state=active]:text-[#00458e] data-[state=active]:bg-transparent shadow-none px-0 pb-4 text-xs font-bold uppercase tracking-wider transition-all gap-2 text-slate-400">
                Policy
              </TabsTrigger>
              <TabsTrigger value="faq" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00458e] data-[state=active]:text-[#00458e] data-[state=active]:bg-transparent shadow-none px-0 pb-4 text-xs font-bold uppercase tracking-wider transition-all gap-2 text-slate-400">
                FAQs
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-8">
            <TabsContent value="about" className="space-y-8 mt-0 focus-visible:outline-none focus:outline-none border-none">
               <div className="grid gap-6 max-w-4xl">
                  <div className="space-y-2">
                    <Label className="text-[12px] font-semibold text-slate-700">Page Title</Label>
                    <Input 
                      value={content.about.title}
                      onChange={e => setContent({...content, about: {...content.about, title: e.target.value}})}
                      className="h-11 rounded-lg border-slate-200 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[12px] font-semibold text-slate-700">Main Content</Label>
                    <textarea 
                      value={content.about.text}
                      onChange={e => setContent({...content, about: {...content.about, text: e.target.value}})}
                      className="w-full h-80 rounded-lg border border-slate-200 px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium leading-relaxed bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[12px] font-semibold text-slate-700">SEO Meta Description</Label>
                    <Input 
                      value={content.about.metaDescription}
                      onChange={e => setContent({...content, about: {...content.about, metaDescription: e.target.value}})}
                      className="h-11 rounded-lg border-slate-200 text-slate-500 font-medium"
                    />
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-8 mt-0 focus-visible:outline-none focus:outline-none border-none">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                  <div className="space-y-2">
                    <Label className="text-[12px] font-semibold text-slate-700">Store Address</Label>
                    <Input 
                      value={content.contact.address}
                      onChange={e => setContent({...content, contact: {...content.contact, address: e.target.value}})}
                      className="h-11 rounded-lg border-slate-200 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[12px] font-semibold text-slate-700">Support Email</Label>
                    <Input 
                      value={content.contact.email}
                      onChange={e => setContent({...content, contact: {...content.contact, email: e.target.value}})}
                      className="h-11 rounded-lg border-slate-200 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[12px] font-semibold text-slate-700">Phone Number</Label>
                    <Input 
                      value={content.contact.phone}
                      onChange={e => setContent({...content, contact: {...content.contact, phone: e.target.value}})}
                      className="h-11 rounded-lg border-slate-200 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[12px] font-semibold text-slate-700">WhatsApp Number</Label>
                    <Input 
                      value={content.contact.whatsapp}
                      onChange={e => setContent({...content, contact: {...content.contact, whatsapp: e.target.value}})}
                      className="h-11 rounded-lg border-slate-200 font-medium"
                    />
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="terms" className="space-y-8 mt-0 min-h-[400px] flex flex-col items-center justify-center text-center">
               <div className="p-4 bg-slate-50 rounded-full border border-slate-100">
                 <FileText className="h-10 w-10 text-slate-300" />
               </div>
               <div className="space-y-2">
                 <h3 className="text-lg font-bold text-slate-900">Advanced Editor</h3>
                 <p className="text-sm text-slate-500 max-w-xs mx-auto">The rich text editor is under development. You can use basic text area for now.</p>
               </div>
               <Button variant="outline" className="rounded-lg h-10 px-6 font-bold text-xs uppercase tracking-wider">Configure Editor</Button>
            </TabsContent>

            <TabsContent value="policy" className="space-y-8 mt-0 min-h-[400px] flex flex-col items-center justify-center text-center">
               <div className="p-4 bg-[#ecfdfa] rounded-full border border-[#0db39e]/20">
                 <RotateCcw className="h-10 w-10 text-[#0db39e]" />
               </div>
               <div className="space-y-2">
                 <h3 className="text-lg font-bold text-slate-900">Return & Refund Policy</h3>
                 <p className="text-sm text-slate-500 max-w-xs mx-auto">Define how returns are handled for your store items.</p>
               </div>
               <Button className="rounded-lg h-10 px-6 bg-[#00458e] text-white font-bold text-xs uppercase tracking-wider">Edit Policy</Button>
            </TabsContent>

            <TabsContent value="faq" className="space-y-8 mt-0 max-w-4xl focus-visible:outline-none focus:outline-none border-none">
               <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="font-bold text-xl text-slate-900 underline decoration-[#0db39e] decoration-2 underline-offset-8">FAQ Items</h3>
                  <Button className="h-9 bg-[#00458e] hover:bg-blue-800 text-white rounded-lg font-semibold text-[11px] px-4 flex items-center gap-2">
                    <Plus className="h-3.5 w-3.5" /> Add Question
                  </Button>
               </div>
               <div className="space-y-6">
                  {[1, 2].map(i => (
                    <div key={i} className="p-8 bg-slate-50/50 rounded-xl border border-slate-200 relative group transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-200/50">
                       <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50">
                            <Minus className="h-4 w-4" />
                         </Button>
                       </div>
                       <div className="space-y-5">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Question</Label>
                            <Input className="bg-white rounded-lg border-slate-200 font-bold h-11" placeholder="e.g. How can I track my order?" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Answer</Label>
                            <textarea className="w-full bg-white rounded-lg border border-slate-200 p-4 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium leading-relaxed" placeholder="Detailed answer content here..." />
                          </div>
                       </div>
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
