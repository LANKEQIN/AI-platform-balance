import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Platform, PlatformGroup } from '../types/platform';
import { DEFAULT_PLATFORMS } from '../config/platforms';

interface EditPlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: Platform | null;
  groups: PlatformGroup[];
  onSave: (platform: Platform) => void;
  onDelete?: (id: string) => void;
}

const EditPlatformModal: React.FC<EditPlatformModalProps> = ({
  isOpen,
  onClose,
  platform,
  groups,
  onSave,
  onDelete
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('云服务商');
  const [groupId, setGroupId] = useState('default');
  const [starred, setStarred] = useState(false);
  const [note, setNote] = useState('');
  const [showReset, setShowReset] = useState(false);

  // 有效的分类选项
  const categories = ['云服务商', 'C端平台', '其他'];

  // 初始化表单数据
  useEffect(() => {
    if (platform) {
      setName(platform.name);
      setUrl(platform.customUrl || platform.url);
      setCategory(platform.category);
      setGroupId(platform.groupId || 'default');
      setStarred(platform.starred || false);
      setNote(platform.note || '');

      // 检查是否有默认平台，且用户使用了自定义链接
      const defaultPlatform = DEFAULT_PLATFORMS.find(p => p.id === platform.id);
      setShowReset(!!(defaultPlatform && platform.customUrl));
    }
  }, [platform, isOpen]);

  const handleSave = () => {
    if (!platform) return;

    // 查找默认平台
    const defaultPlatform = DEFAULT_PLATFORMS.find(p => p.id === platform.id);
    let customUrl: string | undefined;

    // 如果是默认平台，检查是否修改了链接
    if (defaultPlatform) {
      if (url !== defaultPlatform.url) {
        customUrl = url;
      }
    } else {
      // 自定义平台，始终保存链接
      customUrl = url;
    }

    const updatedPlatform: Platform = {
      ...platform,
      name,
      category,
      groupId,
      customUrl,
      starred,
      note: note || undefined
    };

    onSave(updatedPlatform);
    onClose();
  };

  const handleReset = () => {
    if (!platform) return;
    const defaultPlatform = DEFAULT_PLATFORMS.find(p => p.id === platform.id);
    if (defaultPlatform) {
      setUrl(defaultPlatform.url);
      setShowReset(false);
    }
  };

  const handleDelete = () => {
    if (platform && onDelete) {
      onDelete(platform.id);
      onClose();
    }
  };

  // 判断是否是自定义平台（不在默认列表中）
  const isCustomPlatform = platform && !DEFAULT_PLATFORMS.find(p => p.id === platform.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="编辑平台"
      footer={
        <>
          {showReset && (
            <button className="btn btn-secondary" onClick={handleReset}>
              恢复默认链接
            </button>
          )}
          <button className="btn btn-secondary" onClick={onClose}>
            取消
          </button>
          {isCustomPlatform && onDelete && (
            <button className="btn btn-danger" onClick={handleDelete}>
              删除
            </button>
          )}
          <button className="btn btn-primary" onClick={handleSave}>
            保存
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* 平台名称 */}
        <div>
          <label htmlFor="editName" className="block mb-1 text-sm font-semibold text-white">
            平台名称
          </label>
          <input
            id="editName"
            type="text"
            className="form-input"
            placeholder="请输入平台名称"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
        </div>

        {/* 余额页面链接 */}
        <div>
          <label htmlFor="editUrl" className="block mb-1 text-sm font-semibold text-white">
            余额页面链接
          </label>
          <input
            id="editUrl"
            type="url"
            className="form-input"
            placeholder="请输入余额页面链接"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            autoComplete="url"
          />
          {platform && (
            <p className="text-xs text-white/60 mt-1">
              默认链接: <span className="text-white/80">{platform.url}</span>
            </p>
          )}
        </div>

        {/* 分类 */}
        <div>
          <label htmlFor="editCategory" className="block mb-1 text-sm font-semibold text-white">
            分类
          </label>
          <select
            id="editCategory"
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 分组 */}
        <div>
          <label htmlFor="editGroup" className="block mb-1 text-sm font-semibold text-white">
            分组
          </label>
          <select
            id="editGroup"
            className="form-select"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          >
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.icon} {group.name}
              </option>
            ))}
          </select>
        </div>

        {/* 收藏 */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={starred}
              onChange={(e) => setStarred(e.target.checked)}
              className="w-4 h-4 rounded border-white/30 bg-white/10"
            />
            <span className="text-white">收藏此平台</span>
          </label>
        </div>

        {/* 备注 */}
        <div>
          <label htmlFor="editNote" className="block mb-1 text-sm font-semibold text-white">
            备注
          </label>
          <textarea
            id="editNote"
            className="form-input resize-none"
            placeholder="添加备注信息，例如：这个月还有XX额度..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditPlatformModal;
