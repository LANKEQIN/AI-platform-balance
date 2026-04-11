import React from 'react';
import { STORAGE_KEYS } from '../types/platform';

const Footer: React.FC = () => {
  const handleShowLanding = () => {
    sessionStorage.removeItem(STORAGE_KEYS.HAS_VISITED);
    window.location.reload();
  };

  return (
    <footer className="py-6 text-center">
      <p className="text-white/60 text-sm mb-3">
        数据存储在本地浏览器中，清除浏览器数据会导致配置丢失
      </p>
      <button
        onClick={handleShowLanding}
        className="text-white/40 hover:text-white/70 text-xs transition-colors"
      >
        重新查看落地页
      </button>
    </footer>
  );
};

export default Footer;
