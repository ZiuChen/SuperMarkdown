import { setFeature, getFeatures, removeFeature } from '@/utils'
import { useArticleStore } from '@/store'
import { Message } from '@arco-design/web-vue'

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
    }

    // 获取全局关键字列表 并将状态更新到store.isFeature中 供视图使用
    // 初始化时、切换文章时都应当执行
    const features = getFeatures()
    if (features?.length) {
      const r = features.filter((f) => f.code === store.articleKey)
      store.isFeature = r.length > 0
    }

    // 为isReadonly添加副作用
    // 涉及DOM操作 需保证编辑器挂载后执行
    readonlySideEffect(store.isReadonly)
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

export function readonlySideEffect(val: boolean) {
  // 统一处理DOM可能为null的报错
  try {
    if (val) {
      // 模式切换为分屏预览
      const btn = document.querySelector('.vditor-hint > button[data-mode=sv]') as HTMLElement
      btn.click()

      // 隐藏工具栏
      const t = document.querySelector('.vditor-toolbar') as HTMLElement
      t.style.display = 'none'

      // 隐藏编辑区
      const e = document.querySelector('.vditor-sv') as HTMLElement
      e.style.display = 'none'
    } else {
      // 模式切换为即时渲染
      const btn = document.querySelector('.vditor-hint > button[data-mode=ir]') as HTMLElement
      btn.click()

      // 显示工具栏
      const t = document.querySelector('.vditor-toolbar') as HTMLElement
      t.style.display = 'block'
    }
  } catch (error) {}
}
