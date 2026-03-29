import React from 'react';

interface EmptyStateProps {
  onAddFirst: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddFirst }) => {
  return (
    <div className="text-center py-12 px-6 glass backdrop-blur-2xl rounded-2xl border border-white/20 shadow-lg">
      <div className="text-6xl mb-4" aria-hidden="true">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-white/70">
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-1">
        暂无平台数据
      </h3>
      <p className="text-sm text-white/65 mb-6">
        点击下方按钮添加你的第一个AI平台
      </p>
      <button className="btn btn-primary" onClick={onAddFirst}>
        + 添加第一个平台
      </button>
    </div>
  );
};

export default EmptyState;
