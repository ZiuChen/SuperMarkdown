import { setFeature, getFeatures, removeFeature } from '@/utils'
import { useArticleStore } from '@/store'
import { Message } from '@arco-design/web-vue'

export function useArticleDropdown(store: ReturnType<typeof useArticleStore>) {
  // 获取全局关键字列表 并将状态更新到store.isFeature中 供视图使用
  // 初始化时、切换文章时都应当执行
  watchEffect(() => {
    const id = store.id // 触发依赖收集

    // 处理isFeature响应式
    const features = getFeatures()
    if (features?.length) {
      const r = features.filter((f) => f.code === store.articleKey)
      store.isFeature = r.length > 0
    }
  })

  function handleFeatureClick() {
    if (store.isFeature) {
      store.isFeature = false
      removeFeature(store.articleKey)
      Message.success('全局关键字已移除')
    } else {
      store.isFeature = true
      setFeature({
        code: store.articleKey,
        explain: '打开我的 Markdown 笔记',
        platform: ['darwin', 'win32', 'linux'],
        icon: 'logo.png',
        cmds: [store.title]
      })
      Message.success('全局关键字已添加')
    }

    store.saveArticle()
  }

  function handleReadonlyClick() {
    if (store.isReadonly) {
      store.isReadonly = false
      Message.success('只读模式已关闭')
    } else {
      store.isReadonly = true
      Message.success('只读模式已开启')
    }

    store.saveArticle()
  }

  function handleInfoClick() {
    Message.info('info')
  }

  return {
    handleFeatureClick,
    handleReadonlyClick,
    handleInfoClick
  }
}
