import { Message } from '@arco-design/web-vue'
import { $emit } from '@/hooks/useEventBus'
import { ENTER_FILE, ENTER_CREATE, ENTER_IMPORT, ENTER_CONTENT } from '@/common/symbol'
import { isElectron } from '@/utils'
import { useMainStore } from '@/store'
import type { IPayloadFile } from '@/types'

export function registerCallback() {
  if (!isElectron) return

  utools.onPluginEnter(({ code, type, payload }) => {
    // 通过全局关键字打开文章
    if (code.startsWith('note/')) {
      const docId = code.split('/')[1]

      emitWithWatch(ENTER_FILE, docId)
    }

    // 通过关键字创建文章
    if (code === '新建Markdown笔记') {
      emitWithWatch(ENTER_CREATE)
    }

    // 从.md文件导入文档
    if (code === '导入Markdown文档') {
      const files = payload as IPayloadFile[]
      emitWithWatch(ENTER_IMPORT, files)
    }

    // 从文本/图片匹配创建文档
    if (code === '创建Markdown笔记') {
      emitWithWatch(ENTER_CONTENT, { type, payload })
    }
  })

  if (utools.db.replicateStateFromCloud()) {
    Message.warning({
      content: '数据可能不完整，还在从云端复制中'
    })
  }
}

function emitWithWatch(event: symbol, payload?: any) {
  const store = useMainStore()
  if (store.isReady) $emit(event, payload)
  else
    watch(
      () => store.isReady,
      (val) => (val ? $emit(event, payload) : null)
    )
}
