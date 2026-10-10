import React from "react";

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm animate-pulse flex flex-col justify-between h-[210px]">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-200" />
          <div className="w-16 h-6 rounded-full bg-slate-200" />
        </div>
        <div className="space-y-2">
          <div className="w-3/4 h-5 rounded bg-slate-200" />
          <div className="w-1/2 h-3.5 rounded bg-slate-200" />
        </div>
      </div>
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-baseline justify-between">
        <div className="w-16 h-3 rounded bg-slate-200" />
        <div className="w-20 h-6 rounded bg-slate-200" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
