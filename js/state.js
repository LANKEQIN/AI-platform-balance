/**
 * 应用状态管理模块
 * 包含全局状态和应用级工具函数
 */

// 应用状态
const AppState = {
    platforms: [],
    currentEditId: null,
    currentEditPlatform: null,
    searchKeyword: '',
    currentCategory: 'all',
    viewMode: 'grid',
    selectedIds: new Set(),
    isSelectMode: false,
    isDirty: false
};

// 批量选择状态管理器
const SelectStateManager = {
    saveTimeout: null,

    toggle(platformId) {
        if (AppState.selectedIds.has(platformId)) {
            AppState.selectedIds.delete(platformId);
        } else {
            AppState.selectedIds.add(platformId);
        }
        AppState.isDirty = true;
    },

    scheduleSave() {
        if (this.saveTimeout) clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            if (AppState.isDirty) {
                StorageManager.saveSelectedIds(Array.from(AppState.selectedIds));
                AppState.isDirty = false;
            }
        }, 500);
    },

    clear() {
        if (this.saveTimeout) clearTimeout(this.saveTimeout);
        if (AppState.isDirty) {
            StorageManager.clearSelectedIds();
            AppState.isDirty = false;
        }
    }
};

/**
 * 更新批量工具栏状态
 */
function updateBatchToolbar() {
    const toolbar = document.getElementById('batchToolbar');
    const count = AppState.selectedIds.size;

    if (count > 0) {
        toolbar.classList.add('active');
        document.getElementById('selectedCount').textContent = count;
    } else {
        toolbar.classList.remove('active');
    }
}

/**
 * 更新选择UI状态
 */
function updateSelectUI() {
    const cards = document.querySelectorAll('.platform-card');
    cards.forEach(card => {
        const id = card.dataset.id;
        const checkbox = card.querySelector('.card-checkbox');
        if (AppState.selectedIds.has(id)) {
            card.classList.add('selected');
            checkbox.classList.add('checked');
        } else {
            card.classList.remove('selected');
            checkbox.classList.remove('checked');
        }
    });
}
