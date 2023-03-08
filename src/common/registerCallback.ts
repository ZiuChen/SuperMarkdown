import { $emit } from '@/hooks/useEventBus'
import { FILE_ENTER } from '@/common/symbol'
import { isElectron } from '@/utils'

export function registerCallback() {
  if (!isElectron) return
  utools.onPluginEnter(({ code, type, payload }) => {
    // 两种情况 如果插件还没启动 编辑器未完成初始化 则通过设置lastkey的方式实现快速打开
    if (code.startsWith('note/')) {
      $emit(FILE_ENTER, code.split('/')[1])
    }
  })
}
