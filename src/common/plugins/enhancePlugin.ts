import type { BytemdPlugin } from 'bytemd'
import { useEventBus } from '@/hooks/useEventBus'
import { SWITCH_FILE, FOCUS_EDITOR } from '@/common/symbol'
import { visit } from 'unist-util-visit'
import { isElectron } from '@/utils'

/**
 * 增强插件
 */
export function enhancePlugin(): BytemdPlugin {
  return {
    rehype(processor) {
      // @ts-ignore
      return processor.use(() => (tree, file) => {
        // 为所有的a标签添加target="_blank"属性
        // 区分electron环境 用特定API打开链接
        visit(tree, (node) => {
          if (node.type === 'element' && node.tagName === 'a') {
            node.properties.target = '_blank'
            if (isElectron)
              node.properties.onclick = `window.utools.shellOpenExternal('${node.properties.href}')`
          }
        })
      })
    },
    editorEffect({ editor }) {
      useEventBus(SWITCH_FILE, () => {
        // 因为是共用一个编辑器，所以每次切换文章时，需要清空编辑器的历史记录
        // SWITCH_FILE触发时 editor 内容为先前文章的内容 延迟到下一个tick做清空操作
        nextTick(() => editor.clearHistory())
      })
      useEventBus(FOCUS_EDITOR, () => {
        nextTick(() => editor.focus())
      })
    }
  }
}
