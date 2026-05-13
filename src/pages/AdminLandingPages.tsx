import React from 'react';
import { 
  Layout, 
  MousePointer2, 
  PlusCircle, 
  Settings, 
  Play,
  Monitor,
  Smartphone,
  ChevronRight,
  AppWindow,
  LayoutGrid,
  FileBox,
  Sliders
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const builderOptions = [
  {
    title: 'Single Product Landing Page',
    description: 'Build a landing page for a single product to increase sales.',
    icon: <Monitor className="h-7 w-7 text-white" />,
    color: 'from-purple-500 to-indigo-600',
    path: '/admin/landing-pages/single'
  },
  {
    title: 'Multiple Products Landing Page',
    description: 'Showcase 3-4 products together on a single landing page.',
    icon: <LayoutGrid className="h-7 w-7 text-white" />,
    color: 'from-blue-500 to-cyan-600',
    path: '/admin/landing-pages/multiple'
  },
  {
    title: 'All Landing Pages',
    description: 'View and manage all the landing pages you have created.',
    icon: <FileBox className="h-7 w-7 text-white" />,
    color: 'from-emerald-500 to-teal-600',
    path: '/admin/landing-pages/list'
  },
  {
    title: 'Landing Page Settings',
    description: 'From this page you can set landing page delivery charge, footer text etc.',
    icon: <Sliders className="h-7 w-7 text-white" />,
    color: 'from-amber-500 to-orange-600',
    path: '/admin/landing-pages/settings'
  }
];

const AdminLandingPages = () => {
  return (
    <div className="space-y-12 pb-20">
      <div className="text-center space-y-4">
         <div className="flex justify-center">
            <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
               <Layout className="h-8 w-8" />
            </div>
         </div>
         <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Landing Page</h1>
            <p className="text-slate-500 text-sm font-medium">Here you will see how to make a landing page in Ojala Shop</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {builderOptions.map((option, i) => (
          <Link 
            key={i} 
            to={option.path}
            className="group flex flex-col items-center text-center space-y-6"
          >
            <div className={`h-24 w-24 rounded-[32px] bg-gradient-to-br ${option.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-500 relative`}>
               <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity rounded-[32px]"></div>
               {option.icon}
            </div>
            <div className="space-y-3 px-4">
               <h3 className="font-black text-slate-900 text-base leading-tight group-hover:text-primary transition-colors">{option.title}</h3>
               <p className="text-xs text-slate-400 font-medium leading-relaxed">{option.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center pt-10">
         <Button variant="ghost" className="rounded-full gap-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-bold px-6 border border-rose-100 shadow-sm transition-all hover:shadow-md">
            <Play className="h-4 w-4 fill-current" /> Watch Tutorial Video
         </Button>
      </div>
    </div>
  );
};

export default AdminLandingPages;
