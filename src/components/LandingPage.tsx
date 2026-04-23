import React, { useState, useCallback } from 'react';
import { poetryDatabase, quotesDatabase } from '../config/poetry';

interface LandingPageProps {
  onStart: () => void;
  isPowerSave?: boolean;
  onTogglePowerSave?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, isPowerSave = false, onTogglePowerSave }) => {
  // 只维护索引作为唯一数据源，内容从索引派生，避免状态不同步
  const [poetryIndex, setPoetryIndex] = useState<number>(() =>
    Math.floor(Math.random() * poetryDatabase.length)
  );
  const [quoteIndex, setQuoteIndex] = useState<number>(() =>
    Math.floor(Math.random() * quotesDatabase.length)
  );

  // 从索引派生当前内容，保证 index 与内容始终一致
  const currentPoetry = poetryDatabase[poetryIndex];
  const currentQuote = quotesDatabase[quoteIndex];

  // 随机切换古诗词（避开当前索引）
  const getRandomPoetry = useCallback((avoidIndex?: number) => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * poetryDatabase.length);
    } while (poetryDatabase.length > 1 && newIndex === avoidIndex);
    setPoetryIndex(newIndex);
  }, []);

  // 随机切换名人名言（避开当前索引）
  const getRandomQuote = useCallback((avoidIndex?: number) => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * quotesDatabase.length);
    } while (quotesDatabase.length > 1 && newIndex === avoidIndex);
    setQuoteIndex(newIndex);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 省电模式浮动切换按钮 */}
      {onTogglePowerSave && (
        <button
          onClick={onTogglePowerSave}
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            isPowerSave
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
              : 'glass border border-white/20 text-white/80 hover:text-white hover:border-white/40'
          }`}
          aria-label={isPowerSave ? '关闭极致省电模式' : '开启极致省电模式'}
          title={isPowerSave ? '已开启极致省电模式 - 点击关闭' : '开启极致省电模式（禁用动画/模糊/阴影，提升流畅度）'}
        >
          {isPowerSave ? '⚡ 省电模式' : '🔌 省电模式'}
        </button>
      )}

      {/* Hero区域 */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* 主标题 */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-br from-white via-indigo-100 to-cyan-200 bg-clip-text text-transparent">
              AI平台余额
              <br />
              快捷入口
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              一站式管理所有AI平台，快速访问余额查询页面，提升工作效率
            </p>
          </div>

          {/* 主要CTA按钮 */}
          <div className="mb-12">
            <button
              onClick={onStart}
              className="btn btn-primary text-lg px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              🚀 立即开始
            </button>
          </div>

          {/* 古诗词和名人名言卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {/* 古诗词卡片 */}
            <div className="glass backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl opacity-70">📜</span>
                  <span className="text-white font-semibold">古诗词</span>
                </div>
                <button
                  onClick={() => getRandomPoetry(poetryIndex)}
                  className="btn btn-icon text-sm"
                  aria-label="刷新古诗词"
                  title="换一首"
                >
                  🔄
                </button>
              </div>

              {currentPoetry && (
                <div className="text-center">
                  <p className="text-xl font-medium mb-2 bg-gradient-to-r from-white via-cyan-100 to-cyan-200 bg-clip-text text-transparent">
                    {currentPoetry.line1}
                  </p>
                  {currentPoetry.line2 && (
                    <p className="text-lg text-white/80 mb-4">
                      {currentPoetry.line2}
                    </p>
                  )}
                  {currentPoetry.author && (
                    <p className="text-sm text-white/50 italic">
                      —— {currentPoetry.author}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 名人名言卡片 */}
            <div className="glass backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl opacity-70">💬</span>
                  <span className="text-white font-semibold">名人名言</span>
                </div>
                <button
                  onClick={() => getRandomQuote(quoteIndex)}
                  className="btn btn-icon text-sm"
                  aria-label="刷新名人名言"
                  title="换一条"
                >
                  🔄
                </button>
              </div>

              {currentQuote && (
                <div className="text-center">
                  <p className="text-xl font-medium mb-2 bg-gradient-to-r from-white via-pink-100 to-purple-200 bg-clip-text text-transparent">
                    {currentQuote.line1}
                  </p>
                  {currentQuote.line2 && (
                    <p className="text-lg text-white/80 mb-4">
                      {currentQuote.line2}
                    </p>
                  )}
                  {currentQuote.author && (
                    <p className="text-sm text-white/50 italic">
                      —— {currentQuote.author}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 功能特性 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="glass backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3 text-white">快速访问</h3>
              <p className="text-white/70">
                一键跳转到各平台余额页面，无需反复搜索和登录
              </p>
            </div>

            <div className="glass backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold mb-3 text-white">自定义配置</h3>
              <p className="text-white/70">
                自由添加、编辑平台链接，支持批量操作和配置导入导出
              </p>
            </div>

            <div className="glass backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">🌙</div>
              <h3 className="text-xl font-semibold mb-3 text-white">深色模式</h3>
              <p className="text-white/70">
                支持浅色/深色主题切换，护眼设计，夜间使用更舒适
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="py-8 px-6 text-center text-white/50 text-sm">
        <p>AI平台余额快捷入口 © 2026 | 数据安全存储于本地</p>
      </footer>
    </div>
  );
};

export default LandingPage;
