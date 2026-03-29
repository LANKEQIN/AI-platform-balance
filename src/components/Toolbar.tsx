import React from 'react';
import { CATEGORIES } from '../types/platform';

interface ToolbarProps {
  currentCategory: string;
  onCategoryChange: (category: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  currentCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange
}) => {
  // 获取有效的分类（排除 'all'）
  const validCategories = CATEGORIES.filter(c => c.id !== 'all' && c.id !== 'starred');

  return (
    <nav className="py-4 px-6" aria-label="筛选和视图选项">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center gap-4 flex-wrap">
        {/* 分类筛选标签 */}
        <div className="flex gap-2 flex-wrap" role="tablist" aria-label="平台分类筛选">
          {/* 全部标签 */}
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
              currentCategory === 'all'
                ? 'bg-white/92 border-white/40 text-teal-800 shadow-[0_4px_20px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.2)]'
                : 'glass glass-hover text-white/70'
            }`}
            data-category="all"
            role="tab"
            aria-selected={currentCategory === 'all'}
            onClick={() => onCategoryChange('all')}
          >
            全部
          </button>

          {/* 动态分类标签 */}
          {validCategories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                currentCategory === category.id
                  ? 'bg-white/92 border-white/40 text-teal-800 shadow-[0_4px_20px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.2)]'
                  : 'glass glass-hover text-white/70'
              }`}
              data-category={category.id}
              role="tab"
              aria-selected={currentCategory === category.id}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.name}
            </button>
          ))}

          {/* 已收藏标签 */}
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
              currentCategory === 'starred'
                ? 'bg-white/92 border-white/40 text-teal-800 shadow-[0_4px_20px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.2)]'
                : 'glass glass-hover text-white/70'
            }`}
            data-category="starred"
            role="tab"
            aria-selected={currentCategory === 'starred'}
            onClick={() => onCategoryChange('starred')}
          >
            已收藏
          </button>
        </div>

        {/* 视图切换 */}
        <div className="flex gap-1" role="group" aria-label="视图切换">
          <button
            className={`w-11 h-11 rounded-lg glass ${
              viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'
            }`}
            data-view="grid"
            title="卡片视图"
            aria-label="卡片视图"
            aria-pressed={viewMode === 'grid'}
            onClick={() => onViewModeChange('grid')}
          >
            ▦
          </button>
          <button
            className={`w-11 h-11 rounded-lg glass ${
              viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'
            }`}
            data-view="list"
            title="列表视图"
            aria-label="列表视图"
            aria-pressed={viewMode === 'list'}
            onClick={() => onViewModeChange('list')}
          >
            ☰
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Toolbar;
