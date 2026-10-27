import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, width }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // 处理ESC键关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 点击背景关闭
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 打开时锁定body滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* 遮罩层 */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleOverlayClick}
      />

      {/* 弹窗内容 */}
      <div
        ref={modalRef}
        className={`relative surface rounded-xl w-[90%] ${width || 'max-w-[480px]'} animate-modal-slide-in overflow-hidden max-h-[90vh] overflow-y-auto`}
      >
        {/* 头部 */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-[var(--border)] relative z-1">
          <h2 id="modal-title" className="text-xl font-bold text-primary">
            {title}
          </h2>
          <button
            className="w-11 h-11 border-none bg-transparent text-2xl text-secondary cursor-pointer rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-primary focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
            onClick={onClose}
            aria-label="关闭弹窗"
          >
            ×
          </button>
        </div>

        {/* 内容 */}
        <div className="p-4 md:p-6 relative z-1">
          {children}
        </div>

        {/* 底部 */}
        {footer && (
          <div className="flex justify-end gap-2 p-4 md:p-6 border-t border-[var(--border)] relative z-1">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
