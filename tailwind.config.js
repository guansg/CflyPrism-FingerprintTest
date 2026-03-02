/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 淡绿色复古色系 - Vintage Green 风格
        primary: {
          50: '#f0f7f4',   // 极浅薄荷绿 - 背景
          100: '#e0efe8',  // 浅薄荷绿 - 卡片背景
          200: '#c4dfd1',  // 淡绿色 - 边框/分割线
          300: '#9bc4b0',  // 浅绿色 - 边框
          400: '#6fa088',  // 中绿色 - 辅助文字
          500: '#4a8c6f',  // 复古绿 - 强调
          600: '#367055',  // Vintage Green - 主色（按钮等）
          700: '#2b5a45',  // 深绿色 - 悬停状态
          800: '#1f4333',  // 更深绿色 - 主文字
          900: '#142c22',  // 极深绿色 - 标题/深色模式
        },
        // 覆盖 blue 色系为复古淡绿色（与 primary 一致）
        blue: {
          50: '#f0f7f4',
          100: '#e0efe8',
          200: '#c4dfd1',
          300: '#9bc4b0',
          400: '#6fa088',
          500: '#4a8c6f',
          600: '#367055',
          700: '#2b5a45',
          800: '#1f4333',
          900: '#142c22',
        },
        // 覆盖 green 色系为复古淡绿色（与 primary 一致）
        green: {
          50: '#f0f7f4',
          100: '#e0efe8',
          200: '#c4dfd1',
          300: '#9bc4b0',
          400: '#6fa088',
          500: '#4a8c6f',
          600: '#367055',  // Vintage Green - 主色
          700: '#2b5a45',
          800: '#1f4333',
          900: '#142c22',
        },
        // 覆盖 gray 色系为淡绿色复古背景（温暖米色+淡绿调）
        gray: {
          50: '#faf9f6',   // 象牙白 - 主背景
          100: '#f5f5dc',  // 奶油白 - 卡片背景
          200: '#e8e8d8',  // 浅灰绿 - 边框/分割线
          300: '#d4d4c4',  // 灰绿色 - 边框
          400: '#a8b8a8',  // 中灰绿 - 禁用/辅助文字
          500: '#7d957d',  // 橄榄灰绿 - 强调
          600: '#5a725a',  // 深橄榄绿 - 悬停状态
          700: '#3c4a3c',  // 更深灰绿 - 主文字
          800: '#2a332a',  // 深色 - 标题
          900: '#1a1f1a',  // 极深色 - 深色模式文字
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
