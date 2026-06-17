import React from 'react';

interface AdContainerProps {
  id: string;
  size: string;
  type: 'leaderboard' | 'rectangle' | 'sidebar' | 'mobile-sticky' | 'native';
  className?: string;
  onClose?: () => void;
}

const HEIGHT_MAP: Record<string, string> = {
  'ad-leaderboard-1': '100px',
  'ad-content-1': '280px',
  'ad-content-2': '100px',
  'ad-calendar-bottom': '100px',
  'ad-history-sidebar': '280px',
  'ad-history-content': '100px',
  'ad-prayer-bottom': '100px',
  'ad-qibla-bottom': '100px',
  'ad-academy-header': '100px',
  'ad-academy-content': '100px',
};

export default function AdContainer({ id }: AdContainerProps) {
  const minHeight = HEIGHT_MAP[id] || '260px';
  return (
    <div className="ad-container w-full" style={{ margin: '16px 0', minHeight, background: '#F9F9F9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ins
        className="adsbyadsterra"
        data-zone="29675910"
        data-type="banner"
        style={{ display: 'block', width: '100%', maxWidth: '728px' }}
      />
    </div>
  );
}
