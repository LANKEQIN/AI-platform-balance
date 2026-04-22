import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
import ConfirmModal from './components/ConfirmModal';
import BatchToolbar from './components/BatchToolbar';
import ToastContainer from './components/ToastContainer';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => storage.getViewMode());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Refs 用于优化回调依赖项
  const platformsRef = useRef<Platform[]>(platforms);
  const selectedIdsRef = useRef<Set<string>>(selectedIds);
  const filteredPlatformsRef = useRef<Platform[]>([]);

  // 同步 refs
  useEffect(() => {
    platformsRef.current = platforms;
  }, [platforms]);

  useEffect(() => {
    selectedIdsRef.current = selectedIds;
  }, [selectedIds]);

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

  // 保存视图模式
  useEffect(() => {
    storage.saveViewMode(viewMode);
  }, [viewMode]);

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
    const result = platforms.filter((platform) => {
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
    filteredPlatformsRef.current = result;
    return result;
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

  // 保存编辑 - 使用 updatePlatform 保持一致性
  const handleSaveEdit = useCallback((updatedPlatform: Platform) => {
    const { id, ...updates } = updatedPlatform;
    updatePlatform(id, updates);
    showToast('平台已更新', 'success');
  }, [updatePlatform, showToast]);

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

  // 访问平台 - 添加错误处理
  const handleGo = useCallback((url: string) => {
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('打开链接失败:', error);
      showToast('无法打开链接，请检查链接格式', 'error');
    }
  }, [showToast]);

  // 切换选择
  const handleSelect = useCallback((platformId: string) => {
    setSelectedIds((prev: Set<string>) => {
      const newSet = new Set(prev);
      if (newSet.has(platformId)) {
        newSet.delete(platformId);
      } else {
        newSet.add(platformId);
      }
      return newSet;
    });
  }, []);

  // 全选 - 使用 ref 避免依赖 filteredPlatforms
  const handleSelectAll = useCallback(() => {
    setSelectedIds(new Set(filteredPlatformsRef.current.map(p => p.id)));
  }, []);

  // 批量打开 - 使用 refs 避免依赖项
  const handleBatchOpen = useCallback(() => {
    selectedIdsRef.current.forEach((id: string) => {
      const platform = platformsRef.current.find(p => p.id === id);
      if (platform) {
        const url = platform.customUrl || platform.url;
        try {
          window.open(url, '_blank', 'noopener,noreferrer');
        } catch (error) {
          console.error('批量打开链接失败:', error);
        }
      }
    });
  }, []);

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

  // 导入配置 - 使用返回的平台数据，避免重复读取 localStorage
  const handleImport = useCallback((content: string) => {
    const result = storage.importConfig(content);
    if (result.success && result.platforms) {
      setPlatforms(result.platforms);
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'error');
    }
  }, [storage, setPlatforms, showToast]);

  // 显示重置确认弹窗
  const handleReset = useCallback(() => {
    setShowResetConfirm(true);
  }, []);

  // 执行重置
  const handleConfirmReset = useCallback(() => {
    const defaultPlatforms = resetToDefault();
    setPlatforms(defaultPlatforms);
    showToast('配置已重置', 'success');
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
      {/* 特效组件 - 暂时禁用以测试性能 */}
      {/* <VisualEffects /> */}

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
        theme={theme}
      />

      {/* 主内容 */}
      <main className="flex-1 px-6 pb-24">
        <div className="max-w-[1400px] mx-auto">
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
              style={{
                minHeight: '200px'
              }}
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
                  index={index}
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

      {/* 重置确认弹窗 */}
      <ConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleConfirmReset}
        title="重置配置"
        message="确定要重置所有配置吗？此操作不可撤销。"
        confirmText="重置"
        cancelText="取消"
        variant="danger"
      />

      {/* 页脚 */}
      <Footer />
    </div>
  );
}

export default App;
