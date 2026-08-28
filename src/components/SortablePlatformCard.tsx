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
  isDragEnabled?: boolean;
  isPowerSave?: boolean;
}

/**
 * 纯展示卡片（省电模式使用）
 * 不注册任何拖拽事件，避免 dnd-kit 的性能开销
 */
const StaticCard: React.FC<Omit<SortablePlatformCardProps, 'isDragEnabled' | 'isPowerSave'>> = ({
  platform, viewMode, isSelectMode, isSelected, onSelect, onStar, onEdit, onGo
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
  />
);

/**
 * 可拖拽平台卡片包装组件
 * 始终调用 useSortable（遵守 React Hooks 规则），
 * 通过 disabled 参数控制是否启用拖拽；
 * 省电模式下忽略拖拽属性，直接渲染纯展示卡片
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
  isDragEnabled = true,
  isPowerSave = false
}) => {
  // 始终调用 useSortable，避免违反 React Hooks 规则
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: platform.id,
    disabled: !isDragEnabled || isSelectMode || isPowerSave
  });

  // 省电模式：直接渲染静态卡片，忽略拖拽包装
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
    />;
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 999 : 'auto',
    position: 'relative' as const
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="relative">
        {/*
          拖拽手柄：dnd-kit 的 attributes（role/tabIndex/aria）和 listeners 挂在专用按钮上，
          而不是卡片外层 div——避免外层 div 变成包裹真实按钮的 role="button"（嵌套交互元素），
          同时让键盘拖拽（聚焦手柄后按方向键）真正可用
        */}
        {isDragEnabled && !isSelectMode && (
          <button
            type="button"
            aria-label="拖拽排序"
            className="absolute top-1/2 left-2 -translate-y-1/2 z-20 p-1 opacity-50 hover:opacity-90 transition-opacity cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <span className="text-white/70 select-none">⋮⋮</span>
          </button>
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
        />
      </div>
    </div>
  );
};

export default memo(SortablePlatformCard);
