import { Platform } from '../types/platform';

// 预设平台列表
export const DEFAULT_PLATFORMS: Platform[] = [
  {
    id: 'volcengine',
    name: '火山引擎',
    category: '云服务商',
    url: 'https://console.volcengine.com/finance/bill/detail',
    icon: '🌋',
    enabled: true,
    sortOrder: 0,
    groupId: 'default'
  },
  {
    id: 'promptpilot',
    name: 'PromptPilot',
    category: '其他',
    url: 'https://promptpilot.volcengine.com/',
    icon: '✈️',
    enabled: true,
    sortOrder: 1,
    groupId: 'default'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    category: '云服务商',
    url: 'https://platform.deepseek.com/usage',
    icon: '🔍',
    enabled: true,
    sortOrder: 2,
    groupId: 'default'
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    category: 'C端平台',
    url: 'https://chat.deepseek.com/',
    icon: '💬',
    enabled: true,
    sortOrder: 3,
    groupId: 'default'
  },
  {
    id: 'minimax-agent',
    name: 'MiniMax Agent',
    category: 'C端平台',
    url: 'https://agent.minimaxi.com/',
    icon: '🤖',
    enabled: true,
    sortOrder: 4,
    groupId: 'default'
  },
  {
    id: 'zhipu-glm',
    name: '智谱GLM',
    category: 'C端平台',
    url: 'https://chatglm.cn/main/alltoolsdetail?lang=zh',
    icon: '🧬',
    enabled: true,
    sortOrder: 5,
    groupId: 'default'
  },
  {
    id: 'moonshot',
    name: '月之暗面',
    category: '云服务商',
    url: 'https://platform.moonshot.cn/console/account',
    icon: '🌙',
    enabled: true,
    sortOrder: 6,
    groupId: 'default'
  },
  {
    id: 'zhipu',
    name: '智谱',
    category: '云服务商',
    url: 'https://www.bigmodel.cn/finance-center/finance/overview',
    icon: '🧠',
    enabled: true,
    sortOrder: 7,
    groupId: 'default'
  },
  {
    id: 'aliyun-bailian',
    name: '阿里百炼',
    category: '云服务商',
    url: 'https://billing-cost.console.aliyun.com/home',
    icon: '☁️',
    enabled: true,
    sortOrder: 8,
    groupId: 'default'
  },
  {
    id: 'modelscope',
    name: '魔搭社区',
    category: '云服务商',
    url: 'https://modelscope.cn/my/overview',
    icon: '🤝',
    enabled: true,
    sortOrder: 9,
    groupId: 'default'
  },
  {
    id: 'minimax',
    name: 'Minimax',
    category: '云服务商',
    url: 'https://platform.minimaxi.com/user-center/payment/balance',
    icon: '⚡',
    enabled: true,
    sortOrder: 10,
    groupId: 'default'
  },
  {
    id: 'siliconflow',
    name: '硅基流动（中国）',
    category: '云服务商',
    url: 'https://cloud.siliconflow.cn/me/expensebill',
    icon: '💎',
    enabled: true,
    sortOrder: 11,
    groupId: 'default'
  },
  {
    id: 'siliconflow-global',
    name: '硅基流动（国际）',
    category: '云服务商',
    url: 'https://cloud.siliconflow.com/models',
    icon: '💎',
    enabled: true,
    sortOrder: 12,
    groupId: 'default'
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    category: '云服务商',
    url: 'https://openrouter.ai/',
    icon: '🛤️',
    enabled: true,
    sortOrder: 13,
    groupId: 'default'
  },
  {
    id: 'aihubmix',
    name: 'AIHubMix',
    category: '云服务商',
    url: 'https://aihubmix.com/models',
    icon: '🧩',
    enabled: true,
    sortOrder: 14,
    groupId: 'default'
  },
  {
    id: 'zhipu-open',
    name: '智谱开放平台',
    category: '云服务商',
    url: 'https://open.bigmodel.cn/pricing',
    icon: '🧠',
    enabled: true,
    sortOrder: 15,
    groupId: 'default'
  },
  {
    id: 'zhipu-global',
    name: '智谱国际',
    category: '云服务商',
    url: 'https://z.ai/manage-apikey/apikey-list',
    icon: '🌐',
    enabled: true,
    sortOrder: 16,
    groupId: 'default'
  },
  {
    id: 'aigcpanel',
    name: 'AIGC Panel',
    category: '其他',
    url: 'https://aigcpanel.com/zh',
    icon: '🎭',
    enabled: true,
    sortOrder: 17,
    groupId: 'default'
  },
  {
    id: 'grok',
    name: 'Grok',
    category: 'C端平台',
    url: 'https://grok.com/',
    icon: '🤖',
    enabled: true,
    sortOrder: 18,
    groupId: 'default'
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'C端平台',
    url: 'https://chatgpt.com/',
    icon: '💬',
    enabled: true,
    sortOrder: 19,
    groupId: 'default'
  },
  {
    id: 'canirun',
    name: 'Canirun',
    category: 'C端平台',
    url: 'https://www.canirun.ai/',
    icon: '🚀',
    enabled: true,
    sortOrder: 20,
    groupId: 'default'
  },
  {
    id: 'manus',
    name: 'Manus',
    category: 'C端平台',
    url: 'https://manus.im/app',
    icon: '✋',
    enabled: true,
    sortOrder: 21,
    groupId: 'default'
  },
  {
    id: 'ai-bot',
    name: 'AI工具集',
    category: '其他',
    url: 'https://ai-bot.cn',
    icon: '🧰',
    enabled: true,
    sortOrder: 22,
    groupId: 'default'
  },
  {
    id: 'aibase-daily',
    name: 'AI日报',
    category: '其他',
    url: 'https://news.aibase.com/zh/daily',
    icon: '📰',
    enabled: true,
    sortOrder: 23,
    groupId: 'default'
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    category: 'C端平台',
    url: 'https://huggingface.co',
    icon: '🤗',
    enabled: true,
    sortOrder: 24,
    groupId: 'default'
  }
];
