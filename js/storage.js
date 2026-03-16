/**
 * 本地存储管理模块
 * 负责用户配置的读取、保存和管理
 */

const StorageManager = {
    /**
     * 检查配置版本，如果版本不一致则重置配置
     * @returns {boolean} 是否需要重置
     */
    checkVersion: function() {
        try {
            const savedVersion = localStorage.getItem(STORAGE_KEYS.CONFIG_VERSION);
            if (savedVersion !== String(CONFIG_VERSION)) {
                // 版本不一致，清除旧配置
                localStorage.removeItem(STORAGE_KEYS.PLATFORMS_CONFIG);
                localStorage.setItem(STORAGE_KEYS.CONFIG_VERSION, String(CONFIG_VERSION));
                return true;
            }
        } catch (error) {
            console.error('检查配置版本失败:', error);
        }
        return false;
    },

    /**
     * 获取平台配置
     * 如果本地没有配置或版本不一致，返回默认配置
     * @returns {Array} 平台配置数组
     */
    getPlatforms: function() {
        try {
            // 先检查版本
            this.checkVersion();

            const savedConfig = localStorage.getItem(STORAGE_KEYS.PLATFORMS_CONFIG);
            if (savedConfig) {
                const parsed = JSON.parse(savedConfig);
                // 合并默认配置和用户配置
                return this.mergeWithDefaults(parsed);
            }
        } catch (error) {
            console.error('读取平台配置失败:', error);
        }
        // 返回默认配置的深拷贝
        return JSON.parse(JSON.stringify(DEFAULT_PLATFORMS));
    },

    /**
     * 保存平台配置
     * @param {Array} platforms 平台配置数组
     */
    savePlatforms: function(platforms) {
        try {
            localStorage.setItem(STORAGE_KEYS.PLATFORMS_CONFIG, JSON.stringify(platforms));
            return true;
        } catch (error) {
            console.error('保存平台配置失败:', error);
            return false;
        }
    },

    /**
     * 更新单个平台配置
     * @param {string} platformId 平台ID
     * @param {Object} updates 更新的字段
     */
    updatePlatform: function(platformId, updates) {
        const platforms = this.getPlatforms();
        const index = platforms.findIndex(p => p.id === platformId);
        if (index !== -1) {
            platforms[index] = { ...platforms[index], ...updates };
            return this.savePlatforms(platforms);
        }
        return false;
    },

    /**
     * 添加新平台
     * @param {Object} platform 新平台配置
     */
    addPlatform: function(platform) {
        const platforms = this.getPlatforms();
        // 生成唯一ID
        platform.id = 'custom_' + Date.now();
        platform.enabled = true;
        platforms.push(platform);
        return this.savePlatforms(platforms);
    },

    /**
     * 删除平台
     * @param {string} platformId 平台ID
     */
    deletePlatform: function(platformId) {
        const platforms = this.getPlatforms();
        const filtered = platforms.filter(p => p.id !== platformId);
        return this.savePlatforms(filtered);
    },

    /**
     * 合并用户配置和默认配置
     * 确保新增的默认平台能够显示
     * @param {Array} savedConfig 已保存的配置
     * @returns {Array} 合并后的配置
     */
    mergeWithDefaults: function(savedConfig) {
        const merged = [];
        const savedIds = new Set(savedConfig.map(p => p.id));
        
        // 添加已保存的配置
        savedConfig.forEach(platform => {
            merged.push(platform);
        });
        
        // 添加默认配置中新增的平台
        DEFAULT_PLATFORMS.forEach(defaultPlatform => {
            if (!savedIds.has(defaultPlatform.id)) {
                merged.push(JSON.parse(JSON.stringify(defaultPlatform)));
            }
        });
        
        return merged;
    },

    /**
     * 获取主题设置
     * @returns {string} 主题名称 ('light' 或 'dark')
     */
    getTheme: function() {
        return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    },

    /**
     * 保存主题设置
     * @param {string} theme 主题名称
     */
    saveTheme: function(theme) {
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
    },

    /**
     * 重置为默认配置
     */
    resetToDefault: function() {
        localStorage.removeItem(STORAGE_KEYS.PLATFORMS_CONFIG);
        localStorage.setItem(STORAGE_KEYS.CONFIG_VERSION, String(CONFIG_VERSION));
        return JSON.parse(JSON.stringify(DEFAULT_PLATFORMS));
    },

    /**
     * 获取视图模式
     * @returns {string} 视图模式 ('grid' 或 'list')
     */
    getViewMode: function() {
        return localStorage.getItem(STORAGE_KEYS.VIEW_MODE) || 'grid';
    },

    /**
     * 保存视图模式
     * @param {string} mode 视图模式
     */
    saveViewMode: function(mode) {
        localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);
    },

    /**
     * 导出配置为JSON字符串
     * @returns {string} JSON字符串
     */
    exportConfig: function() {
        const config = {
            platforms: this.getPlatforms(),
            theme: this.getTheme(),
            viewMode: this.getViewMode(),
            exportTime: new Date().toISOString(),
            version: CONFIG_VERSION
        };
        return JSON.stringify(config, null, 2);
    },

    /**
     * 导入配置
     * @param {string} jsonString JSON字符串
     * @returns {boolean} 是否成功
     */
    importConfig: function(jsonString) {
        try {
            const config = JSON.parse(jsonString);
            if (config.platforms && Array.isArray(config.platforms)) {
                this.savePlatforms(config.platforms);
                if (config.theme) {
                    this.saveTheme(config.theme);
                }
                if (config.viewMode) {
                    this.saveViewMode(config.viewMode);
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('导入配置失败:', error);
            return false;
        }
    }
};
