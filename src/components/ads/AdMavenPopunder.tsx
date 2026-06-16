import { useEffect } from 'react';
import { AD_CONFIG } from '../../config/ads';
import { canShowPopunder, markPopunderShown } from '../../hooks/useAdNetwork';

export default function AdMavenPopunder() {
  useEffect(() => {
    if (!AD_CONFIG.admaven.enabled || AD_CONFIG.global.testingMode) return;
    if (!canShowPopunder('admaven')) return;

    // Delay popunder by 5 seconds for better UX
    const timer = setTimeout(() => {
      markPopunderShown('admaven');

      // AdMaven popunder trigger
      const script = document.createElement('script');
      script.innerHTML = `
        try {
          (function() {
            var s = document.createElement('script');
            s.src = '//admaven.com/popunder/${AD_CONFIG.admaven.popunder.zoneId}';
            s.async = true;
            document.head.appendChild(s);
          })();
        } catch(e) {}
      `;
      document.head.appendChild(script);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
