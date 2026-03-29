import React, { useState, useEffect, useCallback } from 'react';
import { poetryDatabase, quotesDatabase, PoetryItem, ContentType } from '../config/poetry';

interface PoetryDisplayProps {
  className?: string;
}

const PoetryDisplay: React.FC<PoetryDisplayProps> = ({ className = '' }) => {
  const [currentContent, setCurrentContent] = useState<PoetryItem>();
  const [contentType, setContentType] = useState<ContentType>('poetry');
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const getRandomContent = useCallback((type: ContentType, avoidIndex?: number) => {
    const database = type === 'poetry' ? poetryDatabase : quotesDatabase;
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * database.length);
    } while (database.length > 1 && newIndex === avoidIndex);

    setCurrentIndex(newIndex);
    setCurrentContent(database[newIndex]);
  }, []);

  useEffect(() => {
    const database = contentType === 'poetry' ? poetryDatabase : quotesDatabase;
    const randomIndex = Math.floor(Math.random() * database.length);
    setCurrentIndex(randomIndex);
    setCurrentContent(database[randomIndex]);
  }, [contentType]);

  const handleRefresh = () => {
    getRandomContent(contentType, currentIndex);
  };

  const handleSwitchType = () => {
    const newType = contentType === 'poetry' ? 'quote' : 'poetry';
    setContentType(newType);
  };

  if (!currentContent) return null;

  return (
    <div className={`glass backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/20 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl opacity-70">
            {contentType === 'poetry' ? '📜' : '💬'}
          </span>
          <button
            onClick={handleSwitchType}
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            {contentType === 'poetry' ? '切换至名人名言' : '切换至古诗词'}
          </button>
        </div>
        <button
          onClick={handleRefresh}
          className="btn btn-icon text-sm"
          aria-label="刷新"
          title="换一条"
        >
          🔄
        </button>
      </div>

      <div className="text-center">
        <p className="text-xl font-medium mb-2 bg-gradient-to-r from-white via-cyan-100 to-cyan-200 bg-clip-text text-transparent">
          {currentContent.line1}
        </p>
        {currentContent.line2 && (
          <p className="text-lg text-white/80 mb-4">
            {currentContent.line2}
          </p>
        )}
        {currentContent.author && (
          <p className="text-sm text-white/50 italic">
            —— {currentContent.author}
          </p>
        )}
      </div>
    </div>
  );
};

export default PoetryDisplay;
