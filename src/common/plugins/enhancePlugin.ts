import type { BytemdPlugin } from 'bytemd'
import { useEventBus } from '@/hooks/useEventBus'
import { SWITCH_FILE, FOCUS_EDITOR } from '@/common/symbol'
import { isElectron } from '@/utils'

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
      useEventBus(FOCUS_EDITOR, () => {
        nextTick(() => editor.focus())
      })
    },
    viewerEffect({ markdownBody }) {
      // 处理链接
      const atags = markdownBody.querySelectorAll('a')

      atags.forEach((a) => {
        const link = a.getAttribute('href')
        const ariaDescribedBy = a.getAttribute('aria-describedby')
        const footnoteId = a.getAttribute('href')?.replace('#', '')
        const ariaLabel = a.getAttribute('aria-label')

        // 处理网络链接
        // 为所有的网络链接a标签 添加target="_blank"属性
        // 区分electron环境 用特定API打开链接
        if (link && link.startsWith('http')) {
          a.target = '_blank'
          if (isElectron) a.onclick = () => window.utools.shellOpenExternal(link)
        }

        // 处理 footnote label
        // 额外处理footnote 点击后整个document都会跟着滚动
        // 自己实现滚动到目标位置的逻辑
        if (ariaDescribedBy && ariaDescribedBy.includes('footnote-label')) {
          a.onclick = (ev) => {
            // 阻止默认行为
            ev.preventDefault()
            ev.stopPropagation()

            const footnote = markdownBody.querySelector(
              'a.data-footnote-backref[href="#' + footnoteId?.replace('fn', 'fnref') + '"]'
            ) as HTMLLinkElement | null

            if (footnote) {
              // 在容器内滚动 使得footnote在容器内可见
              // 两种可能：split preview | 只读的viewer
              const container1 = document.querySelector('.bytemd-preview') as HTMLElement | null
              const container2 = document.querySelector('.viewer-container') as HTMLElement | null

              if (container1) {
                container1.scrollTop = footnote.offsetTop - container1.offsetTop
              }

              if (container2) {
                container2.scrollTop = footnote.offsetTop - container2.offsetTop
              }
            }
          }
        }

        // 处理 footnote backref
        if (ariaLabel && ariaLabel.includes('Back to content')) {
          a.onclick = (ev) => {
            // 阻止默认行为
            ev.preventDefault()
            ev.stopPropagation()

            // TODO: content -> footnote的跳转

            // const content = markdownBody.querySelector(
            //   `a#user-content-${footnoteId}`
            // ) as HTMLLinkElement | null

            // console.log(`a#user-content-${footnoteId}`, content)

            // if (content) {
            //   // 在容器内滚动 使得footnote在容器内可见
            //   // 两种可能：split preview | 只读的viewer
            //   const container1 = document.querySelector('.bytemd-preview') as HTMLElement | null
            //   const container2 = document.querySelector('.viewer-container') as HTMLElement | null

            //   console.log('container1', container1)
            //   console.log('container2', container2)

            //   if (container1) {
            //     container1.scrollTop = content.offsetTop - container1.offsetTop
            //   }

            //   if (container2) {
            //     container2.scrollTop = content.offsetTop - container2.offsetTop
            //   }
            // }
          }
        }
      })
    }
  }
}
