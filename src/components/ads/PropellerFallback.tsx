import { AD_CONFIG } from '../../config/ads';

interface PropellerFallbackProps {
  placementId: string;
  language: 'en' | 'ur';
}

export default function PropellerFallback({ placementId, language }: PropellerFallbackProps) {
  if (!AD_CONFIG.propellerads.enabled || AD_CONFIG.global.testingMode) return null;

  // Check if this placement needs fallback
  const needsFallback = (AD_CONFIG.propellerads.banners.fallbackFor as readonly string[]).includes(placementId);
  if (!needsFallback) return null;

  return (
    <div id={`propeller-fallback-${placementId}`} className="hidden">
      {/* PropellerAds will populate this when fallback triggers */}
      <div className="text-[9px] text-gray-400 text-center">
        {language === 'en' ? 'Sponsored' : 'اسپانسرڈ'}
      </div>
      <div data-propeller-zone={AD_CONFIG.propellerads.banners.zoneId}
        className="propeller-ad-unit" />
    </div>
  );
}
