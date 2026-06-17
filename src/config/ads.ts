export const AD_CONFIG = {
  adsterra: {
    enabled: true,
    popunder: { zoneId: '29675909' },
    native: { zoneId: '29675910' },
    socialBar: { zoneId: '29675911' },
    priority: 1,
  },
  global: {
    testingMode: false,
  },
};

export function isAdEnabled(): boolean {
  return !AD_CONFIG.global.testingMode && AD_CONFIG.adsterra.enabled;
}
