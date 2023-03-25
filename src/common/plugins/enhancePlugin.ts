import type { BytemdPlugin } from 'bytemd'
import { useEventBus } from '@/hooks/useEventBus'
import { SWITCH_FILE } from '@/common/symbol'

/**
 * 增强插件
 */
export function enhancePlugin(): BytemdPlugin {
  return {
    editorEffect({ editor }) {
      useEventBus(SWITCH_FILE, () => {
        // 因为是共用一个编辑器，所以每次切换文章时，需要清空编辑器的历史记录
        // SWITCH_FILE触发时 editor 内容为先前文章的内容 延迟到下一个tick做清空操作
        nextTick(() => editor.clearHistory())
      })
    }
  }
}
