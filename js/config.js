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
        id: 'promptpilot',
        name: 'PromptPilot',
        category: '其他',
        url: 'https://promptpilot.volcengine.com/',
        icon: '✈️',
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
        id: 'deepseek-chat',
        name: 'DeepSeek Chat',
        category: 'AI平台',
        url: 'https://chat.deepseek.com/',
        icon: '💬',
        enabled: true
    },
    {
        id: 'minimax-agent',
        name: 'MiniMax Agent',
        category: 'AI平台',
        url: 'https://agent.minimaxi.com/',
        icon: '🤖',
        enabled: true
    },
    {
        id: 'zhipu-glm',
        name: '智谱GLM',
        category: 'AI平台',
        url: 'https://chatglm.cn/main/alltoolsdetail?lang=zh',
        icon: '🧬',
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
    },
    {
        id: 'siliconflow-global',
        name: '硅基流动（国际）',
        category: '大模型',
        url: 'https://cloud.siliconflow.com/models',
        icon: '💎',
        enabled: true
    },
    {
        id: 'openrouter',
        name: 'OpenRouter',
        category: '大模型',
        url: 'https://openrouter.ai/',
        icon: '🛤️',
        enabled: true
    },
    {
        id: 'aihubmix',
        name: 'AIHubMix',
        category: '大模型',
        url: 'https://aihubmix.com/models',
        icon: '🧩',
        enabled: true
    },
    {
        id: 'zhipu-open',
        name: '智谱开放平台',
        category: '大模型',
        url: 'https://open.bigmodel.cn/pricing',
        icon: '🧠',
        enabled: true
    },
    {
        id: 'zhipu-global',
        name: '智谱国际',
        category: '大模型',
        url: 'https://z.ai/manage-apikey/apikey-list',
        icon: '🌐',
        enabled: true
    },
    {
        id: 'aigcpanel',
        name: 'AIGC Panel',
        category: '其他',
        url: 'https://aigcpanel.com/zh',
        icon: '🎭',
        enabled: true
    },
    {
        id: 'grok',
        name: 'Grok',
        category: 'AI平台',
        url: 'https://grok.com/',
        icon: '🤖',
        enabled: true
    },
    {
        id: 'chatgpt',
        name: 'ChatGPT',
        category: 'AI平台',
        url: 'https://chatgpt.com/',
        icon: '💬',
        enabled: true
    },
    {
        id: 'canirun',
        name: 'Canirun',
        category: 'AI平台',
        url: 'https://www.canirun.ai/',
        icon: '🚀',
        enabled: true
    },
    {
        id: 'manus',
        name: 'Manus',
        category: 'AI平台',
        url: 'https://manus.im/app',
        icon: '✋',
        enabled: true
    },
    {
        id: 'ai-bot',
        name: 'AI工具集',
        category: '其他',
        url: 'https://ai-bot.cn',
        icon: '🧰',
        enabled: true
    },
    {
        id: 'aibase-daily',
        name: 'AI日报',
        category: '其他',
        url: 'https://news.aibase.com/zh/daily',
        icon: '📰',
        enabled: true
    },
    {
        id: 'huggingface',
        name: 'Hugging Face',
        category: 'AI平台',
        url: 'https://huggingface.co',
        icon: '🤗',
        enabled: true
    }
];

// 分类配置
const CATEGORIES = [
    { id: '大模型', name: '大模型' },
    { id: 'AI平台', name: 'AI平台（C端网页）' },
    { id: '图像生成', name: '图像生成' },
    { id: '其他', name: '其他' }
];

// 分组配置
const GROUPS = [
    { id: 'all', name: '全部', icon: '📋' },
    { id: '大模型', name: '大模型', icon: '🤖' },
    { id: 'AI平台', name: 'AI平台', icon: '💬' },
    { id: '图像生成', name: '图像生成', icon: '🎨' },
    { id: '其他', name: '其他', icon: '📦' }
];

// localStorage键名常量
const STORAGE_KEYS = {
    PLATFORMS_CONFIG: 'ai_platforms_config',
    THEME: 'ai_platforms_theme',
    CONFIG_VERSION: 'ai_platforms_config_version',
    VIEW_MODE: 'ai_platforms_view_mode',
    EFFECTS_MODE: 'ai_platforms_effects_mode',
    SELECTED_IDS: 'ai_platforms_selected_ids'
};

// 配置版本号 - 修改平台列表时递增此版本号
const CONFIG_VERSION = 3;
