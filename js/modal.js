/**
 * 模态框管理模块
 * 负责编辑、添加、导入确认等弹窗的显示和操作
 */

const ModalManager = {
    openEditModal(platformId) {
        const platform = AppState.platforms.find(p => p.id === platformId);
        if (!platform) return;

        AppState.currentEditId = platformId;
        AppState.currentEditPlatform = platform;

        document.getElementById('editName').value = platform.name;
        document.getElementById('editUrl').value = platform.customUrl || platform.url;
        document.getElementById('editCategory').value = platform.category;
        document.getElementById('editStarred').checked = platform.starred || false;

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

        document.getElementById('editModal').classList.add('active');
    },

    closeEditModal() {
        document.getElementById('editModal').classList.remove('active');
        AppState.currentEditId = null;
        AppState.currentEditPlatform = null;
    },

    saveEdit() {
        const nameInput = document.getElementById('editName');
        const urlInput = document.getElementById('editUrl');
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();
        const category = document.getElementById('editCategory').value;
        const starred = document.getElementById('editStarred').checked;

        if (!FormValidator.validate(nameInput, name, 'text')) return;
        if (!FormValidator.validate(urlInput, url, 'url')) return;

        const defaultPlatform = DEFAULT_PLATFORMS.find(p => p.id === AppState.currentEditId);
        const updates = {
            name,
            category,
            starred
        };

        if (defaultPlatform && url === defaultPlatform.url) {
            updates.customUrl = null;
        } else {
            updates.customUrl = url;
        }

        if (StorageManager.updatePlatform(AppState.currentEditId, updates)) {
            AppState.platforms = StorageManager.getPlatforms();
            Renderer.renderPlatforms();
            this.closeEditModal();
            ToastManager.show('保存成功', 'success');
        } else {
            ToastManager.show('保存失败', 'error');
        }
    },

    resetToDefaultUrl() {
        const defaultPlatform = DEFAULT_PLATFORMS.find(p => p.id === AppState.currentEditId);
        if (defaultPlatform) {
            document.getElementById('editUrl').value = defaultPlatform.url;
        }
    },

    deletePlatform() {
        if (!confirm('确定要删除这个平台吗？')) return;

        if (StorageManager.deletePlatform(AppState.currentEditId)) {
            AppState.platforms = StorageManager.getPlatforms();
            Renderer.renderPlatforms();
            this.closeEditModal();
            ToastManager.show('已删除', 'success');
        } else {
            ToastManager.show('删除失败', 'error');
        }
    },

    openAddModal() {
        document.getElementById('addName').value = '';
        document.getElementById('addUrl').value = '';
        document.getElementById('addCategory').value = '大模型';

        document.querySelectorAll('#addModal .form-input').forEach(input => {
            input.classList.remove('error');
        });
        document.querySelectorAll('#addModal .form-error').forEach(el => {
            el.remove();
        });

        document.getElementById('addModal').classList.add('active');
    },

    closeAddModal() {
        document.getElementById('addModal').classList.remove('active');
    },

    addNewPlatform() {
        const nameInput = document.getElementById('addName');
        const urlInput = document.getElementById('addUrl');
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();
        const category = document.getElementById('addCategory').value;

        if (!FormValidator.validate(nameInput, name, 'text')) return;
        if (!FormValidator.validate(urlInput, url, 'url')) return;

        const newPlatform = {
            name,
            url,
            customUrl: url,
            category,
            icon: '📦',
            starred: false
        };

        if (StorageManager.addPlatform(newPlatform)) {
            AppState.platforms = StorageManager.getPlatforms();
            Renderer.renderPlatforms();
            this.closeAddModal();
            ToastManager.show('添加成功', 'success');
        } else {
            ToastManager.show('添加失败', 'error');
        }
    },

    openImportConfirmModal(info, content) {
        const modal = document.getElementById('importConfirmModal');
        if (!modal) return;

        document.getElementById('importInfo').innerHTML = `
            <p><strong>平台数量：</strong>${info.platformsCount} 个</p>
            <p><strong>主题设置：</strong>${info.theme === 'dark' ? '🌙 深色模式' : '☀️ 浅色模式'}</p>
            <p><strong>视图模式：</strong>${info.viewMode === 'list' ? '☰ 列表视图' : '▦ 网格视图'}</p>
        `;

        modal.classList.add('active');
        modal.dataset.content = content;
    },

    confirmImport() {
        const modal = document.getElementById('importConfirmModal');
        const content = modal.dataset.content;

        const result = StorageManager.importConfig(content);
        
        if (result.success) {
            AppState.platforms = StorageManager.getPlatforms();
            initViewMode();
            initTheme();
            Renderer.renderPlatforms();
            ToastManager.show(`配置已导入，共 ${result.data.platformsCount} 个平台`, 'success');
        } else {
            ToastManager.show(result.message, 'error');
        }

        modal.classList.remove('active');
    },

    cancelImport() {
        document.getElementById('importConfirmModal').classList.remove('active');
    },

    setupEditModalEvents() {
        const modal = document.getElementById('editModal');

        document.getElementById('modalClose').addEventListener('click', () => this.closeEditModal());
        document.getElementById('modalCancel').addEventListener('click', () => this.closeEditModal());
        modal.querySelector('.modal-overlay').addEventListener('click', () => this.closeEditModal());
        document.getElementById('modalSave').addEventListener('click', () => this.saveEdit());
        document.getElementById('modalDelete').addEventListener('click', () => this.deletePlatform());
        document.getElementById('modalReset').addEventListener('click', () => this.resetToDefaultUrl());
    },

    setupAddModalEvents() {
        const modal = document.getElementById('addModal');

        document.getElementById('addModalClose').addEventListener('click', () => this.closeAddModal());
        document.getElementById('addModalCancel').addEventListener('click', () => this.closeAddModal());
        modal.querySelector('.modal-overlay').addEventListener('click', () => this.closeAddModal());
        document.getElementById('addModalSave').addEventListener('click', () => this.addNewPlatform());
    },

    setupImportConfirmModalEvents() {
        const modal = document.getElementById('importConfirmModal');
        if (!modal) return;

        document.getElementById('importConfirmBtn').addEventListener('click', () => this.confirmImport());
        document.getElementById('importCancelBtn').addEventListener('click', () => this.cancelImport());
        modal.querySelector('.modal-overlay').addEventListener('click', () => this.cancelImport());
    }
};
