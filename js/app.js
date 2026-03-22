/**
 * 主应用逻辑
 * 负责页面渲染、事件绑定和交互处理
 */

// 应用状态
const AppState = {
    platforms: [],
    currentEditId: null,
    currentEditPlatform: null,
    searchKeyword: '',
    currentCategory: 'all',
    viewMode: 'grid'
};

/**
 * Toast 提示管理器
 */
const ToastManager = {
    container: null,

    /**
     * 初始化Toast容器
     */
    init: function() {
        this.container = document.getElementById('toastContainer');
    },

    /**
     * 显示Toast提示
     * @param {string} message 提示消息
     * @param {string} type 类型 ('success', 'error', 'warning', 'info')
     * @param {number} duration 显示时长(毫秒)
     */
    show: function(message, type = 'info', duration = 3000) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close">×</button>
        `;

        // 关闭按钮事件
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.hide(toast);
        });

        this.container.appendChild(toast);

        // 自动关闭
        setTimeout(() => {
            this.hide(toast);
        }, duration);
    },

    /**
     * 隐藏Toast
     * @param {HTMLElement} toast Toast元素
     */
    hide: function(toast) {
        if (toast && toast.parentNode) {
            toast.classList.add('hiding');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }
};

/**
 * 表单验证器
 */
const FormValidator = {
    /**
     * 验证URL格式
     * @param {string} url URL字符串
     * @returns {boolean} 是否有效
     */
    isValidUrl: function(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * 验证表单字段
     * @param {HTMLElement} input 输入元素
     * @param {string} value 值
     * @param {string} type 字段类型
     * @returns {boolean} 是否有效
     */
    validate: function(input, value, type) {
        let isValid = true;
        let errorMsg = '';

        // 移除之前的错误状态
        input.classList.remove('error');
        const existingError = input.parentNode.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }

        if (!value.trim()) {
            isValid = false;
            errorMsg = '此字段不能为空';
        } else if (type === 'url' && !this.isValidUrl(value)) {
            isValid = false;
            errorMsg = '请输入有效的URL地址';
        }

        if (!isValid) {
            input.classList.add('error');
            const errorEl = document.createElement('p');
            errorEl.className = 'form-error visible';
            errorEl.textContent = errorMsg;
            input.parentNode.appendChild(errorEl);
        }

        return isValid;
    }
};

/**
 * 初始化应用
 */
function initApp() {
    // 初始化Toast
    ToastManager.init();

    // 加载平台配置
    AppState.platforms = StorageManager.getPlatforms();

    // 初始化主题
    initTheme();

    // 初始化视图模式
    initViewMode();

    // 初始化特效模式
    initEffectsMode();

    // 渲染分类标签
    renderCategoryTabs();

    // 渲染平台卡片
    renderPlatforms();

    // 绑定事件
    bindEvents();

    // 绑定键盘快捷键
    bindKeyboardShortcuts();
}

/**
 * 初始化主题
 */
function initTheme() {
    const savedTheme = StorageManager.getTheme();
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon(true);
    }
}

/**
 * 初始化特效模式
 */
function initEffectsMode() {
    const savedMode = StorageManager.getEffectsMode();
    updateEffectsIcon(savedMode);
}

/**
 * 渲染分类标签
 * 从CATEGORIES配置动态生成分类标签
 */
function renderCategoryTabs() {
    const container = document.getElementById('categoryTabsContainer');
    if (!container) return;

    container.innerHTML = CATEGORIES.map(cat =>
        `<button class="filter-tab" data-category="${cat.id}">${cat.name}</button>`
    ).join('');

    renderCategorySelects();
}

/**
 * 渲染分类下拉选项
 * 为编辑和添加弹窗的select元素动态生成选项
 */
function renderCategorySelects() {
    const editSelect = document.getElementById('editCategory');
    const addSelect = document.getElementById('addCategory');

    const optionsHtml = CATEGORIES.map(cat =>
        `<option value="${cat.id}">${cat.name}</option>`
    ).join('');

    if (editSelect) editSelect.innerHTML = optionsHtml;
    if (addSelect) addSelect.innerHTML = optionsHtml;
}

/**
 * 更新特效模式图标
 * @param {string} mode 特效模式
 */
function updateEffectsIcon(mode) {
    const effectsIcon = document.querySelector('.effects-icon');
    if (effectsIcon) {
        effectsIcon.textContent = mode === 'cool' ? '⚡' : '💡';
    }
}

/**
 * 切换特效模式
 */
function toggleEffects() {
    const currentMode = StorageManager.getEffectsMode();
    const newMode = currentMode === 'cool' ? 'simple' : 'cool';

    StorageManager.saveEffectsMode(newMode);
    VisualEffects.setMode(newMode);
    updateEffectsIcon(newMode);

    const message = newMode === 'cool' ? '已开启狂拽酷炫特效模式 ⚡' : '已切换到省电小清新模式 💡';
    ToastManager.show(message, 'info');
}

/**
 * 初始化视图模式
 */
function initViewMode() {
    const savedViewMode = StorageManager.getViewMode();
    AppState.viewMode = savedViewMode;

    // 更新视图按钮状态
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === savedViewMode);
    });

    // 应用视图模式
    const platformGrid = document.getElementById('platformGrid');
    if (savedViewMode === 'list') {
        platformGrid.classList.add('list-view');
    }
}

/**
 * 更新主题图标
 * @param {boolean} isDark 是否为深色模式
 */
function updateThemeIcon(isDark) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = isDark ? '☀️' : '🌙';
    }
}

/**
 * 渲染平台卡片
 * @param {Array} platforms 要渲染的平台列表（可选，默认使用AppState.platforms）
 */
function renderPlatforms(platforms) {
    const platformGrid = document.getElementById('platformGrid');
    const emptyState = document.getElementById('emptyState');
    const platformsToRender = platforms || AppState.platforms;

    // 过滤搜索关键词
    let filteredPlatforms = platformsToRender;
    if (AppState.searchKeyword) {
        const keyword = AppState.searchKeyword.toLowerCase();
        filteredPlatforms = platformsToRender.filter(p =>
            p.name.toLowerCase().includes(keyword) ||
            p.category.toLowerCase().includes(keyword) ||
            (p.url && p.url.toLowerCase().includes(keyword))
        );
    }

    // 过滤分类
    if (AppState.currentCategory !== 'all') {
        if (AppState.currentCategory === 'starred') {
            filteredPlatforms = filteredPlatforms.filter(p => p.starred);
        } else {
            filteredPlatforms = filteredPlatforms.filter(p => p.category === AppState.currentCategory);
        }
    }

    // 排序：收藏的排在前面
    filteredPlatforms.sort((a, b) => {
        if (a.starred && !b.starred) return -1;
        if (!a.starred && b.starred) return 1;
        return 0;
    });

    // 显示空状态或平台列表
    if (filteredPlatforms.length === 0) {
        platformGrid.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    // 生成卡片HTML
    platformGrid.innerHTML = filteredPlatforms.map(platform => createPlatformCard(platform)).join('');
}

/**
 * 创建平台卡片HTML
 * @param {Object} platform 平台配置
 * @returns {string} 卡片HTML字符串
 */
function createPlatformCard(platform) {
    const displayUrl = platform.customUrl || platform.url;
    const showUrl = displayUrl.length > 50 ? displayUrl.substring(0, 50) + '...' : displayUrl;
    const starredClass = platform.starred ? 'starred' : '';
    const starredIcon = platform.starred ? '⭐' : '☆';

    return `
        <div class="platform-card ${starredClass}" data-id="${platform.id}" draggable="true">
            <div class="drag-handle" title="拖拽排序" aria-label="拖拽排序">⋮⋮</div>
            <div class="platform-card-header">
                <div class="platform-icon">${platform.icon || '📦'}</div>
                <span class="platform-name">${platform.name}</span>
                <button class="star-btn ${platform.starred ? 'active' : ''}" data-action="star" data-id="${platform.id}" title="${platform.starred ? '取消收藏' : '收藏'}">${starredIcon}</button>
                <span class="platform-category">${platform.category}</span>
            </div>
            <div class="platform-card-body">
                <p class="platform-url" title="${displayUrl}">${showUrl}</p>
            </div>
            <div class="platform-card-footer">
                <button class="btn btn-go" data-action="go" data-url="${displayUrl}">
                    前往余额
                </button>
                <button class="btn btn-edit" data-action="edit" data-id="${platform.id}">
                    编辑
                </button>
            </div>
        </div>
    `;
}

/**
 * 绑定事件处理
 */
function bindEvents() {
    // 平台卡片点击事件（事件委托）
    document.getElementById('platformGrid').addEventListener('click', handleCardClick);

    // 搜索框事件
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);

    // 搜索框清空按钮
    document.getElementById('searchClear').addEventListener('click', clearSearch);

    // 分类筛选
    document.getElementById('filterTabs').addEventListener('click', handleCategoryFilter);

    // 视图切换
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', handleViewToggle);
    });

    // 主题切换
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // 特效模式切换
    document.getElementById('effectsToggle').addEventListener('click', toggleEffects);

    // 添加平台按钮
    document.getElementById('addPlatformBtn').addEventListener('click', openAddModal);
    document.getElementById('addFirstPlatformBtn').addEventListener('click', openAddModal);

    // 下拉菜单
    document.getElementById('moreBtn').addEventListener('click', toggleDropdown);
    document.addEventListener('click', closeDropdownOnOutsideClick);

    // 导出配置
    document.getElementById('exportBtn').addEventListener('click', exportConfig);

    // 导入配置
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });
    document.getElementById('importFile').addEventListener('change', importConfig);

    // 重置配置
    document.getElementById('resetBtn').addEventListener('click', resetConfig);

    // 编辑弹窗事件
    setupEditModalEvents();

    // 添加弹窗事件
    setupAddModalEvents();

    // 导入确认弹窗事件
    setupImportConfirmModalEvents();

    // 初始化拖拽排序
    initDragAndDrop();
}

/**
 * 设置导入确认弹窗事件
 */
function setupImportConfirmModalEvents() {
    const modal = document.getElementById('importConfirmModal');
    if (!modal) return;

    document.getElementById('importConfirmBtn').addEventListener('click', confirmImport);
    document.getElementById('importCancelBtn').addEventListener('click', cancelImport);
    modal.querySelector('.modal-overlay').addEventListener('click', cancelImport);
}

/**
 * 绑定键盘快捷键
 */
function bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeEditModal();
            closeAddModal();
            cancelImport();
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
    });
}

/**
 * 初始化拖拽排序
 */
function initDragAndDrop() {
    const platformGrid = document.getElementById('platformGrid');
    if (!platformGrid) return;

    let draggedElement = null;
    let draggedId = null;

    platformGrid.addEventListener('dragstart', function(e) {
        const card = e.target.closest('.platform-card');
        if (!card) return;

        draggedElement = card;
        draggedId = card.dataset.id;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', draggedId);
    });

    platformGrid.addEventListener('dragend', function(e) {
        const card = e.target.closest('.platform-card');
        if (!card) return;

        card.classList.remove('dragging');
        draggedElement = null;
        draggedId = null;

        document.querySelectorAll('.platform-card').forEach(c => {
            c.classList.remove('drag-over');
        });
    });

    platformGrid.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const card = e.target.closest('.platform-card');
        if (!card || card === draggedElement) return;

        document.querySelectorAll('.platform-card').forEach(c => {
            c.classList.remove('drag-over');
        });

        card.classList.add('drag-over');
    });

    platformGrid.addEventListener('dragleave', function(e) {
        const card = e.target.closest('.platform-card');
        if (!card) return;

        if (!platformGrid.contains(e.relatedTarget)) {
            card.classList.remove('drag-over');
        }
    });

    platformGrid.addEventListener('drop', function(e) {
        e.preventDefault();

        const targetCard = e.target.closest('.platform-card');
        if (!targetCard || targetCard === draggedElement) return;

        const targetId = targetCard.dataset.id;

        const orderedIds = [];
        document.querySelectorAll('.platform-card').forEach(card => {
            orderedIds.push(card.dataset.id);
        });

        const draggedIndex = orderedIds.indexOf(draggedId);
        const targetIndex = orderedIds.indexOf(targetId);

        if (draggedIndex !== -1 && targetIndex !== -1) {
            orderedIds.splice(draggedIndex, 1);
            orderedIds.splice(targetIndex, 0, draggedId);

            if (StorageManager.savePlatformOrder(orderedIds)) {
                AppState.platforms = StorageManager.getPlatforms();
                renderPlatforms();
                ToastManager.show('排序已保存', 'success', 1500);
            }
        }

        targetCard.classList.remove('drag-over');
    });
}

/**
 * 处理卡片点击
 * @param {Event} event 点击事件
 */
function handleCardClick(event) {
    const button = event.target.closest('button');
    if (!button) return;

    const action = button.dataset.action;

    if (action === 'go') {
        // 跳转到余额页面
        const url = button.dataset.url;
        if (url) {
            window.open(url, '_blank');
        }
    } else if (action === 'edit') {
        // 打开编辑弹窗
        const platformId = button.dataset.id;
        openEditModal(platformId);
    } else if (action === 'star') {
        // 切换收藏状态
        const platformId = button.dataset.id;
        toggleStar(platformId);
    }
}

/**
 * 切换收藏状态
 * @param {string} platformId 平台ID
 */
function toggleStar(platformId) {
    const platform = AppState.platforms.find(p => p.id === platformId);
    if (platform) {
        const newStarred = !platform.starred;
        StorageManager.updatePlatform(platformId, { starred: newStarred });
        AppState.platforms = StorageManager.getPlatforms();
        renderPlatforms();
        ToastManager.show(newStarred ? '已添加到收藏' : '已取消收藏', 'success');
    }
}

/**
 * 处理搜索
 * @param {Event} event 输入事件
 */
function handleSearch(event) {
    AppState.searchKeyword = event.target.value.trim();
    renderPlatforms();

    // 显示/隐藏清空按钮
    const clearBtn = document.getElementById('searchClear');
    clearBtn.style.opacity = AppState.searchKeyword ? '1' : '0';
}

/**
 * 清空搜索
 */
function clearSearch() {
    document.getElementById('searchInput').value = '';
    AppState.searchKeyword = '';
    document.getElementById('searchClear').style.opacity = '0';
    renderPlatforms();
}

/**
 * 处理分类筛选
 * @param {Event} event 点击事件
 */
function handleCategoryFilter(event) {
    const tab = event.target.closest('.filter-tab');
    if (!tab) return;

    // 更新激活状态
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // 更新筛选条件
    AppState.currentCategory = tab.dataset.category;
    renderPlatforms();
}

/**
 * 处理视图切换
 * @param {Event} event 点击事件
 */
function handleViewToggle(event) {
    const btn = event.target.closest('.view-btn');
    if (!btn) return;

    const viewMode = btn.dataset.view;
    AppState.viewMode = viewMode;

    // 更新按钮状态
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // 更新网格样式
    const platformGrid = document.getElementById('platformGrid');
    if (viewMode === 'list') {
        platformGrid.classList.add('list-view');
    } else {
        platformGrid.classList.remove('list-view');
    }

    // 保存设置
    StorageManager.saveViewMode(viewMode);
}

/**
 * 切换主题
 */
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';

    if (isDark) {
        html.removeAttribute('data-theme');
        StorageManager.saveTheme('light');
    } else {
        html.setAttribute('data-theme', 'dark');
        StorageManager.saveTheme('dark');
    }

    updateThemeIcon(!isDark);
}

/**
 * 切换下拉菜单
 */
function toggleDropdown() {
    const menu = document.getElementById('moreMenu');
    menu.classList.toggle('active');
}

/**
 * 点击外部关闭下拉菜单
 * @param {Event} event 点击事件
 */
function closeDropdownOnOutsideClick(event) {
    const dropdown = document.querySelector('.dropdown');
    const menu = document.getElementById('moreMenu');
    if (dropdown && !dropdown.contains(event.target)) {
        menu.classList.remove('active');
    }
}

/**
 * 导出配置
 */
function exportConfig() {
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

    // 关闭下拉菜单
    document.getElementById('moreMenu').classList.remove('active');
    ToastManager.show('配置已导出', 'success');
}

/**
 * 导入配置
 * @param {Event} event 文件选择事件
 */
function importConfig(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
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

        openImportConfirmModal(validation.data, content);
    };
    reader.readAsText(file);

    event.target.value = '';
    document.getElementById('moreMenu').classList.remove('active');
}

/**
 * 打开导入确认弹窗
 * @param {Object} info 验证后的配置信息
 * @param {string} content 原始JSON内容
 */
function openImportConfirmModal(info, content) {
    const modal = document.getElementById('importConfirmModal');
    if (!modal) return;

    document.getElementById('importInfo').innerHTML = `
        <p><strong>平台数量：</strong>${info.platformsCount} 个</p>
        <p><strong>主题设置：</strong>${info.theme === 'dark' ? '🌙 深色模式' : '☀️ 浅色模式'}</p>
        <p><strong>视图模式：</strong>${info.viewMode === 'list' ? '☰ 列表视图' : '▦ 网格视图'}</p>
    `;

    modal.classList.add('active');
    modal.dataset.content = content;
}

/**
 * 确认导入配置
 */
function confirmImport() {
    const modal = document.getElementById('importConfirmModal');
    const content = modal.dataset.content;

    if (StorageManager.importConfig(content)) {
        AppState.platforms = StorageManager.getPlatforms();
        initViewMode();
        initTheme();
        renderPlatforms();
        ToastManager.show('配置已导入', 'success');
    } else {
        ToastManager.show('导入失败，请检查配置文件', 'error');
    }

    modal.classList.remove('active');
}

/**
 * 取消导入配置
 */
function cancelImport() {
    document.getElementById('importConfirmModal').classList.remove('active');
}

/**
 * 重置配置
 */
function resetConfig() {
    if (!confirm('确定要重置为默认配置吗？这将清除所有自定义设置。')) return;

    StorageManager.resetToDefault();
    AppState.platforms = StorageManager.getPlatforms();
    renderPlatforms();

    document.getElementById('moreMenu').classList.remove('active');
    ToastManager.show('已重置为默认配置', 'success');
}

/**
 * 打开编辑弹窗
 * @param {string} platformId 平台ID
 */
function openEditModal(platformId) {
    const platform = AppState.platforms.find(p => p.id === platformId);
    if (!platform) return;

    AppState.currentEditId = platformId;
    AppState.currentEditPlatform = platform;

    // 填充表单
    document.getElementById('editName').value = platform.name;
    document.getElementById('editUrl').value = platform.customUrl || platform.url;
    document.getElementById('editCategory').value = platform.category;
    document.getElementById('editStarred').checked = platform.starred || false;

    // 显示默认链接提示（仅预设平台显示）
    const urlHint = document.getElementById('editUrlHint');
    const resetBtn = document.getElementById('modalReset');
    const defaultPlatform = DEFAULT_PLATFORMS.find(p => p.id === platformId);

    if (defaultPlatform) {
        urlHint.style.display = 'block';
        urlHint.querySelector('span').textContent = defaultPlatform.url;
        resetBtn.style.display = 'inline-flex';
    } else {
        urlHint.style.display = 'none';
        resetBtn.style.display = 'none';
    }

    // 显示弹窗
    document.getElementById('editModal').classList.add('active');
}

/**
 * 关闭编辑弹窗
 */
function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
    AppState.currentEditId = null;
    AppState.currentEditPlatform = null;
}

/**
 * 设置编辑弹窗事件
 */
function setupEditModalEvents() {
    const modal = document.getElementById('editModal');

    // 关闭按钮
    document.getElementById('modalClose').addEventListener('click', closeEditModal);
    document.getElementById('modalCancel').addEventListener('click', closeEditModal);

    // 点击遮罩关闭
    modal.querySelector('.modal-overlay').addEventListener('click', closeEditModal);

    // 保存按钮
    document.getElementById('modalSave').addEventListener('click', saveEdit);

    // 删除按钮
    document.getElementById('modalDelete').addEventListener('click', deletePlatform);

    // 恢复默认链接按钮
    document.getElementById('modalReset').addEventListener('click', resetToDefaultUrl);
}

/**
 * 保存编辑
 */
function saveEdit() {
    const nameInput = document.getElementById('editName');
    const urlInput = document.getElementById('editUrl');
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();
    const category = document.getElementById('editCategory').value;
    const starred = document.getElementById('editStarred').checked;

    // 验证
    if (!FormValidator.validate(nameInput, name, 'text')) return;
    if (!FormValidator.validate(urlInput, url, 'url')) return;

    // 获取默认链接，判断是否需要保存customUrl
    const defaultPlatform = DEFAULT_PLATFORMS.find(p => p.id === AppState.currentEditId);
    const updates = {
        name: name,
        category: category,
        starred: starred
    };

    // 如果链接与默认链接相同，则不保存customUrl
    if (defaultPlatform && url === defaultPlatform.url) {
        updates.customUrl = null;
    } else {
        updates.customUrl = url;
    }

    if (StorageManager.updatePlatform(AppState.currentEditId, updates)) {
        // 重新加载配置并渲染
        AppState.platforms = StorageManager.getPlatforms();
        renderPlatforms();
        closeEditModal();
        ToastManager.show('保存成功', 'success');
    } else {
        ToastManager.show('保存失败', 'error');
    }
}

/**
 * 恢复默认链接
 */
function resetToDefaultUrl() {
    const defaultPlatform = DEFAULT_PLATFORMS.find(p => p.id === AppState.currentEditId);
    if (defaultPlatform) {
        document.getElementById('editUrl').value = defaultPlatform.url;
    }
}

/**
 * 删除平台
 */
function deletePlatform() {
    if (!confirm('确定要删除这个平台吗？')) return;

    if (StorageManager.deletePlatform(AppState.currentEditId)) {
        AppState.platforms = StorageManager.getPlatforms();
        renderPlatforms();
        closeEditModal();
        ToastManager.show('已删除', 'success');
    } else {
        ToastManager.show('删除失败', 'error');
    }
}

/**
 * 打开添加弹窗
 */
function openAddModal() {
    // 清空表单
    document.getElementById('addName').value = '';
    document.getElementById('addUrl').value = '';
    document.getElementById('addCategory').value = '大模型';

    // 清除错误状态
    document.querySelectorAll('#addModal .form-input').forEach(input => {
        input.classList.remove('error');
    });
    document.querySelectorAll('#addModal .form-error').forEach(el => {
        el.remove();
    });

    // 显示弹窗
    document.getElementById('addModal').classList.add('active');
}

/**
 * 关闭添加弹窗
 */
function closeAddModal() {
    document.getElementById('addModal').classList.remove('active');
}

/**
 * 设置添加弹窗事件
 */
function setupAddModalEvents() {
    const modal = document.getElementById('addModal');

    // 关闭按钮
    document.getElementById('addModalClose').addEventListener('click', closeAddModal);
    document.getElementById('addModalCancel').addEventListener('click', closeAddModal);

    // 点击遮罩关闭
    modal.querySelector('.modal-overlay').addEventListener('click', closeAddModal);

    // 添加按钮
    document.getElementById('addModalSave').addEventListener('click', addNewPlatform);
}

/**
 * 添加新平台
 */
function addNewPlatform() {
    const nameInput = document.getElementById('addName');
    const urlInput = document.getElementById('addUrl');
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();
    const category = document.getElementById('addCategory').value;

    // 验证
    if (!FormValidator.validate(nameInput, name, 'text')) return;
    if (!FormValidator.validate(urlInput, url, 'url')) return;

    const newPlatform = {
        name: name,
        url: url,
        customUrl: url,
        category: category,
        icon: '📦',
        starred: false
    };

    if (StorageManager.addPlatform(newPlatform)) {
        AppState.platforms = StorageManager.getPlatforms();
        renderPlatforms();
        closeAddModal();
        ToastManager.show('添加成功', 'success');
    } else {
        ToastManager.show('添加失败', 'error');
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);
