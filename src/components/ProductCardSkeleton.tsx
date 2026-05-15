import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white flex flex-col h-full rounded-xl md:rounded-3xl border border-slate-100 overflow-hidden">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-col flex-grow p-3 md:p-5 pt-4 space-y-3">
        <Skeleton className="h-5 md:h-6 w-3/4" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-16 md:w-20" />
          <Skeleton className="h-6 md:h-8 w-24 md:w-32" />
        </div>
        <div className="w-full flex flex-col gap-2 md:gap-3 pt-2 md:pt-4 mt-auto">
          <Skeleton className="h-10 md:h-14 w-full rounded-lg md:rounded-2xl" />
          <Skeleton className="h-10 md:h-14 w-full rounded-lg md:rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
