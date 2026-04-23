import React, { useMemo, memo } from 'react';
import { Platform } from '../types/platform';

interface PlatformCardProps {
  platform: Platform;
  viewMode: 'grid' | 'list';
  isSelectMode: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onStar: (id: string) => void;
  onEdit: (platform: Platform) => void;
  onGo: (url: string) => void;
  index: number;
}

/**
 * 平台卡片组件
 * 已针对省电模式优化：移除 hover state 追踪，减少重渲染
 */
const PlatformCard: React.FC<PlatformCardProps> = ({
  platform,
  viewMode,
  isSelectMode,
  isSelected,
  onSelect,
  onStar,
  onEdit,
  onGo,
  index: _index
}) => {
  const isStarred = useMemo(() => platform.starred || false, [platform.starred]);
  const displayUrl = useMemo(() => platform.customUrl || platform.url, [platform.customUrl, platform.url]);

  return (
    <div
      className={`
        platform-card relative glass rounded-2xl p-6 shadow-lg
        ${isStarred ? 'border-amber-400/60' : ''}
        ${isSelected ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-transparent' : ''}
        ${viewMode === 'list' ? 'flex items-center gap-4' : 'flex flex-col'}
      `}
    >
      {/* 选择框 - 选择模式时显示 */}
      {isSelectMode && (
        <button
          onClick={() => onSelect(platform.id)}
          className={`
            absolute top-3 left-3 w-6 h-6 rounded border-2 flex items-center justify-center z-10
            transition-all duration-150
            ${isSelected 
              ? 'bg-primary-500 border-primary-500 text-white scale-110' 
              : 'bg-white/10 border-white/30 hover:bg-white/20 hover:scale-105'
            }
          `}
          aria-label={isSelected ? '取消选择' : '选择平台'}
        >
          {isSelected && '✓'}
        </button>
      )}

      {/* 收藏按钮 */}
      <button
        onClick={() => onStar(platform.id)}
        className={`
          absolute top-3 right-3 p-1 opacity-50 hover:opacity-80 transition-all z-10
          min-w-11 min-h-11 flex items-center justify-center rounded
          ${isStarred ? 'opacity-100' : ''}
        `}
        aria-label={isStarred ? '取消收藏' : '收藏平台'}
      >
        <span
          className={`text-xl ${isStarred ? 'opacity-90' : ''}`}
        >
          {isStarred ? '⭐' : '☆'}
        </span>
      </button>

      {/* 卡片头部 */}
      <div className={`
        flex items-center gap-2 mb-4 relative z-1
        ${viewMode === 'list' ? 'mb-0 w-48 flex-shrink-0' : ''}
      `}>
        <div 
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/15 to-white/5 flex items-center justify-center text-2xl shadow-sm flex-shrink-0"
        >
          {platform.icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-white truncate">
            {platform.name}
          </h3>
          <span className="text-xs text-white/70 bg-primary-500/25 px-2 py-0.5 rounded-full font-medium inline-block">
            {platform.category}
          </span>
        </div>
      </div>

      {/* 卡片主体 */}
      <div className={`
        flex-1 mb-4 relative z-1 min-w-0
        ${viewMode === 'list' ? 'mb-0 flex-1 mx-4' : ''}
      `}>
        <p className="text-xs text-white/60 break-all line-clamp-2 transition-all duration-300 hover:text-white/80 mb-2">
          {displayUrl}
        </p>
        {/* 备注区域 */}
        {platform.note && (
          <div className="mt-2 p-2 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-white/70 line-clamp-3">
              📝 {platform.note}
            </p>
          </div>
        )}
      </div>

      {/* 卡片底部 */}
      <div className={`
        flex gap-2 relative z-1
        ${viewMode === 'list' ? 'flex-shrink-0' : ''}
      `}>
        <button
          onClick={() => onGo(displayUrl)}
          className="flex-1 btn bg-gradient-to-br from-green-500 to-emerald-400 text-white border-none shadow-[0_4px_15px_rgba(16,185,129,0.4)]"
          aria-label={`访问 ${platform.name}`}
        >
          访问
        </button>
        <button
          onClick={() => onEdit(platform)}
          className="btn glass glass-hover"
          aria-label={`编辑 ${platform.name}`}
        >
          编辑
        </button>
      </div>
    </div>
  );
};

export default memo(PlatformCard);
