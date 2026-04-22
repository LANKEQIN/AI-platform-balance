import { Platform } from '../types/platform';

// 预设平台列表
export const DEFAULT_PLATFORMS: Platform[] = [
  {
    id: 'volcengine',
    name: '火山引擎',
    category: '云服务商',
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
    category: '云服务商',
    url: 'https://platform.deepseek.com/usage',
    icon: '🔍',
    enabled: true
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    category: 'C端平台',
    url: 'https://chat.deepseek.com/',
    icon: '💬',
    enabled: true
  },
  {
    id: 'minimax-agent',
    name: 'MiniMax Agent',
    category: 'C端平台',
    url: 'https://agent.minimaxi.com/',
    icon: '🤖',
    enabled: true
  },
  {
    id: 'zhipu-glm',
    name: '智谱GLM',
    category: 'C端平台',
    url: 'https://chatglm.cn/main/alltoolsdetail?lang=zh',
    icon: '🧬',
    enabled: true
  },
  {
    id: 'moonshot',
    name: '月之暗面',
    category: '云服务商',
    url: 'https://platform.moonshot.cn/console/account',
    icon: '🌙',
    enabled: true
  },
  {
    id: 'zhipu',
    name: '智谱',
    category: '云服务商',
    url: 'https://www.bigmodel.cn/finance-center/finance/overview',
    icon: '🧠',
    enabled: true
  },
  {
    id: 'aliyun-bailian',
    name: '阿里百炼',
    category: '云服务商',
    url: 'https://billing-cost.console.aliyun.com/home',
    icon: '☁️',
    enabled: true
  },
  {
    id: 'modelscope',
    name: '魔搭社区',
    category: '云服务商',
    url: 'https://modelscope.cn/my/overview',
    icon: '🤝',
    enabled: true
  },
  {
    id: 'minimax',
    name: 'Minimax',
    category: '云服务商',
    url: 'https://platform.minimaxi.com/user-center/payment/balance',
    icon: '⚡',
    enabled: true
  },
  {
    id: 'siliconflow',
    name: '硅基流动（中国）',
    category: '云服务商',
    url: 'https://cloud.siliconflow.cn/me/expensebill',
    icon: '💎',
    enabled: true
  },
  {
    id: 'siliconflow-global',
    name: '硅基流动（国际）',
    category: '云服务商',
    url: 'https://cloud.siliconflow.com/models',
    icon: '💎',
    enabled: true
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    category: '云服务商',
    url: 'https://openrouter.ai/',
    icon: '🛤️',
    enabled: true
  },
  {
    id: 'aihubmix',
    name: 'AIHubMix',
    category: '云服务商',
    url: 'https://aihubmix.com/models',
    icon: '🧩',
    enabled: true
  },
  {
    id: 'zhipu-open',
    name: '智谱开放平台',
    category: '云服务商',
    url: 'https://open.bigmodel.cn/pricing',
    icon: '🧠',
    enabled: true
  },
  {
    id: 'zhipu-global',
    name: '智谱国际',
    category: '云服务商',
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
    category: 'C端平台',
    url: 'https://grok.com/',
    icon: '🤖',
    enabled: true
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'C端平台',
    url: 'https://chatgpt.com/',
    icon: '💬',
    enabled: true
  },
  {
    id: 'canirun',
    name: 'Canirun',
    category: 'C端平台',
    url: 'https://www.canirun.ai/',
    icon: '🚀',
    enabled: true
  },
  {
    id: 'manus',
    name: 'Manus',
    category: 'C端平台',
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
    category: 'C端平台',
    url: 'https://huggingface.co',
    icon: '🤗',
    enabled: true
  },
  {
    id: 'kimi-code',
    name: 'Kimi Code',
    category: '云服务商',
    url: 'https://www.kimi.com/code',
    icon: '🚀',
    enabled: true
  }
];
