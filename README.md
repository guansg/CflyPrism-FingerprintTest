# CflyPrism Fingerprint Test

<p align="center">
  <strong>浏览器指纹检测与验证工具</strong>
</p>

<p align="center">
  一款专业的浏览器指纹检测工具，帮助用户了解和验证浏览器指纹配置，检测隐私泄露风险。
</p>

<p align="center">
  <a href="https://finger.cflyp.com"><strong>🌐 在线体验 »</strong></a>
</p>

<p align="center">
  <a href="#功能特性">功能特性</a> •
  <a href="#检测项目">检测项目</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#技术栈">技术栈</a> •
  <a href="#部署">部署</a>
</p>

---

## 功能特性

- **全面检测** - 支持 17+ 种浏览器指纹检测项，覆盖硬件、软件、网络等多个维度
- **一致性检查** - 自动检测 User-Agent 与 UA Data 的一致性，发现配置异常
- **历史记录** - 本地存储检测记录，随时回顾查看
- **指纹对比** - 对比不同时间或配置的指纹差异，精准定位变化项
- **数据导出** - 支持 JSON / CSV 格式导出，便于分析和存档
- **多语言支持** - 支持中文、English、日本語、Español
- **SEO 优化** - 多语言 URL 路由，良好的搜索引擎支持

## 检测项目

| 分类 | 检测项 | 说明 |
|------|--------|------|
| **基础指纹** | Navigator | 浏览器信息、User-Agent、平台等 |
| | Screen | 屏幕分辨率、色深、像素比 |
| | Viewport | 视口尺寸、滚动条信息 |
| | Timezone | 时区信息 |
| | UI Language | 浏览器界面语言 |
| **硬件信息** | Canvas | Canvas 2D 指纹 |
| | WebGL | WebGL 渲染器、厂商、参数 |
| | WebGPU | WebGPU 适配器信息 |
| | Audio | AudioContext 指纹 |
| | Fonts | 已安装字体检测 |
| | CPU/Memory | 处理器核心数、内存信息 |
| **网络层** | WebRTC | WebRTC 本地 IP 泄露检测 |
| | Media Devices | 摄像头、麦克风设备信息 |
| | Geolocation | 地理位置信息 |
| **反检测** | Automation | 自动化工具检测（Selenium、Puppeteer 等） |
| | Permissions | 浏览器权限状态 |
| | ClientRects | DOM 元素尺寸计算差异 |
| | Speech Voices | 语音合成引擎列表 |

## 指纹对比功能

对比功能是本工具的核心特性之一，帮助用户精准识别指纹变化。

### 使用场景

- **验证指纹伪装效果** - 修改浏览器指纹配置后，对比前后差异，确认修改是否生效
- **检测指纹泄露** - 对比不同时间点的指纹，发现意外的指纹变化
- **调试反指纹方案** - 快速定位哪些指纹项未被正确覆盖

### 功能说明

1. **自动对比** - 系统自动将本次检测结果与上一次检测进行对比
2. **差异高亮** - 变化的项目会以不同颜色标识：
   - 🟡 **已变更** - 属性值发生变化
   - 🟢 **新增** - 新检测到的属性
   - 🔴 **已移除** - 不再存在的属性
3. **筛选模式** - 可切换「仅差异」或「全部」视图，快速聚焦变化项
4. **详细展示** - 并排展示「上次」与「本次」的具体值，一目了然

### 使用方法

1. 首先进行一次指纹检测作为基准
2. 修改浏览器配置或切换指纹配置
3. 再次进行检测
4. 点击「对比」按钮查看差异报告

## 快速开始

### 环境要求

- Node.js >= 18
- npm / yarn / pnpm

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

构建产物位于 `dist/` 目录。

### 预览生产版本

```bash
npm run preview
```

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **路由**: React Router v6
- **国际化**: react-i18next
- **图标**: Lucide React

## 部署

支持部署到任意静态托管服务：

- **Vercel** - 推荐，零配置部署
- **Netlify** - 支持自动部署
- **GitHub Pages** - 需配置 base path
- **Cloudflare Pages** - 全球 CDN 加速

### 环境变量

复制 `.env.example` 为 `.env` 并配置：

```bash
# 后端 API 地址（可选）
VITE_API_BASE_URL=
```

## 许可证

[MIT License](LICENSE)

---

<p align="center">
  Made with ❤️ by CflyPrism Team
</p>
