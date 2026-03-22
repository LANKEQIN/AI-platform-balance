/**
 * 主应用入口
 * 负责初始化和协调各模块
 */

/**
 * 初始化应用
 */
function initApp() {
    ToastManager.init();

    AppState.platforms = StorageManager.getPlatforms();
    AppState.selectedIds = new Set(StorageManager.getSelectedIds());

    initTheme();
    initViewMode();
    initEffectsMode();

    Renderer.renderCategoryTabs();
    Renderer.renderPlatforms();

    EventHandler.init();

    updateBatchToolbar();
}

/**
 * 初始化主题
 */
function initTheme() {
    const savedTheme = StorageManager.getTheme();
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        Renderer.updateThemeIcon(true);
    }
}

/**
 * 初始化特效模式
 */
function initEffectsMode() {
    const savedMode = StorageManager.getEffectsMode();
    Renderer.updateEffectsIcon(savedMode);
}

/**
 * 初始化视图模式
 */
function initViewMode() {
    const savedViewMode = StorageManager.getViewMode();
    AppState.viewMode = savedViewMode;

    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === savedViewMode);
    });

    const platformGrid = document.getElementById('platformGrid');
    if (savedViewMode === 'list') {
        platformGrid.classList.add('list-view');
    }
}

document.addEventListener('DOMContentLoaded', initApp);
