import React, { useState, useEffect } from 'react';
import Modal from './Modal';

interface AddPlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (platform: { name: string; url: string; category: string; icon: string }) => void;
}

const AddPlatformModal: React.FC<AddPlatformModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('云服务商');

  // 有效的分类选项
  const categories = ['云服务商', 'C端平台', '其他'];

  // 重置表单
  useEffect(() => {
    if (isOpen) {
      setName('');
      setUrl('');
      setCategory('云服务商');
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
      icon: '🔗' // 默认图标
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
      </div>
    </Modal>
  );
};

export default AddPlatformModal;
