import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { PlatformGroup } from '../types/platform';

interface AddPlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups: PlatformGroup[];
  onAdd: (platform: { name: string; url: string; category: string; icon: string; groupId?: string; note?: string }) => void;
}

const AddPlatformModal: React.FC<AddPlatformModalProps> = ({ isOpen, onClose, groups, onAdd }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('云服务商');
  const [groupId, setGroupId] = useState('default');
  const [note, setNote] = useState('');

  // 有效的分类选项
  const categories = ['云服务商', 'C端平台', '其他'];

  // 重置表单
  useEffect(() => {
    if (isOpen) {
      setName('');
      setUrl('');
      setCategory('云服务商');
      setGroupId('default');
      setNote('');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!name.trim() || !url.trim()) {
      return;
    }

    onAdd({
      name: name.trim(),
      url: url.trim(),
      category,
      groupId,
      icon: '🔗', // 默认图标
      note: note.trim() || undefined
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="添加平台"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            取消
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!name.trim() || !url.trim()}>
            添加
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* 平台名称 */}
        <div>
          <label htmlFor="addName" className="block mb-1 text-sm font-semibold text-white">
            平台名称 <span className="text-pink-500">*</span>
          </label>
          <input
            id="addName"
            type="text"
            className="form-input"
            placeholder="请输入平台名称"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            required
            aria-required="true"
          />
        </div>

        {/* 余额页面链接 */}
        <div>
          <label htmlFor="addUrl" className="block mb-1 text-sm font-semibold text-white">
            余额页面链接 <span className="text-pink-500">*</span>
          </label>
          <input
            id="addUrl"
            type="url"
            className="form-input"
            placeholder="请输入余额页面链接"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            autoComplete="url"
            required
            aria-required="true"
          />
        </div>

        {/* 分类 */}
        <div>
          <label htmlFor="addCategory" className="block mb-1 text-sm font-semibold text-white">
            分类
          </label>
          <select
            id="addCategory"
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
          <label htmlFor="addGroup" className="block mb-1 text-sm font-semibold text-white">
            分组
          </label>
          <select
            id="addGroup"
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

        {/* 备注 */}
        <div>
          <label htmlFor="addNote" className="block mb-1 text-sm font-semibold text-white">
            备注
          </label>
          <textarea
            id="addNote"
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

export default AddPlatformModal;
