/**
 * 平台配置数据
 * 包含预设的AI平台列表及其默认余额页面链接
 */

// 预设平台列表
const DEFAULT_PLATFORMS = [
    {
        id: 'volcengine',
        name: '火山引擎',
        category: '大模型',
        url: 'https://console.volcengine.com/finance/bill/detail',
        icon: '🌋',
        enabled: true
    },
    {
        id: 'deepseek',
        name: 'DeepSeek',
        category: '大模型',
        url: 'https://platform.deepseek.com/usage',
        icon: '🔍',
        enabled: true
    },
    {
        id: 'moonshot',
        name: '月之暗面',
        category: '大模型',
        url: 'https://platform.moonshot.cn/console/account',
        icon: '🌙',
        enabled: true
    },
    {
        id: 'zhipu',
        name: '智谱',
        category: '大模型',
        url: 'https://www.bigmodel.cn/finance-center/finance/overview',
        icon: '🧠',
        enabled: true
    },
    {
        id: 'aliyun-bailian',
        name: '阿里百炼',
        category: '大模型',
        url: 'https://billing-cost.console.aliyun.com/home',
        icon: '☁️',
        enabled: true
    },
    {
        id: 'modelscope',
        name: '魔搭社区',
        category: '大模型',
        url: 'https://modelscope.cn/my/overview',
        icon: '🤝',
        enabled: true
    },
    {
        id: 'minimax',
        name: 'Minimax',
        category: '大模型',
        url: 'https://platform.minimaxi.com/user-center/payment/balance',
        icon: '⚡',
        enabled: true
    },
    {
        id: 'siliconflow',
        name: '硅基流动（中国）',
        category: '大模型',
        url: 'https://cloud.siliconflow.cn/me/expensebill',
        icon: '💎',
        enabled: true
    }
];

// 分类配置
const CATEGORIES = [
    { id: '大模型', name: '大模型' },
    { id: '图像生成', name: '图像生成' },
    { id: '其他', name: '其他' }
];

// localStorage键名常量
const STORAGE_KEYS = {
    PLATFORMS_CONFIG: 'ai_platforms_config',
    THEME: 'ai_platforms_theme',
    CONFIG_VERSION: 'ai_platforms_config_version'
};

// 配置版本号 - 修改平台列表时递增此版本号
const CONFIG_VERSION = 2;
