import { useState, useEffect, useCallback, useRef } from 'react';
import { AD_CONFIG, getAdNetworkForPlacement } from '../config/ads';

interface AdState {
  loading: boolean;
  loaded: boolean;
  error: string | null;
  network: string | null;
}

const sessionPopunders = new Map<string, number>();
const notificationCount: { date: string; count: number } = { date: '', count: 0 };

// Reset count daily
function getTodayKey(): string {
  return new Date().toDateString();
}

export function useAdNetwork(placementId: string) {
  const [state, setState] = useState<AdState>({
    loading: true,
    loaded: false,
    error: null,
    network: null,
  });
  const mountedRef = useRef(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const loadAd = useCallback(async () => {
    if (AD_CONFIG.global.testingMode) {
      setState({ loading: false, loaded: false, error: null, network: null });
      return;
    }

    const network = getAdNetworkForPlacement(placementId);
    if (!network) {
      setState({ loading: false, loaded: false, error: null, network: null });
      return;
    }

    setState(prev => ({ ...prev, loading: true, network }));

    // Lazy load: wait for idle or 500ms
    if (AD_CONFIG.global.lazyLoad && 'requestIdleCallback' in window) {
      await new Promise(resolve => requestIdleCallback(resolve, { timeout: 500 }));
    }

    // Try loading the ad script
    try {
      await loadNetworkScript(network);
      if (mountedRef.current) {
        setState({ loading: false, loaded: true, error: null, network });
      }
    } catch (err) {
      if (mountedRef.current) {
        setState({ loading: false, loaded: false, error: (err as Error).message, network });
      }
    }
  }, [placementId]);

  useEffect(() => {
    mountedRef.current = true;
    loadAd();
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [loadAd]);

  return state;
}

// ============================================================
// POPUNDER MANAGER
// ============================================================
export function canShowPopunder(network: string): boolean {
  if (AD_CONFIG.global.testingMode) return false;

  // Mobile par nahi dikhana
  if (window.innerWidth < 768) return false;

  const config = AD_CONFIG[network as keyof typeof AD_CONFIG];
  if (!config || !('popunder' in config)) return false;

  const popConfig = (config as any).popunder;
  if (!popConfig?.enabled) return false;
  if (popConfig.desktopOnly && window.innerWidth < 1024) return false;

  const key = `${network}-popunder`;
  const currentCount = sessionPopunders.get(key) || 0;
  if (currentCount >= popConfig.frequencyPerSession) return false;

  return true;
}

export function markPopunderShown(network: string): void {
  const key = `${network}-popunder`;
  sessionPopunders.set(key, (sessionPopunders.get(key) || 0) + 1);
}

// ============================================================
// PUSH NOTIFICATION MANAGER
// ============================================================
export function canShowPushNotification(): boolean {
  if (AD_CONFIG.global.testingMode) return false;

  const today = getTodayKey();
  if (notificationCount.date !== today) {
    notificationCount.date = today;
    notificationCount.count = 0;
  }

  return notificationCount.count < AD_CONFIG.global.push.maxPerDay;
}

export function markPushShown(): void {
  const today = getTodayKey();
  if (notificationCount.date !== today) {
    notificationCount.date = today;
    notificationCount.count = 0;
  }
  notificationCount.count++;
}

// ============================================================
// SCRIPT LOADER
// ============================================================
async function loadNetworkScript(network: string): Promise<void> {
  let src = '';
  switch (network) {
    case 'adsterra':
      src = AD_CONFIG.adsterra.scriptSrc;
      break;
    case 'admaven':
      src = AD_CONFIG.admaven.scriptSrc || '';
      break;
    case 'propellerads':
      src = AD_CONFIG.propellerads.scriptSrc || '';
      break;
  }
  if (!src) throw new Error(`No script URL configured for ${network}`);
  await injectScript(src);
}

function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}
