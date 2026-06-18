import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import App from './App.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import './index.css';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' });
}

import('./utils/push.js').then(({ registerPush }) => registerPush());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminPanelWrapper />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

function AdminPanelWrapper() {
  const lang = (localStorage.getItem('theislamic360_lang') as 'en' | 'ur') || 'en';
  return <AdminPanel language={lang} standalone={true} />;
}
