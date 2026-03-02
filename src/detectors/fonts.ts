import type { FontsFingerprint } from '@/types/fingerprint';

// 测试字符串 - 使用宽度变化明显的字符
const testString = 'mmMwWLliI0O&1';
// 测试字体大小
const textSize = '48px';
// 基础字体
const baseFonts = ['monospace', 'sans-serif', 'serif'] as const;

// 扩展的字体列表 - 合并自 FingerprintJS、CreepJS 等多个检测库
const fontList = [
  // ==================== Android 字体 ====================
  'sans-serif-thin',
  'Dancing Script',
  'Droid Sans Mono',
  'Roboto',

  // ==================== FingerprintJS 原始字体列表 ====================
  'ARNO PRO',
  'Agency FB',
  'Arabic Typesetting',
  'Arial Unicode MS',
  'AvantGarde Bk BT',
  'BankGothic Md BT',
  'Batang',
  'Bitstream Vera Sans Mono',
  'Calibri',
  'Century',
  'Century Gothic',
  'Clarendon',
  'EUROSTILE',
  'Franklin Gothic',
  'Futura Bk BT',
  'Futura Md BT',
  'GOTHAM',
  'Gill Sans',
  'HELV',
  'Haettenschweiler',
  'Helvetica Neue',
  'Humanst521 BT',
  'Leelawadee',
  'Letter Gothic',
  'Levenim MT',
  'Lucida Bright',
  'Lucida Sans',
  'Menlo',
  'MS Mincho',
  'MS Outlook',
  'MS Reference Specialty',
  'MS UI Gothic',
  'MT Extra',
  'MYRIAD PRO',
  'Marlett',
  'Meiryo UI',
  'Microsoft Uighur',
  'Minion Pro',
  'Monotype Corsiva',
  'PMingLiU',
  'Pristina',
  'SCRIPTINA',
  'Segoe UI Light',
  'Serifa',
  'SimHei',
  'Small Fonts',
  'Staccato222 BT',
  'TRAJAN PRO',
  'Univers CE 55 Medium',
  'Vrinda',
  'ZWAdobeF',

  // ==================== 常见基础字体 ====================
  'Arial',
  'Arial Black',
  'Comic Sans MS',
  'Courier New',
  'Georgia',
  'Impact',
  'Tahoma',
  'Times New Roman',
  'Trebuchet MS',
  'Verdana',

  // ==================== CreepJS - Windows 版本特征字体 ====================
  // Windows 7+
  'Cambria Math',
  'Lucida Console',
  // Windows 8+
  'Aldhabi',
  'Gadugi',
  'Myanmar Text',
  'Nirmala UI',
  // Windows 8.1+
  'Leelawadee UI',
  'Javanese Text',
  'Segoe UI Emoji',
  // Windows 10+
  'HoloLens MDL2 Assets',
  'Segoe MDL2 Assets',
  'Bahnschrift',
  'Ink Free',
  // Windows 11+
  'Segoe Fluent Icons',

  // ==================== CreepJS - macOS 版本特征字体 ====================
  // macOS 10.9 (Mavericks)+
  'Geneva',
  // macOS 10.10 (Yosemite)+
  'Kohinoor Devanagari Medium',
  'Luminari',
  // macOS 10.11 (El Capitan)+
  'PingFang HK Light',
  // macOS 10.12 (Sierra)+
  'American Typewriter Semibold',
  'Futura Bold',
  'SignPainter-HouseScript Semibold',
  // macOS 10.13-10.14 (High Sierra/Mojave)+
  'InaiMathi Bold',
  // macOS 10.15-11 (Catalina/Big Sur)+
  'Galvji',
  'MuktaMahee Regular',
  // macOS 12 (Monterey)+
  'Noto Sans Gunjala Gondi Regular',
  'Noto Sans Masaram Gondi Regular',
  'Noto Serif Yezidi Regular',
  // macOS 13 (Ventura)+
  'Apple SD Gothic Neo ExtraBold',
  'STIX Two Math Regular',
  'STIX Two Text Regular',
  'Noto Sans Canadian Aboriginal Regular',

  // ==================== CreepJS - Linux 字体 ====================
  'Arimo',
  'Chilanka',
  'Cousine',
  'Jomolhari',
  'MONO',
  'Noto Color Emoji',
  'Ubuntu',

  // ==================== CreepJS - 桌面应用特征字体 ====================
  // LibreOffice
  'Amiri',
  'KACSTOffice',
  'Liberation Mono',
  'Source Code Pro',
  // OpenOffice
  'DejaVu Sans',
  'Gentium Book Basic',
  'OpenSymbol',

  // ==================== CreepJS - Gecko 引擎系统字体 ====================
  'Segoe UI',
  'Yu Gothic UI',
  'Microsoft JhengHei UI',
  'Microsoft YaHei UI',
  'Cantarell',
  'Fira Sans',

  // ==================== 额外的 Windows 常见字体 ====================
  'Cambria',
  'Candara',
  'Consolas',
  'Constantia',
  'Corbel',
  'Ebrima',
  'Franklin Gothic Medium',
  'Gabriola',
  'Lucida Sans Unicode',
  'Malgun Gothic',
  'Microsoft Sans Serif',
  'MS Gothic',
  'MS PGothic',
  'MS Reference Sans Serif',
  'Palatino Linotype',
  'Segoe Print',
  'Segoe Script',
  'Segoe UI',
  'Segoe UI Symbol',
  'Sitka Text',
  'Sylfaen',
  'Symbol',
  'Webdings',
  'Wingdings',
  'Wingdings 2',
  'Wingdings 3',

  // ==================== 额外的 macOS 常见字体 ====================
  'Al Bayan',
  'Al Nile',
  'American Typewriter',
  'Andale Mono',
  'Apple Braille',
  'Apple Chancery',
  'Apple Color Emoji',
  'Apple SD Gothic Neo',
  'AppleGothic',
  'AppleMyungjo',
  'Avenir',
  'Avenir Next',
  'Avenir Next Condensed',
  'Baskerville',
  'Big Caslon',
  'Bodoni 72',
  'Bradley Hand',
  'Brush Script MT',
  'Chalkboard',
  'Chalkboard SE',
  'Chalkduster',
  'Charter',
  'Cochin',
  'Copperplate',
  'Corsiva Hebrew',
  'Courier',
  'Damascus',
  'DecoType Naskh',
  'Devanagari MT',
  'Didot',
  'DIN Alternate',
  'DIN Condensed',
  'Euphemia UCAS',
  'Futura',
  'Geeza Pro',
  'Gill Sans',
  'Gujarati MT',
  'Gurmukhi MN',
  'Heiti SC',
  'Heiti TC',
  'Helvetica',
  'Herculanum',
  'Hiragino Kaku Gothic ProN',
  'Hiragino Maru Gothic ProN',
  'Hiragino Mincho ProN',
  'Hiragino Sans',
  'Hoefler Text',
  'Kailasa',
  'Kannada MN',
  'Kefa',
  'Khmer MN',
  'Kokonor',
  'Lao MN',
  'Lucida Grande',
  'Malayalam MN',
  'Marion',
  'Marker Felt',
  'Monaco',
  'Noteworthy',
  'Optima',
  'Oriya MN',
  'Palatino',
  'Papyrus',
  'Phosphate',
  'PingFang HK',
  'PingFang SC',
  'PingFang TC',
  'Plantagenet Cherokee',
  'Rockwell',
  'Savoye LET',
  'Sinhala MN',
  'Skia',
  'Snell Roundhand',
  'Songti SC',
  'Songti TC',
  'STSong',
  'Sukhumvit Set',
  'Tamil MN',
  'Telugu MN',
  'Thonburi',
  'Trattatello',
  'Zapfino',

  // ==================== 额外的 Linux 常见字体 ====================
  'DejaVu Sans Mono',
  'DejaVu Serif',
  'Droid Sans',
  'Droid Serif',
  'FreeMono',
  'FreeSans',
  'FreeSerif',
  'Liberation Sans',
  'Liberation Serif',
  'Noto Sans',
  'Noto Serif',
  'Noto Mono',
  'Ubuntu Mono',

  // ==================== 中文字体 ====================
  'SimSun',
  'Microsoft YaHei',
  'KaiTi',
  'FangSong',
  'NSimSun',
  'STXihei',
  'STKaiti',
  'STSong',
  'STFangsong',
  'LiSu',
  'YouYuan',
  'STZhongsong',
  'STHupo',
  'STXinwei',
  'STLiti',
  'STCaiyun',
  'FZShuTi',
  'FZYaoTi',
  'DengXian',
  'Microsoft JhengHei',
  'MingLiU',
  'MingLiU_HKSCS',
  'BiauKai',

  // ==================== 日文字体 ====================
  'Meiryo',
  'Yu Gothic',
  'Yu Mincho',
  'MS PMincho',
  'HGGothicE',
  'HGPGothicE',
  'HGMinchoE',
  'HGPMinchoE',
  'Hiragino Kaku Gothic Pro',
  'Hiragino Mincho Pro',

  // ==================== 韩文字体 ====================
  'Gulim',
  'Dotum',
  'Batang',
  'Gungsuh',
  'GulimChe',
  'DotumChe',
  'BatangChe',
  'GungsuhChe',

  // ==================== 常见 Web/设计字体 ====================
  'Book Antiqua',
  'Bookman Old Style',
  'Century Schoolbook',
  'Garamond',
  'Lucida Handwriting',
  'MS Serif',
  'Niagara Engraved',
  'Niagara Solid',
  'OCR A Extended',
  'Old English Text MT',
  'Onyx',
  'Palace Script MT',
  'Perpetua',
  'Ravie',
  'Rockwell Extra Bold',
  'Script MT Bold',
  'Showcard Gothic',
  'Snap ITC',
  'Tw Cen MT',
  'Viner Hand ITC',
  'Vivaldi',
  'Vladimir Script',
  'Wide Latin',
] as const;

