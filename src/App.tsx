import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from './hooks/useTheme';
import { usePlatforms } from './hooks/usePlatforms';
import { useToast } from './hooks/useToast';
import { useStorage } from './hooks/useStorage';
import { Platform } from './types/platform';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import PlatformCard from './components/PlatformCard';
import EmptyState from './components/EmptyState';
import EditPlatformModal from './components/EditPlatformModal';
import AddPlatformModal from './components/AddPlatformModal';
import BatchToolbar from './components/BatchToolbar';
import ToastContainer from './components/ToastContainer';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import VisualEffects from './components/VisualEffects';
import PoetryDisplay from './components/PoetryDisplay';

function App() {
  // Hooks
  const { theme, toggleTheme } = useTheme();
  const { platforms, loading, updatePlatform, addPlatform, deletePlatform, setPlatforms, resetToDefault } = usePlatforms();
  const { toasts, showToast, removeToast } = useToast();
  const storage = useStorage();

  // 状态
  const [showLanding, setShowLanding] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentCategory, setCurrentCategory] = useState('all');
  const [viewMode, setViewMode] = useState&lt;'grid' | 'list'&gt;('grid');
  const [selectedIds, setSelectedIds] = useState&lt;Set&lt;string&gt;&gt;(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [effectsMode, setEffectsMode] = useState&lt;'cool' | 'simple'&gt;('simple');

  // 检查是否已访问过应用
  useEffect(() => {
    const hasVisited = storage.getHasVisited();
    if (hasVisited) {
      setShowLanding(false);
    }
  }, [storage]);

  // 模态框状态
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);

  // 初始化视图模式
  useEffect(() =&gt; {
    const savedViewMode = storage.getViewMode();
    setViewMode(savedViewMode);
  }, [storage]);

  // 初始化特效模式
  useEffect(() =&gt; {
    const savedEffectsMode = storage.getEffectsMode();
    setEffectsMode(savedEffectsMode);
  }, [storage]);

  // 保存视图模式
  useEffect(() =&gt; {
    storage.saveViewMode(viewMode);
  }, [viewMode, storage]);

  // 保存特效模式
  useEffect(() =&gt; {
    storage.saveEffectsMode(effectsMode);
  }, [effectsMode, storage]);

  // 切换特效模式
  const toggleEffects = useCallback(() =&gt; {
    setEffectsMode(prev =&gt; prev === 'cool' ? 'simple' : 'cool');
  }, []);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K 聚焦搜索
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        searchInput?.focus();
      }
      // Esc 关闭选择模式或模态框
      if (e.key === 'Escape') {
        if (isSelectMode) {
          setIsSelectMode(false);
          setSelectedIds(new Set());
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSelectMode]);

  // 过滤平台
  const filteredPlatforms = useMemo(() => {
    return platforms.filter((platform) => {
      // 搜索过滤
      const matchesSearch = searchKeyword === '' ||
        platform.name.toLowerCase().includes(searchKeyword.toLowerCase());

      // 分类过滤
      let matchesCategory = true;
      if (currentCategory === 'starred') {
        matchesCategory = platform.starred === true;
      } else if (currentCategory !== 'all') {
        matchesCategory = platform.category === currentCategory;
      }

      return matchesSearch && matchesCategory;
    });
  }, [platforms, searchKeyword, currentCategory]);

  // 切换收藏
  const handleStar = useCallback((platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (platform) {
      updatePlatform(platformId, { starred: !platform.starred });
      showToast(platform.starred ? '已取消收藏' : '已收藏', 'success');
    }
  }, [platforms, updatePlatform, showToast]);

  // 编辑平台
  const handleEdit = useCallback((platform: Platform) => {
    setEditingPlatform(platform);
    setShowEditModal(true);
  }, []);

  // 保存编辑
  const handleSaveEdit = useCallback((updatedPlatform: Platform) => {
    const index = platforms.findIndex(p => p.id === updatedPlatform.id);
    if (index !== -1) {
      const newPlatforms = [...platforms];
      newPlatforms[index] = updatedPlatform;
      setPlatforms(newPlatforms);
      showToast('平台已更新', 'success');
    }
  }, [platforms, setPlatforms, showToast]);

  // 删除平台
  const handleDelete = useCallback((platformId: string) => {
    deletePlatform(platformId);
    showToast('平台已删除', 'success');
  }, [deletePlatform, showToast]);

  // 添加平台
  const handleAdd = useCallback((newPlatform: { name: string; url: string; category: string; icon: string }) => {
    addPlatform(newPlatform);
    showToast('平台已添加', 'success');
  }, [addPlatform, showToast]);

  // 访问平台
  const handleGo = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  // 切换选择
  const handleSelect = useCallback((platformId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(platformId)) {
        newSet.delete(platformId);
      } else {
        newSet.add(platformId);
      }
      return newSet;
    });
  }, []);

  // 全选
  const handleSelectAll = useCallback(() => {
    setSelectedIds(new Set(filteredPlatforms.map(p => p.id)));
  }, [filteredPlatforms]);

  // 批量打开
  const handleBatchOpen = useCallback(() => {
    selectedIds.forEach(id => {
      const platform = platforms.find(p => p.id === id);
      if (platform) {
        const url = platform.customUrl || platform.url;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  }, [selectedIds, platforms]);

  // 退出选择模式
  const handleCancelSelect = useCallback(() => {
    setIsSelectMode(false);
    setSelectedIds(new Set());
  }, []);

  // 导出配置
  const handleExport = useCallback(() => {
    const config = storage.exportConfig();
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-platforms-config-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('配置已导出', 'success');
  }, [storage, showToast]);

  // 导入配置
  const handleImport = useCallback((content: string) => {
    const result = storage.importConfig(content);
    if (result.success) {
      // 重新加载平台
      setPlatforms(storage.getPlatforms());
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'error');
    }
  }, [storage, setPlatforms, showToast]);

  // 重置配置
  const handleReset = useCallback(() => {
    if (confirm('确定要重置所有配置吗？此操作不可撤销。')) {
      const defaultPlatforms = resetToDefault();
      setPlatforms(defaultPlatforms);
      showToast('配置已重置', 'success');
    }
  }, [resetToDefault, setPlatforms, showToast]);

  // 处理开始使用
  const handleStart = useCallback(() => {
    storage.setHasVisited();
    setShowLanding(false);
  }, [storage]);

  // 如果显示落地页，返回落地页组件
  if (showLanding) {
    return <LandingPage onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 特效组件 */}
      <VisualEffects enabled={effectsMode === 'cool'} />

      {/* 头部 */}
      <Header
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
        onAddPlatform={() => setShowAddModal(true)}
        onToggleSelectMode={() => {
          setIsSelectMode(!isSelectMode);
          if (!isSelectMode) {
            setSelectedIds(new Set());
          }
        }}
        isSelectMode={isSelectMode}
        theme={theme}
        onToggleTheme={toggleTheme}
        effectsMode={effectsMode}
        onToggleEffects={toggleEffects}
        onExport={handleExport}
        onImport={handleImport}
        onReset={handleReset}
      />

      {/* 工具栏 */}
      <Toolbar
        currentCategory={currentCategory}
        onCategoryChange={setCurrentCategory}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* 主内容 */}
      <main className="flex-1 px-6 pb-24">
        <div className="max-w-[1400px] mx-auto">
          {/* 诗词/名言显示 */}
          <PoetryDisplay />

          {loading ? (
            <div className="text-center py-12 text-white/70">
              加载中...
            </div>
          ) : filteredPlatforms.length === 0 ? (
            <EmptyState onAddFirst={() => setShowAddModal(true)} />
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}
              role="list"
              aria-label="AI平台列表"
            >
              {filteredPlatforms.map((platform, index) => (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  viewMode={viewMode}
                  isSelectMode={isSelectMode}
                  isSelected={selectedIds.has(platform.id)}
                  onSelect={handleSelect}
                  onStar={handleStar}
                  onEdit={handleEdit}
                  onGo={handleGo}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 批量操作工具栏 */}
      {isSelectMode && (
        <BatchToolbar
          selectedCount={selectedIds.size}
          onSelectAll={handleSelectAll}
          onBatchOpen={handleBatchOpen}
          onCancel={handleCancelSelect}
        />
      )}

      {/* Toast 容器 */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* 编辑弹窗 */}
      <EditPlatformModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        platform={editingPlatform}
        onSave={handleSaveEdit}
        onDelete={handleDelete}
      />

      {/* 添加平台弹窗 */}
      <AddPlatformModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAdd}
      />

      {/* 页脚 */}
      <Footer />
    </div>
  );
}

export default App;
