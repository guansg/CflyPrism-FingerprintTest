# CflyPrism Fingerprint Test

**English** | [中文](README.zh-CN.md)

<p align="center">
  Built by the team behind <a href="https://cflyp.com"><strong>CflyPrism Fingerprint Browser</strong></a>
</p>

<p align="center">
  <strong>Browser Fingerprint Detection & Verification Tool</strong>
</p>

<p align="center">
  A professional browser fingerprint detection tool to help users understand and verify browser fingerprint configurations and detect privacy leakage risks.
</p>

<p align="center">
  <a href="https://finger.cflyp.com"><strong>🌐 Live Demo »</strong></a>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#detection-items">Detection Items</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## Features

- **Comprehensive Detection** - Supports 17+ browser fingerprint detection items covering hardware, software, network, and more
- **Consistency Check** - Automatically detects User-Agent and UA Data consistency to identify configuration anomalies
- **History Records** - Local storage of detection records for easy review
- **Fingerprint Comparison** - Compare fingerprint differences across time or configurations to pinpoint changes
- **Data Export** - Export in JSON / CSV formats for analysis and archiving
- **Multi-language Support** - Supports Chinese, English, Japanese, Spanish

## Detection Items

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

## Fingerprint Comparison

The comparison feature is one of the core features of this tool, helping users accurately identify fingerprint changes.

### Use Cases

- **Verify Fingerprint Spoofing** - After modifying browser fingerprint settings, compare before and after to confirm changes
- **Detect Fingerprint Leaks** - Compare fingerprints at different times to discover unexpected changes
- **Debug Anti-Fingerprint Solutions** - Quickly locate which fingerprint items are not properly covered

### How It Works

1. **Auto Compare** - Automatically compares current detection results with the previous one
2. **Difference Highlighting** - Changed items are marked with different colors:
   - 🟡 **Changed** - Value has changed
   - 🟢 **Added** - Newly detected property
   - 🔴 **Removed** - Property no longer exists
3. **Filter Mode** - Switch between "Changes Only" or "All" views
4. **Detailed Display** - Side-by-side display of "Previous" and "Current" values

### Usage

1. Perform a fingerprint detection as baseline
2. Modify browser configuration or switch fingerprint profile
3. Run detection again
4. Click "Compare" button to view the difference report

## Getting Started

### Requirements

- Node.js >= 18
- npm / yarn / pnpm

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **i18n**: react-i18next
- **Icons**: Lucide React

## Deployment

Supports deployment to any static hosting service:

- **Vercel** - Recommended, zero-config deployment
- **Netlify** - Auto deployment support
- **GitHub Pages** - Requires base path configuration
- **Cloudflare Pages** - Global CDN acceleration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Backend API URL (optional)
VITE_API_BASE_URL=
```

## License

[MIT License](LICENSE)

---

<p align="center">
  Made with ❤️ by CflyPrism Team
</p>
