/**
 * 渲染模块
 * 负责UI渲染逻辑，包括平台卡片、分类标签等
 */

const Renderer = {
    /**
     * 渲染分类标签
     */
    renderCategoryTabs() {
        const container = document.getElementById('categoryTabsContainer');
        if (!container) return;

        const categories = getValidCategories();
        container.innerHTML = categories.map(group =>
            `<button class="filter-tab" data-category="${group.id}" data-group-icon="${group.icon}">${group.icon} ${group.name}</button>`
        ).join('');

        this.renderCategorySelects();
    },

    /**
     * 渲染分类下拉选项
     */
    renderCategorySelects() {
        const editSelect = document.getElementById('editCategory');
        const addSelect = document.getElementById('addCategory');

        const categories = getValidCategories();
        const optionsHtml = categories.map(group =>
            `<option value="${group.id}">${group.icon} ${group.name}</option>`
        ).join('');

        if (editSelect) editSelect.innerHTML = optionsHtml;
        if (addSelect) addSelect.innerHTML = optionsHtml;
    },

    /**
     * 渲染平台卡片
     */
    renderPlatforms(platforms) {
        const platformGrid = document.getElementById('platformGrid');
        const emptyState = document.getElementById('emptyState');
        const platformsToRender = platforms || AppState.platforms;

        let filteredPlatforms = platformsToRender;

        if (AppState.searchKeyword) {
            const keyword = AppState.searchKeyword.toLowerCase();
            filteredPlatforms = platformsToRender.filter(p =>
                p.name.toLowerCase().includes(keyword) ||
                p.category.toLowerCase().includes(keyword) ||
                (p.url && p.url.toLowerCase().includes(keyword))
            );
        }

        if (AppState.currentCategory !== 'all') {
            if (AppState.currentCategory === 'starred') {
                filteredPlatforms = filteredPlatforms.filter(p => p.starred);
            } else {
                filteredPlatforms = filteredPlatforms.filter(p => p.category === AppState.currentCategory);
            }
        }

        filteredPlatforms.sort((a, b) => {
            if (a.starred && !b.starred) return -1;
            if (!a.starred && b.starred) return 1;
            return 0;
        });

        if (filteredPlatforms.length === 0) {
            platformGrid.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        platformGrid.innerHTML = filteredPlatforms.map(p => this.createPlatformCard(p)).join('');
    },

    /**
     * 创建平台卡片HTML
     */
    createPlatformCard(platform) {
        const displayUrl = platform.customUrl || platform.url;
        const showUrl = displayUrl.length > 50 ? displayUrl.substring(0, 50) + '...' : displayUrl;
        const starredClass = platform.starred ? 'starred' : '';
        const starredIcon = platform.starred ? '⭐' : '☆';
        const isSelected = AppState.selectedIds.has(platform.id);
        const selectedClass = isSelected ? 'selected' : '';
        const selectModeClass = AppState.isSelectMode ? 'select-mode' : '';
        const checkboxChecked = isSelected ? 'checked' : '';

        return `
            <div class="platform-card ${starredClass} ${selectedClass} ${selectModeClass}" data-id="${platform.id}" draggable="true">
                <div class="card-checkbox ${checkboxChecked}" data-action="select" data-id="${platform.id}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
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
    },

    updateEffectsIcon(mode) {
        const effectsIcon = document.querySelector('.effects-icon');
        if (effectsIcon) {
            effectsIcon.textContent = mode === 'cool' ? '⚡' : '💡';
        }
    },

    updateThemeIcon(isDark) {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = isDark ? '☀️' : '🌙';
        }
    }
};
