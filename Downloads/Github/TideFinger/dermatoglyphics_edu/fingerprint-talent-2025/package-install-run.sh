#!/bin/bash

# 2025年最火Indie Hacker技术栈安装脚本
echo "🚀 开始安装天赋指纹2025版本..."

# 检查Node.js版本
node_version=$(node -v 2>/dev/null | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ -z "$node_version" ] || [ "$node_version" -lt 18 ]; then
    echo "❌ 请先安装 Node.js 18+ 版本"
    echo "🔗 下载地址: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本检查通过: $(node -v)"

# 安装依赖
echo "📦 正在安装依赖包..."
npm install

# 检查关键依赖
echo "🔍 验证关键依赖..."
deps=("nuxt" "quasar" "@tresjs/core" "three" "pinia")
for dep in "${deps[@]}"; do
    if npm list "$dep" >/dev/null 2>&1; then
        echo "✅ $dep 安装成功"
    else
        echo "❌ $dep 安装失败"
        exit 1
    fi
done

# 创建必要的目录和文件
echo "📁 创建项目结构..."
mkdir -p {public/icons,assets/css,composables,middleware,server/api}

# 生成基础配置文件
if [ ! -f ".env" ]; then
    echo "⚙️ 生成环境配置文件..."
    cat > .env << EOL
# 应用配置
NUXT_PUBLIC_API_BASE=http://localhost:8000
NUXT_PUBLIC_APP_NAME=天赋指纹
NUXT_PUBLIC_APP_DOMAIN=talent.example.com

# 数据库配置 (DuckDB)
DATABASE_URL=fingerprint_talent.db

# 认证密钥
JWT_SECRET=$(openssl rand -hex 32)
SESSION_SECRET=$(openssl rand -hex 32)

# 支付配置 (开发环境)
STRIPE_PUBLIC_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here

# 第三方服务
OPENAI_API_KEY=your_openai_key_here
UPYUN_BUCKET=your_bucket_name
UPYUN_OPERATOR=your_operator
UPYUN_PASSWORD=your_password
EOL
    echo "✅ 环境配置文件已生成"
fi

# 生成PWA图标
echo "🎨 生成PWA图标..."
mkdir -p public/icons

# 创建简单的SVG图标（实际项目中应使用设计工具生成）
cat > public/favicon.ico << 'EOL'
# 这里应该是实际的favicon.ico文件内容
EOL

# 创建基础CSS文件
echo "🎨 创建全局样式..."
cat > assets/css/main.css << 'EOL'
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  height: 100%;
  line-height: 1.6;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.8);
}

/* 动画优化 */
* {
  transition: all 0.2s ease;
}

/* 无障碍优化 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  html {
    color-scheme: dark;
  }
}
EOL

# 运行开发服务器
echo "🌟 启动开发服务器..."
echo ""
echo "=== 🎉 安装完成! ==="
echo ""
echo "📋 项目信息:"
echo "  • 名称: 天赋指纹2025版"
echo "  • 技术栈: Nuxt 3 + Quasar + TresJS + DuckDB"
echo "  • 端口: http://localhost:3000"
echo ""
echo "🚀 启动命令:"
echo "  npm run dev     # 开发模式"
echo "  npm run build   # 生产构建"
echo "  npm run preview # 预览构建结果"
echo ""
echo "📚 重要链接:"
echo "  • Nuxt 3 文档: https://nuxt.com"
echo "  • Quasar 文档: https://quasar.dev"
echo "  • TresJS 文档: https://tresjs.org"
echo ""

# 检查后端API连接
echo "🔌 检查后端API连接..."
if curl -s http://localhost:8000/health >/dev/null 2>&1; then
    echo "✅ 后端API已连接"
else
    echo "⚠️  后端API未启动，请确保FastAPI服务运行在 http://localhost:8000"
    echo "💡 提示: 在 dermatoglyphics_edu 目录下运行: python main.py"
fi

echo ""
echo "🎯 立即体验:"
echo "  1. npm run dev"
echo "  2. 打开 http://localhost:3000"
echo "  3. 体验3D人格雷达图!"
echo ""

# 启动开发服务器
if [ "$1" = "--start" ]; then
    npm run dev
fi
