import React from 'react';
import { Terminal } from 'lucide-react';

const PlaceholderPage = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-text-faint relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>
      <Terminal className="h-12 w-12 mb-6 text-indigo-500/50" />
      <h2 className="text-xl font-light text-text-main tracking-tight">{title}</h2>
      <p className="mt-3 text-xs font-mono uppercase tracking-widest text-text-fainter">Module offline / Under construction</p>
    </div>
  );
};

export default PlaceholderPage;
