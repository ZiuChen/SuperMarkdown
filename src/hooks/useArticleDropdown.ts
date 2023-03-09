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

      if (store.isReadonly) {
        sourceSideEffect(false)
        readonlySideEffect(store.isReadonly)
      } else if (store.isSource && !store.isReadonly) {
        readonlySideEffect(false)
        sourceSideEffect(store.isSource)
      } else {
        readonlySideEffect(false)
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
    // if (store.isSource) return

    if (store.isReadonly) {
      store.isReadonly = false
      Message.success('只读模式已关闭')
    } else {
      store.isReadonly = true
      Message.success('只读模式已开启')
    }

    readonlySideEffect(store.isReadonly)
    store.saveArticle()
  }

  function handleSourceClick() {
    // if (store.isReadonly) return

    if (store.isSource) {
      store.isSource = false
      sourceSideEffect(false)
      Message.success('源码模式已关闭')
    } else {
      store.isSource = true
      sourceSideEffect(true)
      Message.success('源码模式已开启')
    }

    sourceSideEffect(store.isSource)
  }

  function handleInfoClick() {
    Modal.info({
      title: '文档信息',
      alignCenter: true,
      content: () =>
        h(
          'div',
          {
            style: {
              'text-align': 'center'
            }
          },
          [
            h('p', '文章标题：' + store.title),
            h('p', '创建时间：' + formatTime(store.createAt)),
            h('p', '更新时间：' + formatTime(store.lastSavedAt))
          ]
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

// isReadonly的副作用函数
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

// isSource的副作用函数
export function sourceSideEffect(val: boolean) {
  // 统一处理DOM可能为null的报错
  try {
    if (val) {
      // 切换分屏预览模式
      const btn = document.querySelector('.vditor-hint > button[data-mode=sv]') as HTMLElement
      btn.click()

      // 显示工具栏
      const t = document.querySelector('.vditor-toolbar') as HTMLElement
      t.style.display = 'block'

      // 隐藏预览区
      const p = document.querySelector('.vditor-preview') as HTMLElement
      p.style.display = 'none'
    } else {
      // 模式切换为即时渲染
      const btn = document.querySelector('.vditor-hint > button[data-mode=ir]') as HTMLElement
      btn.click()
    }
  } catch (error) {}
}
