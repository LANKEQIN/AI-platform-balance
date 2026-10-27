import React, { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  onAddPlatform: () => void;
  onToggleSelectMode: () => void;
  isSelectMode: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onExport: () => void;
  onImport: (content: string) => void;
  onReset: () => void;
  isDragEnabled: boolean;
  onToggleDrag: () => void;
  onOpenGroupManager: () => void;
  isPowerSave: boolean;
  onTogglePowerSave: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchKeyword,
  onSearchChange,
  onAddPlatform,
  onToggleSelectMode,
  isSelectMode,
  theme,
  onToggleTheme,
  onExport,
  onImport,
  onReset,
  isDragEnabled,
  onToggleDrag,
  onOpenGroupManager,
  isPowerSave,
  onTogglePowerSave
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImportClick = () => {
    fileInputRef.current?.click();
    setShowDropdown(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onImport(content);
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  const handleClearSearch = () => {
    onSearchChange('');
  };

  return (
    <header className="bg-[var(--bg-surface)] py-4 px-6 border-b border-[var(--border)] sticky top-0 z-[100] flex justify-between items-center flex-wrap gap-4">

      <h1 className="text-2xl font-bold text-primary tracking-tight">
        AI平台余额快捷入口
      </h1>

      <div className="flex items-center gap-2">
        <div className="relative flex items-center">
          <label htmlFor="searchInput" className="sr-only">搜索平台</label>
          <input
            id="searchInput"
            type="text"
            className="pl-4 pr-10 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-surface)] text-primary text-sm w-56 transition-colors placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            placeholder="搜索平台... (Ctrl+K)"
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="搜索平台"
          />
          {searchKeyword && (
            <button
              className="absolute right-2.5 w-11 h-11 border-none bg-transparent text-muted text-lg leading-none cursor-pointer opacity-100 transition-all duration-150 flex items-center justify-center rounded"
              onClick={handleClearSearch}
              aria-label="清空搜索"
            >
              ×
            </button>
          )}
        </div>

        <button
          className={`btn ${isDragEnabled ? 'btn-primary' : 'btn-secondary'}`}
          onClick={onToggleDrag}
          aria-label={isDragEnabled ? '退出拖拽排序' : '进入拖拽排序'}
        >
          {isDragEnabled ? '✋ 拖拽中' : '↔️ 排序'}
        </button>

        <button
          className="btn btn-secondary"
          onClick={onOpenGroupManager}
          aria-label="分组管理"
        >
          📦 分组
        </button>

        <button
          className="btn btn-secondary"
          onClick={onAddPlatform}
          aria-label="添加新平台"
        >
          + 添加平台
        </button>

        <button
          className={`btn ${isSelectMode ? 'btn-primary' : 'btn-secondary'}`}
          onClick={onToggleSelectMode}
          aria-label={isSelectMode ? '退出选择模式' : '进入选择模式'}
        >
          {isSelectMode ? '✓ 已选择' : '☑️ 批量选择'}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            className="btn btn-icon"
            onClick={() => setShowDropdown(!showDropdown)}
            aria-label="更多操作"
            aria-haspopup="true"
            aria-expanded={showDropdown}
          >
            ⋮
          </button>
          {showDropdown && (
            <div
              className="absolute right-0 top-full mt-2 surface rounded-lg min-w-40 overflow-hidden z-[200]"
              role="menu"
              aria-label="更多操作菜单"
            >
              <button
                className="w-full px-4 py-3 text-left text-primary hover:bg-[var(--bg-surface-hover)] transition-colors"
                role="menuitem"
                onClick={() => {
                  onExport();
                  setShowDropdown(false);
                }}
              >
                导出配置
              </button>
              <button
                className="w-full px-4 py-3 text-left text-primary hover:bg-[var(--bg-surface-hover)] transition-colors"
                role="menuitem"
                onClick={handleImportClick}
              >
                导入配置
              </button>
              <button
                className="w-full px-4 py-3 text-left text-red-500 hover:bg-[var(--bg-surface-hover)] transition-colors"
                role="menuitem"
                onClick={() => {
                  onReset();
                  setShowDropdown(false);
                }}
              >
                重置配置
              </button>
            </div>
          )}
        </div>

        {/* 极致省电模式切换按钮（使用 power-save-toggle 类名，确保省电模式下样式不被覆盖） */}
        <button
          className={`btn btn-icon power-save-toggle ${isPowerSave ? 'bg-amber-active bg-amber-500 border-amber-500 text-white' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onTogglePowerSave();
          }}
          type="button"
          aria-label={isPowerSave ? '关闭极致省电模式' : '开启极致省电模式'}
          title={isPowerSave ? '已开启极致省电模式 - 点击关闭' : '开启极致省电模式（禁用动画/模糊/阴影，提升流畅度）'}
        >
          <span className="leading-none">
            {isPowerSave ? '⚡' : '🔌'}
          </span>
        </button>

        <button
          className="btn btn-icon"
          onClick={onToggleTheme}
          aria-label="切换深色/浅色主题"
        >
          <span className="theme-icon leading-none transition-transform duration-400 hover:rotate-180">
            {theme === 'dark' ? '☀️' : '🌙'}
          </span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          aria-hidden="true"
          onChange={handleFileChange}
        />
      </div>
    </header>
  );
};

export default Header;
