import React, { useState, useEffect, useCallback } from 'react';
import { poetryDatabase, quotesDatabase, PoetryItem, ContentType } from '../config/poetry';

interface PoetryDisplayProps {
  className?: string;
}

const PoetryDisplay: React.FC<PoetryDisplayProps> = ({ className = '' }) =&gt; {
  const [currentContent, setCurrentContent] = useState&lt;PoetryItem&gt;();
  const [contentType, setContentType] = useState&lt;ContentType&gt;('poetry');
  const [currentIndex, setCurrentIndex] = useState&lt;number&gt;(0);

  const getRandomContent = useCallback((type: ContentType, avoidIndex?: number) =&gt; {
    const database = type === 'poetry' ? poetryDatabase : quotesDatabase;
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * database.length);
    } while (database.length &gt; 1 &amp;&amp; newIndex === avoidIndex);

    setCurrentIndex(newIndex);
    setCurrentContent(database[newIndex]);
  }, []);

  useEffect(() =&gt; {
    const database = contentType === 'poetry' ? poetryDatabase : quotesDatabase;
    const randomIndex = Math.floor(Math.random() * database.length);
    setCurrentIndex(randomIndex);
    setCurrentContent(database[randomIndex]);
  }, [contentType]);

  const handleRefresh = () =&gt; {
    getRandomContent(contentType, currentIndex);
  };

  const handleSwitchType = () =&gt; {
    const newType = contentType === 'poetry' ? 'quote' : 'poetry';
    setContentType(newType);
  };

  if (!currentContent) return null;

  return (
    &lt;div className={`glass backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/20 ${className}`}&gt;
      &lt;div className="flex items-start justify-between mb-4"&gt;
        &lt;div className="flex items-center gap-3"&gt;
          &lt;span className="text-2xl opacity-70"&gt;
            {contentType === 'poetry' ? '📜' : '💬'}
          &lt;/span&gt;
          &lt;button
            onClick={handleSwitchType}
            className="text-sm text-white/60 hover:text-white transition-colors"
          &gt;
            {contentType === 'poetry' ? '切换至名人名言' : '切换至古诗词'}
          &lt;/button&gt;
        &lt;/div&gt;
        &lt;button
          onClick={handleRefresh}
          className="btn btn-icon text-sm"
          aria-label="刷新"
          title="换一条"
        &gt;
          🔄
        &lt;/button&gt;
      &lt;/div&gt;

      &lt;div className="text-center"&gt;
        &lt;p className="text-xl font-medium mb-2 bg-gradient-to-r from-white via-cyan-100 to-cyan-200 bg-clip-text text-transparent"&gt;
          {currentContent.line1}
        &lt;/p&gt;
        {currentContent.line2 &amp;&amp; (
          &lt;p className="text-lg text-white/80 mb-4"&gt;
            {currentContent.line2}
          &lt;/p&gt;
        )}
        {currentContent.author &amp;&amp; (
          &lt;p className="text-sm text-white/50 italic"&gt;
            —— {currentContent.author}
          &lt;/p&gt;
        )}
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

export default PoetryDisplay;
