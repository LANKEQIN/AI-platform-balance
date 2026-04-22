import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useTheme } from './hooks/useTheme';
import { usePlatforms } from './hooks/usePlatforms';
import { useToast } from './hooks/useToast';
import { useStorage } from './hooks/useStorage';
import { Platform, PlatformGroup } from './types/platform';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import PlatformCard from './components/PlatformCard';
import SortablePlatformCard from './components/SortablePlatformCard';
import EmptyState from './components/EmptyState';
import EditPlatformModal from './components/EditPlatformModal';
import AddPlatformModal from './components/AddPlatformModal';
import GroupManagerModal from './components/GroupManagerModal';
import ConfirmModal from './components/ConfirmModal';
import BatchToolbar from './components/BatchToolbar';
import ToastContainer from './components/ToastContainer';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import VisualEffects from './components/VisualEffects';

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
  const [isDragEnabled, setIsDragEnabled] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [groups, setGroups] = useState<PlatformGroup[]>([]);
  const [showGroupManager, setShowGroupManager] = useState(false);

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

  // 加载分组数据
  useEffect(() => {
    setGroups(storage.getGroups());
  }, [storage]);

  // 设置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // 处理拖拽开始
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  // 处理拖拽结束
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      setPlatforms((items: Platform[]) => {
        const oldIndex = items.findIndex((item: Platform) => item.id === active.id);
        const newIndex = items.findIndex((item: Platform) => item.id === over.id);
        
        // 重新排列数组
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // 更新排序权重
        return newItems.map((item: Platform, index: number) => {
          const updatedItem = { ...item };
          updatedItem.sortOrder = index;
          return updatedItem;
        });
      });
      showToast('排序已更新', 'success');
    }
  }, [setPlatforms, showToast]);

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

  // 分组管理回调
  const handleAddGroup = useCallback((group: Omit<PlatformGroup, 'id' | 'sortOrder'>) => {
    storage.addGroup(group);
    setGroups(storage.getGroups());
    showToast('分组已添加', 'success');
  }, [storage, showToast]);

  const handleUpdateGroup = useCallback((groupId: string, updates: Partial<PlatformGroup>) => {
    storage.updateGroup(groupId, updates);
    setGroups(storage.getGroups());
    showToast('分组已更新', 'success');
  }, [storage, showToast]);

  const handleDeleteGroup = useCallback((groupId: string) => {
    storage.deleteGroup(groupId);
    setGroups(storage.getGroups());
    // 更新平台列表（删除分组的平台会自动移到默认分组）
    setPlatforms(storage.getPlatforms());
    showToast('分组已删除', 'success');
  }, [storage, showToast, setPlatforms]);

  // 切换分组折叠
  const toggleGroupCollapsed = useCallback((groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      storage.updateGroup(groupId, { collapsed: !group.collapsed });
      setGroups(storage.getGroups());
    }
  }, [groups, storage]);

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
  const handleAdd = useCallback((newPlatform: { name: string; url: string; category: string; icon: string; groupId?: string }) => {
    // 获取当前最大的 sortOrder
    const maxSortOrder = platforms.length > 0 
      ? Math.max(...platforms.map(p => p.sortOrder || 0)) 
      : -1;
    
    addPlatform({
      ...newPlatform,
      sortOrder: maxSortOrder + 1
    });
    showToast('平台已添加', 'success');
  }, [addPlatform, showToast, platforms]);

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
          // 退出选择模式时也退出拖拽模式
          if (isSelectMode) {
            setIsDragEnabled(false);
          }
        }}
        isSelectMode={isSelectMode}
        theme={theme}
        onToggleTheme={toggleTheme}
        onExport={handleExport}
        onImport={handleImport}
        onReset={handleReset}
        isDragEnabled={isDragEnabled}
        onToggleDrag={() => {
          setIsDragEnabled(!isDragEnabled);
          // 进入拖拽模式时退出选择模式
          if (!isDragEnabled) {
            setIsSelectMode(false);
            setSelectedIds(new Set());
          }
        }}
        onOpenGroupManager={() => setShowGroupManager(true)}
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
          ) : isDragEnabled ? (
            /* 拖拽模式下显示所有平台并支持排序 */
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredPlatforms.map(p => p.id)}
                strategy={rectSortingStrategy}
              >
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
                  aria-label="AI平台列表（拖拽排序模式）"
                >
                  {filteredPlatforms.map((platform, index) => (
                    <SortablePlatformCard
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
                      isDragEnabled={isDragEnabled}
                    />
                  ))}
                </div>
              </SortableContext>
              <DragOverlay>
                {activeId ? (
                  <div className="opacity-80 scale-105">
                    {(() => {
                      const platform = filteredPlatforms.find(p => p.id === activeId);
                      return platform ? (
                        <PlatformCard
                          platform={platform}
                          viewMode={viewMode}
                          isSelectMode={false}
                          isSelected={false}
                          onSelect={() => {}}
                          onStar={() => {}}
                          onEdit={() => {}}
                          onGo={() => {}}
                          index={0}
                        />
                      ) : null;
                    })()}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : (
            /* 普通模式下按分组显示 */
            <div className="space-y-8">
              {groups
                .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                .map((group) => {
                  // 获取该分组下经过过滤的平台
                  const groupPlatforms = filteredPlatforms.filter(p => (p.groupId || 'default') === group.id);
                  
                  if (groupPlatforms.length === 0 && currentCategory === 'all' && searchKeyword === '') {
                    // 在全部视图且无搜索时，显示空分组
                    return (
                      <div key={group.id} className="space-y-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleGroupCollapsed(group.id)}
                            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                          >
                            <span className="text-2xl">{group.icon}</span>
                            <h2 className="text-xl font-bold">{group.name}</h2>
                            <span className="text-white/50 text-sm">({groupPlatforms.length})</span>
                            <span className={`transition-transform duration-200 ${group.collapsed ? '-rotate-90' : ''}`}>
                              ▼
                            </span>
                          </button>
                        </div>
                        {!group.collapsed && (
                          <div className="text-white/50 text-sm py-8 text-center">
                            该分组暂无平台
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  if (groupPlatforms.length === 0) {
                    return null;
                  }

                  return (
                    <div key={group.id} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleGroupCollapsed(group.id)}
                          className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                        >
                          <span className="text-2xl">{group.icon}</span>
                          <h2 className="text-xl font-bold">{group.name}</h2>
                          <span className="text-white/50 text-sm">({groupPlatforms.length})</span>
                          <span className={`transition-transform duration-200 ${group.collapsed ? '-rotate-90' : ''}`}>
                            ▼
                          </span>
                        </button>
                      </div>
                      {!group.collapsed && (
                        <div
                          className={`grid gap-6 ${
                            viewMode === 'grid'
                              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                              : 'grid-cols-1'
                          }`}
                          style={{
                            minHeight: '100px'
                          }}
                          role="list"
                          aria-label={`${group.name}分组的AI平台`}
                        >
                          {groupPlatforms
                            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                            .map((platform, index) => (
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
                  );
                })}
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
        groups={groups}
        onSave={handleSaveEdit}
        onDelete={handleDelete}
      />

      {/* 添加平台弹窗 */}
      <AddPlatformModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        groups={groups}
        onAdd={handleAdd}
      />

      {/* 分组管理弹窗 */}
      <GroupManagerModal
        isOpen={showGroupManager}
        onClose={() => setShowGroupManager(false)}
        groups={groups}
        onAddGroup={handleAddGroup}
        onUpdateGroup={handleUpdateGroup}
        onDeleteGroup={handleDeleteGroup}
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
