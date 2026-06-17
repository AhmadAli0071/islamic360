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
      {onClose && (
        <button onClick={onClose} className="float-right text-xs font-bold text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
      )}
      <ins className="adsbyadsterra"
        style={{ display: 'block', width: '100%', minHeight: type === 'sidebar' ? '250px' : '90px', backgroundColor: 'transparent' }}
        data-zone="29675910"
        data-type="banner" />
    </div>
  );
}
