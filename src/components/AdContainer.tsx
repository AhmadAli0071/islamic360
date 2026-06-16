import React, { useEffect, useRef, useState } from 'react';
import { AD_CONFIG, getAdNetworkForPlacement } from '../config/ads';
import { useAdNetwork } from '../hooks/useAdNetwork';

interface AdContainerProps {
  id: string;
  size: string;
  type: 'leaderboard' | 'rectangle' | 'sidebar' | 'mobile-sticky' | 'native';
  className?: string;
  onClose?: () => void;
}

export default function AdContainer({ id, size, type, className = '', onClose }: AdContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [adReady, setAdReady] = useState(false);
  const { loading, loaded, error, network } = useAdNetwork(id);

  let responsiveClasses = 'ad-container ';
  if (type === 'sidebar') {
    responsiveClasses += 'hidden md:block md:sticky md:top-24 ';
  } else if (type === 'mobile-sticky') {
    responsiveClasses += 'fixed bottom-14 left-0 right-0 z-50 md:hidden flex justify-center items-center ';
  } else if (type === 'leaderboard') {
    responsiveClasses += 'w-full max-w-4xl mx-auto ';
  }

  // Load real ad when network is ready
  useEffect(() => {
    if (loaded && network && containerRef.current) {
      const timer = setTimeout(() => setAdReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [loaded, network]);

  // Real ad rendering based on network
  const renderRealAd = () => {
    if (!network || !adReady) return null;

    switch (network) {
      case 'adsterra': {
        const zoneId = (AD_CONFIG.adsterra.banners as any)[id]?.zoneId;
        if (!zoneId) return null;
        return (
          <ins className="adsbyadsterra"
            style={{ display: 'block' }}
            data-zone={zoneId}
            data-type={type === 'mobile-sticky' ? 'anchor' : 'banner'} />
        );
      }
      case 'admaven': {
        const zoneId = (AD_CONFIG.admaven.banner as any)[id]?.zoneId;
        if (!zoneId) return null;
        return (
          <div data-admaven-zone={zoneId}
            className="admaven-ad-unit" />
        );
      }
      case 'propellerads':
        return (
          <div data-propeller-zone={AD_CONFIG.propellerads.banners.zoneId}
            className="propeller-ad-unit" />
        );
      default:
        return null;
    }
  };

  return (
    <div
      id={id}
      ref={containerRef}
      className={`${responsiveClasses} ${className}`}
      style={{ margin: type === 'mobile-sticky' ? '0' : '20px 0' }}
    >
      <div className="relative bg-[#F9F9F9] dark:bg-[#1E293B] border border-dashed border-[#DDD] dark:border-[#475569] rounded-lg p-2.5 text-center overflow-hidden transition-all duration-300 w-full">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-1 right-2 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
            aria-label="Close Advertisement"
          >
            ✕
          </button>
        )}

        <div className="text-[9px] uppercase tracking-widest text-[#999] dark:text-[#64748B] mb-1 font-semibold">
          {type === 'native' ? 'Sponsored' : 'Advertisement'}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Real ad */}
        {!loading && loaded && network && renderRealAd()}

        {/* Error / fallback */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center p-3 py-4 min-h-[50px]">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Ad Space — {size}
            </div>
          </div>
        )}

        {/* Placeholder (testing mode or no network) */}
        {!loading && !loaded && !error && (
          <div className="flex flex-col items-center justify-center p-3 py-4 min-h-[50px]">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Ad Space — {size}
            </div>
            <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
              {AD_CONFIG.global.testingMode
                ? '🔧 Testing Mode — Add IDs in src/config/ads.ts'
                : 'Ad will appear here'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
