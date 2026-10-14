import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
    <div className="h-44 bg-slate-200 rounded-lg mb-4"></div>
    <div className="h-4 bg-slate-200 rounded w-1/4 mb-3"></div>
    <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
    <div className="space-y-2 mb-4">
      <div className="h-3.5 bg-slate-100 rounded w-full"></div>
      <div className="h-3.5 bg-slate-100 rounded w-5/6"></div>
    </div>
    <div className="h-10 bg-slate-200 rounded-lg w-full"></div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
    <div className="h-12 bg-slate-100 border-b border-slate-200"></div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-16 border-b border-slate-100 flex items-center px-6 gap-4">
        <div className="h-4 bg-slate-200 rounded w-24"></div>
        <div className="h-4 bg-slate-200 rounded flex-1"></div>
        <div className="h-6 bg-slate-200 rounded w-20"></div>
        <div className="h-8 bg-slate-200 rounded w-16"></div>
      </div>
    ))}
  </div>
);

export const DetailSkeleton = () => (
  <div className="max-w-4xl mx-auto py-10 px-4 animate-pulse space-y-6">
    <div className="h-8 bg-slate-200 rounded w-2/3"></div>
    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
    <div className="h-72 bg-slate-200 rounded-xl"></div>
    <div className="space-y-3">
      <div className="h-4 bg-slate-100 rounded w-full"></div>
      <div className="h-4 bg-slate-100 rounded w-full"></div>
      <div className="h-4 bg-slate-100 rounded w-4/5"></div>
    </div>
  </div>
);
