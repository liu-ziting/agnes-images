export const API_URL = 'https://agnes-api.lz-t.top';
export const TEXT_MODEL = 'agnes-2.0-flash';
export const IMAGE_MODEL = 'agnes-image-2.1-flash';
export const MAX_HISTORY_ITEMS = 24;

export const sizeOptions = [
  { value: '1024x1024', label: '1024x1024 (Square 1:1)' },
  { value: '1024x768', label: '1024x768 (Landscape 4:3)' },
  { value: '768x1024', label: '768x1024 (Portrait 3:4)' },
  { value: '1280x720', label: '1280x720 (Wide 16:9)' },
  { value: '720x1280', label: '720x1280 (Vertical 9:16)' }
] as const;

export const modifyPresets = [
  {
    en: 'Replace the background with a premium studio environment and improve overall lighting',
    zh: '将背景替换为高级影棚环境，并整体提升光线质感'
  },
  {
    en: 'Turn this into a cinematic night scene with dramatic contrast and atmospheric glow',
    zh: '改造成电影感夜景，增强戏剧性反差与氛围光晕'
  },
  {
    en: 'Refine the subject details and make the materials look more realistic and premium',
    zh: '细化主体细节，让材质表现更真实、更高级'
  },
  {
    en: 'Transform the image into a clean editorial poster style while preserving the subject',
    zh: '在保留主体的前提下，改成干净利落的编辑海报风格'
  },
  {
    en: 'Remove distracting elements and simplify the composition for a stronger focal point',
    zh: '移除干扰元素，简化构图，让视觉焦点更集中'
  }
] as const;
