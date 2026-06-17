import React from 'react';

interface AdContainerProps {
  id: string;
  size: string;
  type: 'leaderboard' | 'rectangle' | 'sidebar' | 'mobile-sticky' | 'native';
  className?: string;
  onClose?: () => void;
}

export default function AdContainer({ id, size, type, className = '', onClose }: AdContainerProps) {
  return (
    <div id={id} className={`ad-container ${className}`} style={{ margin: '20px 0' }}>
      <div className="relative bg-[#F9F9F9] dark:bg-[#1E293B] border border-dashed border-[#DDD] dark:border-[#475569] rounded-lg p-2.5 text-center overflow-hidden w-full">
        <div className="text-[9px] uppercase tracking-widest text-[#999] dark:text-[#64748B] mb-1 font-semibold">
          Advertisement
        </div>
        <div className="flex flex-col items-center justify-center p-3 py-4 min-h-[50px]">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Ad Space — {size}
          </div>
        </div>
      </div>
    </div>
  );
}
