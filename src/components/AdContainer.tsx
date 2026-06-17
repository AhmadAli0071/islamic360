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
        {onClose && (
          <button onClick={onClose} className="absolute top-1 right-2 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">✕</button>
        )}
        <div className="text-[9px] uppercase tracking-widest text-[#999] dark:text-[#64748B] mb-1 font-semibold">
          Advertisement
        </div>
        <ins className="adsbyadsterra"
          style={{ display: 'block', minHeight: type === 'sidebar' ? '250px' : '90px' }}
          data-zone="29675910"
          data-type="banner" />
      </div>
    </div>
  );
}
