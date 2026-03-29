import React from 'react';

interface BatchToolbarProps {
  selectedCount: number;
  onSelectAll: () => void;
  onBatchOpen: () => void;
  onCancel: () => void;
}

const BatchToolbar: React.FC<BatchToolbarProps> = ({
  selectedCount,
  onSelectAll,
  onBatchOpen,
  onCancel
}) => {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 glass backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 px-6 py-3 flex items-center gap-4 z-[150]"
      role="toolbar"
      aria-label="批量操作"
    >
      <div className="flex items-center">
        <span className="text-white/90">
          已选中 <strong className="text-white font-bold">{selectedCount}</strong> 个平台
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="btn btn-secondary text-sm"
          onClick={onSelectAll}
          title="全选当前结果"
        >
          全选
        </button>
        <button
          className="btn btn-primary text-sm"
          onClick={onBatchOpen}
          title="批量打开选中的平台"
          disabled={selectedCount === 0}
        >
          批量打开
        </button>
        <button
          className="btn btn-secondary text-sm"
          onClick={onCancel}
          title="退出选择模式"
        >
          取消选择
        </button>
      </div>
    </div>
  );
};

export default BatchToolbar;
