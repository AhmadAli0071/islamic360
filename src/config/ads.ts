// ============================================================
// 🎯 CENTRAL AD CONFIG — All networks, IDs, settings
// ============================================================
// Instructions: Jab aap API keys/IDs do to idhar update kar dena
// ============================================================

export const AD_CONFIG = {
  // ========================
  // NETWORK 1: ADSTERRA
  // ========================
  adsterra: {
    enabled: false,
    scriptSrc: '',
    push: {
      // Push notification code — Adsterra dashboard se mile ga
      // "Allow" button ke sath show hoga (Islamic style mein)
      zoneId: 'PLACEHOLDER_ADSTERRA_PUSH_ZONE_ID',
      scriptSrc: '', // Adsterra push script URL
    },
    banners: {
      'ad-leaderboard-1': { zoneId: 'PLACEHOLDER_728x90_TOP' },
      'ad-academy-header': { zoneId: 'PLACEHOLDER_728x90_ACADEMY' },
      'ad-academy-content': { zoneId: 'PLACEHOLDER_728x90_ACADEMY_2' },
      'ad-content-2': { zoneId: 'PLACEHOLDER_728x90_BOTTOM' },
      'ad-prayer-bottom': { zoneId: 'PLACEHOLDER_728x90_PRAYER' },
      'ad-qibla-bottom': { zoneId: 'PLACEHOLDER_728x90_QIBLA' },
      'ad-calendar-bottom': { zoneId: 'PLACEHOLDER_728x90_CALENDAR' },
      'ad-history-content': { zoneId: 'PLACEHOLDER_728x90_HISTORY' },
      'ad-sidebar-desktop-rectangle': { zoneId: 'PLACEHOLDER_300x250_SIDEBAR' },
      'ad-content-1': { zoneId: 'PLACEHOLDER_300x250_CONTENT' },
      'ad-history-sidebar': { zoneId: 'PLACEHOLDER_300x250_HISTORY' },
    },
    // Priority: 1 = highest, 3 = lowest
    priority: 1,
  },

  // ========================
  // NETWORK 2: ADMAVEN
  // ========================
  admaven: {
    enabled: false,
    scriptSrc: '',
    native: {
      // Native ad codes — AdMaven dashboard se mile ga
      widgetId: 'PLACEHOLDER_ADMAVEN_NATIVE_WIDGET',
      // Jahan native ads dikhenge
      placements: ['ad-content-1', 'ad-history-sidebar'],
    },
    popunder: {
      enabled: false,
      // Sirf desktop par chalega
      desktopOnly: true,
      // 1 popunder per session
      frequencyPerSession: 1,
      zoneId: 'PLACEHOLDER_ADMAVEN_POPUNDER',
    },
    banner: {
      'ad-sidebar-desktop-tower': { zoneId: 'PLACEHOLDER_300x600_TOWER' },
    },
    priority: 2,
  },

  // ========================
  // NETWORK 3: PROPELLERADS
  // ========================
  propellerads: {
    enabled: false,
    scriptSrc: '',
    push: {
      zoneId: 'PLACEHOLDER_PROPELLER_PUSH',
      // Limit: 1-2 per day
      maxPerDay: 2,
    },
    banners: {
      // Fallback banners — sirf tab jab Adsterra fill na ho
      fallbackFor: ['ad-leaderboard-1', 'ad-content-2'],
      zoneId: 'PLACEHOLDER_PROPELLER_BANNER',
    },
    priority: 3,
  },

  // ========================
  // GLOBAL SETTINGS
  // ========================
  global: {
    // Premium users ko ads nahi dikhengi
    premium: {
      hideAllAds: true,
    },
    // Push notification limits
    push: {
      maxPerDay: 3, // Total 3 push notifications per day (all networks combined)
    },
    // Frequency capping (seconds)
    frequencyCap: 30, // Same ad na dikhe 30 seconds mein dobara
    // Lazy loading
    lazyLoad: true,
    // Testing mode — sample ads dikhega
    testingMode: true, // ⚠️ Jab tak real IDs na daalo, true rakho
  },
} as const;

export function isAdEnabled(network: keyof typeof AD_CONFIG): boolean {
  if (AD_CONFIG.global.testingMode) return false;
  const config = AD_CONFIG[network];
  return 'enabled' in config ? (config as { enabled: boolean }).enabled : false;
}

export function getAdNetworkForPlacement(placementId: string): string | null {
  // Priority order: Adsterra → AdMaven → PropellerAds
  if (isAdEnabled('adsterra') && (AD_CONFIG.adsterra.banners as any)[placementId]) {
    return 'adsterra';
  }
  if (isAdEnabled('admaven') && (AD_CONFIG.admaven.banner as any)[placementId]) {
    return 'admaven';
  }
  if (isAdEnabled('propellerads') && (AD_CONFIG.propellerads.banners.fallbackFor as readonly string[]).includes(placementId)) {
    return 'propellerads';
  }
  return null;
}
