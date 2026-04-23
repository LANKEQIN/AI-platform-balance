import React, { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PlatformCard from './PlatformCard';
import { Platform } from '../types/platform';

interface SortablePlatformCardProps {
  platform: Platform;
  viewMode: 'grid' | 'list';
  isSelectMode: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onStar: (id: string) => void;
  onEdit: (platform: Platform) => void;
  onGo: (url: string) => void;
  index: number;
  isDragEnabled?: boolean;
  isPowerSave?: boolean;
}

/**
 * 纯展示卡片（省电模式使用）
 * 不注册任何拖拽事件，避免 dnd-kit 的性能开销
 */
const StaticCard: React.FC<Omit<SortablePlatformCardProps, 'isDragEnabled' | 'isPowerSave'>> = ({
  platform, viewMode, isSelectMode, isSelected, onSelect, onStar, onEdit, onGo, index
}) => (
  <PlatformCard
    platform={platform}
    viewMode={viewMode}
    isSelectMode={isSelectMode}
    isSelected={isSelected}
    onSelect={onSelect}
    onStar={onStar}
    onEdit={onEdit}
    onGo={onGo}
    index={index}
  />
);

/**
 * 可拖拽平台卡片包装组件
 * 省电模式下直接渲染纯展示卡片，不注册拖拽逻辑
 * 正常模式下使用 dnd-kit 实现拖拽排序
 */
const SortablePlatformCard: React.FC<SortablePlatformCardProps> = ({
  platform,
  viewMode,
  isSelectMode,
  isSelected,
  onSelect,
  onStar,
  onEdit,
  onGo,
  index,
  isDragEnabled = true,
  isPowerSave = false
}) => {
  // 省电模式下不调用 useSortable，避免注册拖拽事件监听器和状态追踪
  const sortable = !isPowerSave
    ? useSortable({
        id: platform.id,
        disabled: !isDragEnabled || isSelectMode
      })
    : null;

  // 省电模式：直接渲染静态卡片，无拖拽包装
  if (isPowerSave) {
    return <StaticCard
      platform={platform}
      viewMode={viewMode}
      isSelectMode={isSelectMode}
      isSelected={isSelected}
      onSelect={onSelect}
      onStar={onStar}
      onEdit={onEdit}
      onGo={onGo}
      index={index}
    />;
  }

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = sortable!;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 999 : 'auto',
    position: 'relative' as const
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        className={`relative ${isDragEnabled && !isSelectMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
        {...(isDragEnabled && !isSelectMode ? listeners : {})}
      >
        {/* 拖拽提示指示器 */}
        {isDragEnabled && !isSelectMode && (
          <div className="absolute top-1/2 left-2 -translate-y-1/2 z-20 opacity-30 hover:opacity-60 transition-opacity pointer-events-none">
            <span className="text-white/50">⋮⋮</span>
          </div>
        )}
        <PlatformCard
          platform={platform}
          viewMode={viewMode}
          isSelectMode={isSelectMode}
          isSelected={isSelected}
          onSelect={onSelect}
          onStar={onStar}
          onEdit={onEdit}
          onGo={onGo}
          index={index}
        />
      </div>
    </div>
  );
};

export default memo(SortablePlatformCard);
