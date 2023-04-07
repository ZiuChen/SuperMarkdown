import gfm from '@bytemd/plugin-gfm'
import breaks from '@bytemd/plugin-breaks'
import frontmatter from '@bytemd/plugin-frontmatter'
import highlight from '@bytemd/plugin-highlight'
import math from '@bytemd/plugin-math'
import mermaid from '@bytemd/plugin-mermaid'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import gemoji from '@bytemd/plugin-gemoji'

import {
  alignPlugin,
  imageZoomPlugin,
  themePlugin,
  highlightThemePlugin,
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
  alignPlugin(),
  imageZoomPlugin(),
  math({
    locale: zhHansMath
  }),
  mermaid({
    locale: zhHansMerimaid
  }),
  themePlugin(),
  highlightThemePlugin(),
  enhancePlugin(),
  customImagePlugin(),
  exportPlugin(),
  pasteImagePlugin()
]
