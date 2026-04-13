import React, { useState, useEffect } from 'react';
import { PlatformGroup } from '../types/platform';
import Modal from './Modal';

interface GroupManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups: PlatformGroup[];
  onAddGroup: (group: Omit<PlatformGroup, 'id' | 'sortOrder'>) => void;
  onUpdateGroup: (groupId: string, updates: Partial<PlatformGroup>) => void;
  onDeleteGroup: (groupId: string) => void;
}

const GroupManagerModal: React.FC<GroupManagerModalProps> = ({
  isOpen,
  onClose,
  groups,
  onAddGroup,
  onUpdateGroup,
  onDeleteGroup
}) => {
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState('');
  const [groupIcon, setGroupIcon] = useState('📦');

  // 常用图标列表
  const iconOptions = ['📦', '🚀', '💼', '🎯', '⚡', '🔥', '💎', '🌟', '📁', '🎨'];

  useEffect(() => {
    if (isOpen) {
      setEditingGroupId(null);
      setGroupName('');
      setGroupIcon('📦');
    }
  }, [isOpen]);

  const handleAddGroup = () => {
    if (groupName.trim()) {
      onAddGroup({
        name: groupName.trim(),
        icon: groupIcon
      });
      setGroupName('');
      setGroupIcon('📦');
    }
  };

  const handleEditGroup = (group: PlatformGroup) => {
    setEditingGroupId(group.id);
    setGroupName(group.name);
    setGroupIcon(group.icon);
  };

  const handleSaveEdit = () => {
    if (editingGroupId && groupName.trim()) {
      onUpdateGroup(editingGroupId, {
        name: groupName.trim(),
        icon: groupIcon
      });
      setEditingGroupId(null);
      setGroupName('');
      setGroupIcon('📦');
    }
  };

  const handleCancelEdit = () => {
    setEditingGroupId(null);
    setGroupName('');
    setGroupIcon('📦');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="分组管理"
      width="max-w-md"
    >
      <div className="space-y-4">
        {/* 添加/编辑分组表单 */}
        <div className="glass rounded-xl p-4">
          <h3 className="text-white font-medium mb-3">
            {editingGroupId ? '编辑分组' : '添加新分组'}
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-white/70 text-sm mb-1 block">分组名称</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="输入分组名称"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-primary-400"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">分组图标</label>
              <div className="flex gap-2 flex-wrap">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setGroupIcon(icon)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                      groupIcon === icon
                        ? 'bg-primary-500 ring-2 ring-white/30'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              {editingGroupId ? (
                <>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 btn bg-gradient-to-br from-primary-500 to-primary-400 text-white"
                  >
                    保存
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="btn glass glass-hover"
                  >
                    取消
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAddGroup}
                  className="flex-1 btn bg-gradient-to-br from-green-500 to-emerald-400 text-white"
                >
                  添加分组
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 分组列表 */}
        <div>
          <h3 className="text-white font-medium mb-3">现有分组</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {groups.map((group) => (
              <div
                key={group.id}
                className="glass rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{group.icon}</span>
                  <span className="text-white font-medium">
                    {group.name}
                    {group.id === 'default' && (
                      <span className="text-xs text-white/50 ml-2">(默认)</span>
                    )}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditGroup(group)}
                    className="w-8 h-8 rounded-lg glass glass-hover flex items-center justify-center text-white/70 hover:text-white"
                    aria-label="编辑分组"
                  >
                    ✏️
                  </button>
                  {group.id !== 'default' && (
                    <button
                      onClick={() => onDeleteGroup(group.id)}
                      className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400 hover:text-red-300"
                      aria-label="删除分组"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default GroupManagerModal;
