import React from 'react';

interface AdContainerProps {
  id: string;
  size: string;
  type: 'leaderboard' | 'rectangle' | 'sidebar' | 'mobile-sticky' | 'native';
  className?: string;
  onClose?: () => void;
}

const ZONE_MAP: Record<string, string> = {
  'ad-sidebar-desktop-rectangle': '29675910',
  'ad-sidebar-desktop-tower': '29675910',
  'ad-leaderboard-1': '29675910',
  'ad-content-1': '29675910',
  'ad-content-2': '29675910',
  'ad-calendar-bottom': '29675910',
  'ad-history-sidebar': '29675910',
  'ad-history-content': '29675910',
  'ad-prayer-bottom': '29675910',
  'ad-qibla-bottom': '29675910',
  'ad-academy-header': '29675910',
  'ad-academy-content': '29675910',
};

export default function AdContainer({ id, size }: AdContainerProps) {
  const zone = ZONE_MAP[id] || '29675910';
  return (
    <div className="ad-container w-full" style={{ margin: '20px 0' }}>
      <div className="relative bg-[#F9F9F9] dark:bg-[#1E293B] border border-dashed border-[#DDD] dark:border-[#475569] rounded-lg p-2.5 text-center w-full min-h-[90px] flex flex-col items-center justify-center">
        <ins
          className="adsbyadsterra"
          data-zone={zone}
          data-type="banner"
          style={{ display: 'block', width: '100%', maxWidth: '728px', margin: '0 auto' }}
        />
      </div>
    </div>
  );
}
