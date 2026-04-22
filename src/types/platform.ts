// 平台数据类型定义
export interface Platform {
  id: string;
  name: string;
  category: string;
  url: string;
  icon: string;
  enabled: boolean;
  customUrl?: string;
  starred?: boolean;
  note?: string;
  sortOrder?: number; // 排序权重
  groupId?: string; // 所属分组ID
}

// 分组数据类型定义
export interface PlatformGroup {
  id: string;
  name: string;
  icon: string;
  sortOrder?: number;
  collapsed?: boolean;
}

// localStorage键名
export const STORAGE_KEYS = {
  PLATFORMS_CONFIG: 'ai_platforms_config',
  THEME: 'ai_platforms_theme',
  CONFIG_VERSION: 'ai_platforms_config_version',
  VIEW_MODE: 'ai_platforms_view_mode',
  EFFECTS_MODE: 'ai_platforms_effects_mode',
  SELECTED_IDS: 'ai_platforms_selected_ids',
  HAS_VISITED: 'ai_platforms_has_visited',
  GROUPS_CONFIG: 'ai_platforms_groups' // 新增分组存储键
} as const;

// 配置版本号
export const CONFIG_VERSION = 6; // 升级版本号

// 分类配置
export const CATEGORIES: Array<{ id: string; name: string; icon: string }> = [
  { id: 'all', name: '全部', icon: '📋' },
  { id: '云服务商', name: '云服务商', icon: '🤖' },
  { id: 'C端平台', name: 'C端平台', icon: '💬' },
  { id: '其他', name: '其他', icon: '📦' }
];

// 默认分组配置
export const DEFAULT_GROUPS: PlatformGroup[] = [
  { id: 'default', name: '默认分组', icon: '📦', sortOrder: 0 }
];
