/**
 * 事件处理模块
 * 负责所有用户交互事件和拖拽排序
 */

const EventHandler = {
    /**
     * 初始化所有事件监听
     */
    init() {
        this.bindCardEvents();
        this.bindSearchEvents();
        this.bindFilterEvents();
        this.bindViewEvents();
        this.bindThemeEvents();
        this.bindDropdownEvents();
        this.bindImportExportEvents();
        this.bindBatchEvents();
        this.bindModalEvents();
        this.bindKeyboardShortcuts();
        DragDropManager.init();
    },

    bindCardEvents() {
        document.getElementById('platformGrid').addEventListener('click', (e) => {
            const button = e.target.closest('button');
            const checkbox = e.target.closest('.card-checkbox');

            if (checkbox) {
                const platformId = checkbox.dataset.id;
                this.handleToggleSelect(platformId);
                return;
            }

            if (!button) return;

            const action = button.dataset.action;

            if (action === 'go') {
                const url = button.dataset.url;
                Utils.openUrlSafely(url);
            } else if (action === 'edit') {
                ModalManager.openEditModal(button.dataset.id);
            } else if (action === 'star') {
                this.handleToggleStar(button.dataset.id);
            }
        });
    },

    handleToggleSelect(platformId) {
        SelectStateManager.toggle(platformId);
        updateSelectUI();
        updateBatchToolbar();
        SelectStateManager.scheduleSave();
    },

    handleToggleStar(platformId) {
        const platform = AppState.platforms.find(p => p.id === platformId);
        if (platform) {
            const newStarred = !platform.starred;
            StorageManager.updatePlatform(platformId, { starred: newStarred });
            AppState.platforms = StorageManager.getPlatforms();
            Renderer.renderPlatforms();
            ToastManager.show(newStarred ? '已添加到收藏' : '已取消收藏', 'success');
        }
    },

    handleSearch: null,

    bindSearchEvents() {
        const searchInput = document.getElementById('searchInput');
        this.handleSearch = debounce((e) => {
            AppState.searchKeyword = e.target.value.trim();
            Renderer.renderPlatforms();
            const clearBtn = document.getElementById('searchClear');
            clearBtn.style.opacity = AppState.searchKeyword ? '1' : '0';
        }, 150);

        searchInput.addEventListener('input', this.handleSearch);
        document.getElementById('searchClear').addEventListener('click', () => {
            searchInput.value = '';
            AppState.searchKeyword = '';
            document.getElementById('searchClear').style.opacity = '0';
            Renderer.renderPlatforms();
        });
    },

    bindFilterEvents() {
        document.getElementById('filterTabs').addEventListener('click', (e) => {
            const tab = e.target.closest('.filter-tab');
            if (!tab) return;

            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            AppState.currentCategory = tab.dataset.category;
            Renderer.renderPlatforms();
        });
    },

    bindViewEvents() {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const viewMode = btn.dataset.view;
                AppState.viewMode = viewMode;

                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const platformGrid = document.getElementById('platformGrid');
                if (viewMode === 'list') {
                    platformGrid.classList.add('list-view');
                } else {
                    platformGrid.classList.remove('list-view');
                }

                StorageManager.saveViewMode(viewMode);
            });
        });
    },

    bindThemeEvents() {
        document.getElementById('themeToggle').addEventListener('click', () => {
            const html = document.documentElement;
            const isDark = html.getAttribute('data-theme') === 'dark';

            if (isDark) {
                html.removeAttribute('data-theme');
                StorageManager.saveTheme('light');
            } else {
                html.setAttribute('data-theme', 'dark');
                StorageManager.saveTheme('dark');
            }

            Renderer.updateThemeIcon(!isDark);
        });

        document.getElementById('effectsToggle').addEventListener('click', () => {
            const currentMode = StorageManager.getEffectsMode();
            const newMode = currentMode === 'cool' ? 'simple' : 'cool';

            StorageManager.saveEffectsMode(newMode);
            VisualEffects.setMode(newMode);
            Renderer.updateEffectsIcon(newMode);

            const message = newMode === 'cool' ? '已开启狂拽酷炫特效模式 ⚡' : '已切换到省电小清新模式 💡';
            ToastManager.show(message, 'info');
        });
    },

    bindDropdownEvents() {
        document.getElementById('moreBtn').addEventListener('click', () => {
            document.getElementById('moreMenu').classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            const dropdown = document.querySelector('.dropdown');
            const menu = document.getElementById('moreMenu');
            if (dropdown && !dropdown.contains(e.target)) {
                menu.classList.remove('active');
            }
        });
    },

    bindImportExportEvents() {
        document.getElementById('exportBtn').addEventListener('click', () => {
            const config = StorageManager.exportConfig();
            const blob = new Blob([config], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `ai-platforms-config-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            document.getElementById('moreMenu').classList.remove('active');
            ToastManager.show('配置已导出', 'success');
        });

        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        document.getElementById('importFile').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (ev) => {
                const content = ev.target.result;
                let config;
                try {
                    config = JSON.parse(content);
                } catch (err) {
                    ToastManager.show('配置文件格式无效，不是有效的JSON', 'error');
                    return;
                }

                const validation = StorageManager.validateImportConfig(config);
                if (!validation.valid) {
                    ToastManager.show(validation.message, 'error');
                    return;
                }

                ModalManager.openImportConfirmModal(validation.data, content);
            };
            reader.readAsText(file);

            e.target.value = '';
            document.getElementById('moreMenu').classList.remove('active');
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            if (!confirm('确定要重置为默认配置吗？这将清除所有自定义设置。')) return;

            StorageManager.resetToDefault();
            AppState.platforms = StorageManager.getPlatforms();
            Renderer.renderPlatforms();

            document.getElementById('moreMenu').classList.remove('active');
            ToastManager.show('已重置为默认配置', 'success');
        });
    },

    bindBatchEvents() {
        document.getElementById('selectModeBtn').addEventListener('click', () => {
            AppState.isSelectMode = true;
            document.body.classList.add('select-mode-active');
            Renderer.renderPlatforms();
            ToastManager.show('已进入选择模式，点击卡片即可选中', 'info', 2000);
        });

        document.getElementById('selectAllBtn').addEventListener('click', () => {
            const visibleCards = document.querySelectorAll('.platform-card');
            visibleCards.forEach(card => {
                AppState.selectedIds.add(card.dataset.id);
            });
            StorageManager.saveSelectedIds(Array.from(AppState.selectedIds));
            updateSelectUI();
            updateBatchToolbar();
            ToastManager.show(`已选中 ${AppState.selectedIds.size} 个平台`, 'success');
        });

        document.getElementById('batchOpenBtn').addEventListener('click', () => {
            const selectedPlatforms = AppState.platforms.filter(p => AppState.selectedIds.has(p.id));

            if (selectedPlatforms.length === 0) {
                ToastManager.show('请先选择要打开的平台', 'warning');
                return;
            }

            selectedPlatforms.forEach(platform => {
                const url = platform.customUrl || platform.url;
                Utils.openUrlSafely(url);
            });

            ToastManager.show(`正在打开 ${selectedPlatforms.length} 个平台...`, 'success');
        });

        document.getElementById('cancelSelectBtn').addEventListener('click', () => {
            AppState.isSelectMode = false;
            AppState.selectedIds.clear();
            SelectStateManager.clear();
            document.body.classList.remove('select-mode-active');
            Renderer.renderPlatforms();
            updateBatchToolbar();
            ToastManager.show('已退出选择模式', 'info', 1500);
        });
    },

    bindModalEvents() {
        document.getElementById('addPlatformBtn').addEventListener('click', () => ModalManager.openAddModal());
        document.getElementById('addFirstPlatformBtn').addEventListener('click', () => ModalManager.openAddModal());

        ModalManager.setupEditModalEvents();
        ModalManager.setupAddModalEvents();
        ModalManager.setupImportConfirmModalEvents();
    },

    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                ModalManager.closeEditModal();
                ModalManager.closeAddModal();
                ModalManager.cancelImport();
            }

            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) searchInput.focus();
            }

            if (e.key === 'Tab' && !e.shiftKey && document.activeElement && document.activeElement.classList.contains('btn')) {
                const buttons = Array.from(document.querySelectorAll('.btn'));
                const currentIndex = buttons.indexOf(document.activeElement);
                if (currentIndex !== -1 && currentIndex < buttons.length - 1) {
                    buttons[currentIndex + 1].focus();
                    e.preventDefault();
                }
            }

            if (e.key === 'Tab' && e.shiftKey && document.activeElement && document.activeElement.classList.contains('btn')) {
                const buttons = Array.from(document.querySelectorAll('.btn'));
                const currentIndex = buttons.indexOf(document.activeElement);
                if (currentIndex > 0) {
                    buttons[currentIndex - 1].focus();
                    e.preventDefault();
                }
            }
        });
    }
};

/**
 * 拖拽排序管理器
 */
const DragDropManager = {
    draggedElement: null,
    draggedId: null,

    init() {
        const platformGrid = document.getElementById('platformGrid');
        if (!platformGrid) return;

        platformGrid.addEventListener('dragstart', (e) => {
            const card = e.target.closest('.platform-card');
            if (!card) return;

            this.draggedElement = card;
            this.draggedId = card.dataset.id;
            card.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', this.draggedId);
        });

        platformGrid.addEventListener('dragend', (e) => {
            const card = e.target.closest('.platform-card');
            if (!card) return;

            card.classList.remove('dragging');
            this.draggedElement = null;
            this.draggedId = null;

            document.querySelectorAll('.platform-card').forEach(c => {
                c.classList.remove('drag-over');
            });
        });

        platformGrid.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            const card = e.target.closest('.platform-card');
            if (!card || card === this.draggedElement) return;

            document.querySelectorAll('.platform-card').forEach(c => {
                c.classList.remove('drag-over');
            });

            card.classList.add('drag-over');
        });

        platformGrid.addEventListener('dragleave', (e) => {
            const card = e.target.closest('.platform-card');
            if (!card) return;

            if (!platformGrid.contains(e.relatedTarget)) {
                card.classList.remove('drag-over');
            }
        });

        platformGrid.addEventListener('drop', (e) => {
            e.preventDefault();

            const targetCard = e.target.closest('.platform-card');
            if (!targetCard || targetCard === this.draggedElement) return;

            const targetId = targetCard.dataset.id;

            const orderedIds = [];
            document.querySelectorAll('.platform-card').forEach(card => {
                orderedIds.push(card.dataset.id);
            });

            const draggedIndex = orderedIds.indexOf(this.draggedId);
            const targetIndex = orderedIds.indexOf(targetId);

            if (draggedIndex !== -1 && targetIndex !== -1) {
                orderedIds.splice(draggedIndex, 1);
                orderedIds.splice(targetIndex, 0, this.draggedId);

                if (StorageManager.savePlatformOrder(orderedIds)) {
                    AppState.platforms = StorageManager.getPlatforms();
                    Renderer.renderPlatforms();
                    ToastManager.show('排序已保存', 'success', 1500);
                }
            }

            targetCard.classList.remove('drag-over');
        });
    }
};
