import { useEffect } from 'react';
import { AD_CONFIG } from '../../config/ads';
import { canShowPopunder, markPopunderShown } from '../../hooks/useAdNetwork';

export default function AdsterraPopunder() {
  useEffect(() => {
    if (!AD_CONFIG.adsterra.enabled || AD_CONFIG.global.testingMode) return;
    if (!canShowPopunder('adsterra')) return;

    const timer = setTimeout(() => {
      markPopunderShown('adsterra');
      var s = document.createElement('script');
      s.innerHTML = '(function(){var s=document.createElement("script");s.src="//cdn.adsterra.com/script/popunder/' + AD_CONFIG.adsterra.popunder.zoneId + '.js";s.async=true;document.head.appendChild(s)})();';
      document.head.appendChild(s);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
