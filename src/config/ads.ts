export const AD_CONFIG = {
  adsterra: {
    enabled: true,
    scriptSrc: '//cdn.adsterra.com/adsterra.js',
    push: {
      zoneId: '29675909',
      scriptSrc: '',
    },
    popunder: {
      enabled: true,
      zoneId: '29675909',
      desktopOnly: true,
      frequencyPerSession: 1,
    },
    socialBar: {
      zoneId: '29675911',
    },
    banners: {
      'ad-leaderboard-1': { zoneId: '29675910' },
      'ad-academy-header': { zoneId: '29675910' },
      'ad-academy-content': { zoneId: '29675910' },
      'ad-content-2': { zoneId: '29675910' },
      'ad-prayer-bottom': { zoneId: '29675910' },
      'ad-qibla-bottom': { zoneId: '29675910' },
      'ad-calendar-bottom': { zoneId: '29675910' },
      'ad-history-content': { zoneId: '29675910' },
      'ad-sidebar-desktop-rectangle': { zoneId: '29675910' },
      'ad-content-1': { zoneId: '29675910' },
      'ad-history-sidebar': { zoneId: '29675910' },
    },
    priority: 1,
  },

  admaven: {
    enabled: false,
    scriptSrc: '',
    native: {
      widgetId: '',
      placements: [],
    },
    popunder: {
      enabled: false,
      desktopOnly: true,
      frequencyPerSession: 1,
      zoneId: '',
    },
    banner: {},
    priority: 2,
  },

  propellerads: {
    enabled: false,
    scriptSrc: '',
    push: {
      zoneId: '',
      maxPerDay: 2,
    },
    banners: {
      fallbackFor: [],
      zoneId: '',
    },
    priority: 3,
  },

  global: {
    premium: {
      hideAllAds: true,
    },
    push: {
      maxPerDay: 3,
    },
    frequencyCap: 30,
    lazyLoad: true,
    testingMode: false,
  },
};

export function isAdEnabled(network: keyof typeof AD_CONFIG): boolean {
  if (AD_CONFIG.global.testingMode) return false;
  const config = AD_CONFIG[network];
  return 'enabled' in config ? (config as { enabled: boolean }).enabled : false;
}

export function getAdNetworkForPlacement(placementId: string): string | null {
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
