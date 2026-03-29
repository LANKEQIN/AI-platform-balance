import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero区域 */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
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
          <div className="mb-16">
            <button
              onClick={onStart}
              className="btn btn-primary text-lg px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              🚀 立即开始
            </button>
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
