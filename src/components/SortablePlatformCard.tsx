import React from 'react';
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
}

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
  isDragEnabled = true
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: platform.id,
    disabled: !isDragEnabled || isSelectMode
  });

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
        {/* 拖拽提示指示器 - 仅在拖拽模式下显示 */}
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

export default SortablePlatformCard;
