/**
 * 主应用逻辑
 * 负责页面渲染、事件绑定和交互处理
 */

// 应用状态
const AppState = {
    platforms: [],
    currentEditId: null,
    searchKeyword: ''
};

/**
 * 初始化应用
 */
function initApp() {
    // 加载平台配置
    AppState.platforms = StorageManager.getPlatforms();
    
    // 初始化主题
    initTheme();
    
    // 渲染平台卡片
    renderPlatforms();
    
    // 绑定事件
    bindEvents();
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
            p.category.toLowerCase().includes(keyword)
        );
    }
    
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
    
    return `
        <div class="platform-card" data-id="${platform.id}">
            <div class="platform-card-header">
                <div class="platform-icon">${platform.icon || '📦'}</div>
                <span class="platform-name">${platform.name}</span>
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
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // 主题切换
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // 添加平台按钮
    document.getElementById('addPlatformBtn').addEventListener('click', openAddModal);
    document.getElementById('addFirstPlatformBtn').addEventListener('click', openAddModal);
    
    // 编辑弹窗事件
    setupEditModalEvents();
    
    // 添加弹窗事件
    setupAddModalEvents();
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
    }
}

/**
 * 处理搜索
 * @param {Event} event 输入事件
 */
function handleSearch(event) {
    AppState.searchKeyword = event.target.value.trim();
    renderPlatforms();
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
    const name = document.getElementById('editName').value.trim();
    const url = document.getElementById('editUrl').value.trim();
    const category = document.getElementById('editCategory').value;

    if (!name || !url) {
        alert('请填写平台名称和链接');
        return;
    }

    // 获取默认链接，判断是否需要保存customUrl
    const defaultPlatform = DEFAULT_PLATFORMS.find(p => p.id === AppState.currentEditId);
    const updates = {
        name: name,
        category: category
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
    const name = document.getElementById('addName').value.trim();
    const url = document.getElementById('addUrl').value.trim();
    const category = document.getElementById('addCategory').value;
    
    if (!name || !url) {
        alert('请填写平台名称和链接');
        return;
    }
    
    const newPlatform = {
        name: name,
        url: url,
        customUrl: url,
        category: category,
        icon: '📦'
    };
    
    if (StorageManager.addPlatform(newPlatform)) {
        AppState.platforms = StorageManager.getPlatforms();
        renderPlatforms();
        closeAddModal();
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);
