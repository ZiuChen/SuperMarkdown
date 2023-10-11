import { setFeature, getFeatures, removeFeature, formatTime } from '@/utils'
import { useArticleStore } from '@/store'
import { Message, Modal } from '@arco-design/web-vue'

export function useArticleDropdown(store: ReturnType<typeof useArticleStore>) {
  // loadArticle是将本地存储以$patch的方式更新到store中
  // 这就导致如果本地存储中没有isFeature/isReadonly属性 相应的值也不会更新到store中
  // 这里相当于是$patch的钩子 添加对 isFeature/isReadonly 的额外处理
  store.$subscribe((mutation, state) => {
    // ts error when access to `mutation.payload` to get the source data of `$patch` method.
    // https://github.com/vuejs/pinia/discussions/1492
    if (mutation.type === 'patch object') {
      // 处理isFeature响应式
      store.isFeature = !!mutation.payload?.isFeature

      // 处理isReadonly响应式
      store.isReadonly = !!mutation.payload?.isReadonly

      // 获取全局关键字列表 并将状态更新到store.isFeature中 供视图使用
      // 初始化时、切换文章时都应当执行
      const features = getFeatures()
      if (features?.length) {
        const r = features.filter((f) => f.code === store.articleKey)
        store.isFeature = r.length > 0
      }
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
    if (store.isSource) return

    store.isReadonly = !store.isReadonly
    Message.success('只读模式已' + (store.isReadonly ? '开启' : '关闭'))

    store.saveArticle()
  }

  function handleSourceClick() {
    if (store.isReadonly) return

    store.isSource = !store.isSource
    Message.success('源码模式已' + (store.isSource ? '开启' : '关闭'))
  }

  function handleInfoClick() {
    Modal.info({
      title: '文档信息',
      alignCenter: true,
      content: () => (
        <div style={{ textAlign: 'center' }}>
          <p>文章标题：{store.title}</p>
          <p>创建时间：{formatTime(store.createAt)}</p>
          <p>更新时间：{formatTime(store.lastSavedAt)}</p>
        </div>
      ),
      okText: '确定'
    })
  }

  return {
    handleFeatureClick,
    handleReadonlyClick,
    handleSourceClick,
    handleInfoClick
  }
}
