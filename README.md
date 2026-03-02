# CflyPrism Fingerprint Test

<p align="center">
  Built by the team behind <a href="https://cflyp.com"><strong>CflyPrism Fingerprint Browser</strong></a>
</p>

<p align="center">
  <a href="#english">English</a> | <a href="#中文">中文</a>
</p>

<p align="center">
  <a href="https://finger.cflyp.com"><strong>🌐 Live Demo / 在线体验 »</strong></a>
  &nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="https://github.com/guansg/CflyPrism-FingerprintTest/discussions"><strong>💬 Discussions / 讨论区</strong></a>
</p>

---

## English

### Features

- **Comprehensive Detection** - Supports 17+ browser fingerprint detection items covering hardware, software, network, and more
- **Consistency Check** - Automatically detects User-Agent and UA Data consistency to identify configuration anomalies
- **History Records** - Local storage of detection records for easy review
- **Fingerprint Comparison** - Compare fingerprint differences across time or configurations to pinpoint changes
- **Data Export** - Export in JSON / CSV formats for analysis and archiving
- **Multi-language Support** - Supports Chinese, English, Japanese, Spanish

### Detection Items

| Category | Item | Description |
|----------|------|-------------|
| **Basic** | Navigator | Browser info, User-Agent, platform, etc. |
| | Screen | Resolution, color depth, pixel ratio |
| | Viewport | Viewport size, scrollbar info |
| | Timezone | Timezone information |
| | UI Language | Browser interface language |
| **Hardware** | Canvas | Canvas 2D fingerprint |
| | WebGL | WebGL renderer, vendor, parameters |
| | WebGPU | WebGPU adapter information |
| | Audio | AudioContext fingerprint |
| | Fonts | Installed fonts detection |
| | CPU/Memory | Processor cores, memory info |
| **Network** | WebRTC | WebRTC local IP leak detection |
| | Media Devices | Camera, microphone device info |
| | Geolocation | Geographic location |
| **Anti-Detection** | Automation | Automation tool detection (Selenium, Puppeteer, etc.) |
| | Permissions | Browser permission status |
| | ClientRects | DOM element size calculation differences |
| | Speech Voices | Speech synthesis engine list |

### Fingerprint Comparison

The comparison feature is one of the core features of this tool, helping users accurately identify fingerprint changes.

#### Use Cases

- **Verify Fingerprint Spoofing** - After modifying browser fingerprint settings, compare before and after to confirm changes
- **Detect Fingerprint Leaks** - Compare fingerprints at different times to discover unexpected changes
- **Debug Anti-Fingerprint Solutions** - Quickly locate which fingerprint items are not properly covered

#### How It Works

1. **Auto Compare** - Automatically compares current detection results with the previous one
2. **Difference Highlighting** - Changed items are marked with different colors:
   - 🟡 **Changed** - Value has changed
   - 🟢 **Added** - Newly detected property
   - 🔴 **Removed** - Property no longer exists
3. **Filter Mode** - Switch between "Changes Only" or "All" views
4. **Detailed Display** - Side-by-side display of "Previous" and "Current" values

#### Usage

1. Perform a fingerprint detection as baseline
2. Modify browser configuration or switch fingerprint profile
3. Run detection again
4. Click "Compare" button to view the difference report

### License

[MIT License](LICENSE)

---

## 中文

<p align="center">
  由 <a href="https://cflyp.com"><strong>飞凌指纹浏览器</strong></a> 团队构建
</p>

### 功能特性

- **全面检测** - 支持 17+ 种浏览器指纹检测项，覆盖硬件、软件、网络等多个维度
- **一致性检查** - 自动检测 User-Agent 与 UA Data 的一致性，发现配置异常
- **历史记录** - 本地存储检测记录，随时回顾查看
- **指纹对比** - 对比不同时间或配置的指纹差异，精准定位变化项
- **数据导出** - 支持 JSON / CSV 格式导出，便于分析和存档
- **多语言支持** - 支持中文、English、日本語、Español

### 检测项目

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

### 指纹对比功能

对比功能是本工具的核心特性之一，帮助用户精准识别指纹变化。

#### 使用场景

- **验证指纹伪装效果** - 修改浏览器指纹配置后，对比前后差异，确认修改是否生效
- **检测指纹泄露** - 对比不同时间点的指纹，发现意外的指纹变化
- **调试反指纹方案** - 快速定位哪些指纹项未被正确覆盖

#### 功能说明

1. **自动对比** - 系统自动将本次检测结果与上一次检测进行对比
2. **差异高亮** - 变化的项目会以不同颜色标识：
   - 🟡 **已变更** - 属性值发生变化
   - 🟢 **新增** - 新检测到的属性
   - 🔴 **已移除** - 不再存在的属性
3. **筛选模式** - 可切换「仅差异」或「全部」视图，快速聚焦变化项
4. **详细展示** - 并排展示「上次」与「本次」的具体值，一目了然

#### 使用方法

1. 首先进行一次指纹检测作为基准
2. 修改浏览器配置或切换指纹配置
3. 再次进行检测
4. 点击「对比」按钮查看差异报告

### 许可证

[MIT License](LICENSE)

---

<p align="center">
  Made with ❤️ by CflyPrism Team
</p>