/**
 * 字体检测
 * 基于 FingerprintJS 实现，使用 iframe 隔离测试环境
 */
export async function detectFonts(): Promise<FontsFingerprint> {
  return new Promise((resolve) => {
    // 创建 iframe 隔离测试环境
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:absolute;left:-9999px;visibility:hidden;';

    iframe.onload = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) {
          resolve(detectFontsFallback());
          return;
        }

        const holder = iframeDoc.body;
        holder.style.fontSize = textSize;

        // 创建容器
        const spansContainer = iframeDoc.createElement('div');
        spansContainer.style.setProperty('visibility', 'hidden', 'important');

        const defaultWidth: Record<string, number> = {};
        const defaultHeight: Record<string, number> = {};

        // 创建基础字体 span
        const createSpan = (fontFamily: string): HTMLSpanElement => {
          const span = iframeDoc.createElement('span');
          span.style.position = 'absolute';
          span.style.top = '0';
          span.style.left = '0';
          span.style.fontFamily = fontFamily;
          span.textContent = testString;
          spansContainer.appendChild(span);
          return span;
        };

        // 创建带测试字体的 span
        const createSpanWithFonts = (fontToDetect: string, baseFont: string): HTMLSpanElement => {
          return createSpan(`'${fontToDetect}',${baseFont}`);
        };

        // 创建基础字体 spans
        const baseFontsSpans = baseFonts.map(createSpan);

        // 创建测试字体 spans
        const fontsSpans: Record<string, HTMLSpanElement[]> = {};
        for (const font of fontList) {
          fontsSpans[font] = baseFonts.map((baseFont) => createSpanWithFonts(font, baseFont));
        }

        // 添加到 DOM
        holder.appendChild(spansContainer);

        // 获取基础字体的默认尺寸
        for (let i = 0; i < baseFonts.length; i++) {
          defaultWidth[baseFonts[i]] = baseFontsSpans[i].offsetWidth;
          defaultHeight[baseFonts[i]] = baseFontsSpans[i].offsetHeight;
        }

        // 检测可用字体
        const detectedFonts: string[] = [];
        for (const font of fontList) {
          const fontSpans = fontsSpans[font];
          // 如果任一基础字体的尺寸不同，则字体可用
          const isAvailable = baseFonts.some((baseFont, index) =>
            fontSpans[index].offsetWidth !== defaultWidth[baseFont] ||
            fontSpans[index].offsetHeight !== defaultHeight[baseFont]
          );
          if (isAvailable) {
            detectedFonts.push(font);
          }
        }

        // 清理
        document.body.removeChild(iframe);

        resolve({
          fonts: detectedFonts,
          count: detectedFonts.length,
        });
      } catch (e) {
        console.warn('Font detection failed:', e);
        document.body.removeChild(iframe);
        resolve(detectFontsFallback());
      }
    };

    iframe.onerror = () => {
      document.body.removeChild(iframe);
      resolve(detectFontsFallback());
    };

    // 添加 iframe
    document.body.appendChild(iframe);

    // 超时处理
    setTimeout(() => {
      if (iframe.parentNode) {
        document.body.removeChild(iframe);
        resolve(detectFontsFallback());
      }
    }, 5000);
  });
}

/**
 * 降级方案 - 在主文档中检测
 */
function detectFontsFallback(): FontsFingerprint {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return { fonts: [], count: 0 };
  }

  const baseWidths: Record<string, number> = {};
  const baseHeights: Record<string, number> = {};

  // 获取基础字体的宽度
  for (const baseFont of baseFonts) {
    ctx.font = `${textSize} ${baseFont}`;
    const metrics = ctx.measureText(testString);
    baseWidths[baseFont] = metrics.width;
    // Canvas 2D 没有直接的高度，使用近似值
    baseHeights[baseFont] = parseInt(textSize) * 1.2;
  }

  const detectedFonts: string[] = [];

  // 检测每个字体
  for (const font of fontList) {
    let detected = false;
    for (const baseFont of baseFonts) {
      ctx.font = `${textSize} '${font}', ${baseFont}`;
      const width = ctx.measureText(testString).width;

      if (Math.abs(width - baseWidths[baseFont]) > 0.1) {
        detected = true;
        break;
      }
    }

    if (detected) {
      detectedFonts.push(font);
    }
  }

  return {
    fonts: detectedFonts,
    count: detectedFonts.length,
  };
}
