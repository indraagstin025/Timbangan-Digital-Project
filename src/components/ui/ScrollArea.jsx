import React from 'react';

// Custom ScrollArea primitive for rendering scrollable content with clean styles
export function ScrollArea({ children, className }) {
  return (
    <div className={`overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full ${className}`}>
      {children}
    </div>
  );
}
