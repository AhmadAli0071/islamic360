import { useEffect, useRef } from 'react';

export default function AdsterraNative() {
  const injected = useRef(false);

  useEffect(() => {
    if (injected.current) return;
    injected.current = true;
    var s = document.createElement('script');
    s.src = 'https://pl29776409.effectivecpmnetwork.com/cd069bef97f173a739477489c2db4db1/invoke.js';
    s.async = true;
    s.setAttribute('data-cfasync', 'false');
    document.body.appendChild(s);
  }, []);

  return <div id="container-cd069bef97f173a739477489c2db4db1" />;
}
