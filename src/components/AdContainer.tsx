import React from 'react';

interface AdContainerProps {
  id: string;
  size: string; // e.g. "728x90", "300x250", "300x600", "320x50"
  type: 'leaderboard' | 'rectangle' | 'sidebar' | 'mobile-sticky' | 'native';
  className?: string;
  onClose?: () => void;
}

export default function AdContainer({ id, size, type, className = '', onClose }: AdContainerProps) {
  // Respecting Tablet/Mobile responsive visibility rules
  let responsiveClasses = 'ad-container ';
  if (type === 'sidebar') {
    responsiveClasses += 'hidden md:block md:sticky md:top-24 ';
  } else if (type === 'mobile-sticky') {
    responsiveClasses += 'fixed bottom-14 left-0 right-0 z-50 md:hidden flex justify-center items-center ';
  } else if (type === 'leaderboard') {
    responsiveClasses += 'w-full max-w-4xl mx-auto ';
  }

  return (
    <div
      id={id}
      className={`${responsiveClasses} ${className}`}
      style={{
        margin: type === 'mobile-sticky' ? '0' : '20px 0',
      }}
    >
      <div className={`relative bg-[#F9F9F9] dark:bg-[#1E293B] border border-dashed border-[#DDD] dark:border-[#475569] rounded-lg p-2.5 text-center overflow-hidden transition-all duration-300 w-full`}>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-1 right-2 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
            aria-label="Close Advertisement"
          >
            ✕
          </button>
        )}
        
        {/* Ad label */}
        <div className="text-[9px] uppercase tracking-widest text-[#999] dark:text-[#64748B] mb-1 font-semibold">
          {type === 'native' ? 'Sponsored' : 'Advertisement'}
        </div>

        {/* Ad Placeholder Content */}
        <div className="flex flex-col items-center justify-center p-3 py-4 min-h-[50px]">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Ad Space — {size}
          </div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
            Supports doubleclick, AdSense & Direct sales networks
          </div>
        </div>
      </div>
    </div>
  );
}
