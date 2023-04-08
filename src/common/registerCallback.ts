import { Message } from '@arco-design/web-vue'
import { $emit } from '@/hooks/useEventBus'
import { ENTER_FILE, ENTER_CREATE } from '@/common/symbol'
import { isElectron } from '@/utils'
import { useMainStore } from '@/store'

export function registerCallback() {
  if (!isElectron) return

  const store = useMainStore()

  utools.onPluginEnter(({ code, type, payload }) => {
    // 通过全局关键字打开文章
    if (code.startsWith('note/')) {
      const docId = code.split('/')[1]

      if (!store.isReady) {
        watch(
          () => store.isReady,
          (val) => (val ? $emit(ENTER_FILE, docId) : null)
        )
      } else {
        $emit(ENTER_FILE, docId)
      }
    }

    // 通过关键字创建文章
    if (code === '新建Markdown笔记') {
      if (!store.isReady) {
        watch(
          () => store.isReady,
          (val) => (val ? $emit(ENTER_CREATE) : null)
        )
      } else {
        $emit(ENTER_CREATE)
      }
    }
  })

  if (utools.db.replicateStateFromCloud()) {
    Message.warning({
      content: '数据可能不完整，还在从云端复制中'
    })
  }
}
