import { useEffect } from 'react';
import { AD_CONFIG } from '../../config/ads';

export default function AdsterraSocialBar() {
  useEffect(() => {
    if (!AD_CONFIG.adsterra.enabled || AD_CONFIG.global.testingMode) return;

    var s = document.createElement('script');
    s.innerHTML = '(function(){var s=document.createElement("script");s.src="//cdn.adsterra.com/script/socialbar/' + AD_CONFIG.adsterra.socialBar.zoneId + '.js";s.async=true;document.head.appendChild(s)})();';
    document.head.appendChild(s);
  }, []);

  return null;
}
