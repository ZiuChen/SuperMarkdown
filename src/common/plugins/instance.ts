import gfm from '@bytemd/plugin-gfm'
import breaks from '@bytemd/plugin-breaks'
import frontmatter from '@bytemd/plugin-frontmatter'
import highlight from '@bytemd/plugin-highlight'
import math from '@bytemd/plugin-math'
import mermaid from '@bytemd/plugin-mermaid'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import gemoji from '@bytemd/plugin-gemoji'
import imageZoom from '@ziuchen/bytemd-plugin-image-zoom'
import align from '@ziuchen/bytemd-plugin-align'
import highlightTheme from '@ziuchen/bytemd-plugin-highlight-theme'
import markdownTheme from '@ziuchen/bytemd-plugin-markdown-theme'
import highlights from '@ziuchen/bytemd-plugin-highlight-theme/dist/highlights.json'
import themes from '@ziuchen/bytemd-plugin-markdown-theme/dist/themes.json'
import {
  enhancePlugin,
  customImagePlugin,
  imageUploadPlugin,
  screenShotPlugin,
  exportPlugin,
  pasteImagePlugin
} from '@/common/plugins'
import zhHansGfm from '@bytemd/plugin-gfm/locales/zh_Hans.json'
import zhHansMath from '@bytemd/plugin-math/locales/zh_Hans.json'
import zhHansMerimaid from '@bytemd/plugin-mermaid/locales/zh_Hans.json'
import zhHansImageZoom from '@ziuchen/bytemd-plugin-image-zoom/locales/zh_Hans.json'
import zhHansAlign from '@ziuchen/bytemd-plugin-align/locales/zh_Hans.json'
import zhHansHighlightTheme from '@ziuchen/bytemd-plugin-highlight-theme/locales/zh_Hans.json'
import zhHansMarkdownTheme from '@ziuchen/bytemd-plugin-markdown-theme/locales/zh_Hans.json'

export const plugins = [
  imageUploadPlugin(),
  screenShotPlugin(),
  gfm({
    locale: zhHansGfm
  }),
  gemoji(),
  breaks(),
  frontmatter(),
  highlight(),
  mediumZoom(),
  align({
    locale: zhHansAlign
  }),
  imageZoom({
    locale: zhHansImageZoom
  }),
  math({
    locale: zhHansMath
  }),
  mermaid({
    locale: zhHansMerimaid
  }),
  markdownTheme({
    locale: zhHansMarkdownTheme,
    themes,
    defaultTheme: 'juejin'
  }),
  highlightTheme({
    locale: zhHansHighlightTheme,
    highlights,
    defaultHighlight: 'atom-one-dark'
  }),
  enhancePlugin(),
  customImagePlugin(),
  exportPlugin(),
  pasteImagePlugin()
]

// 保存图片DOM节点 包含当前文档图片的hash索引合集
export const markdownImages = [] as any[]

// 缓存图片数据 hash => base64
export const imageCache = {} as Record<string, string>
