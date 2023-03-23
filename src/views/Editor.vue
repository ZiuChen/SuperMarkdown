<template>
  <div class="editor">
    <SideBar></SideBar>

    <div class="header">
      <a-input
        class="title"
        type="text"
        placeholder="输入文章标题..."
        v-model="store.title"
        @input="handleTitleChange"
        :disabled="titleInputDisabled"
        :max-length="100"
        :show-word-limit="true"
      ></a-input>

      <a-dropdown>
        <a-button class="dropdown-btn" :disabled="dropdownDisabled">
          <icon-lock v-if="store.isReadonly"></icon-lock>
          <icon-code v-else-if="store.isSource"></icon-code>
          <icon-share-external v-else-if="store.isFeature"></icon-share-external>
          <icon-more v-else></icon-more>
        </a-button>
        <template #content>
          <a-doption @click="handleFeatureClick" v-show="isElectron">
            <template #icon>
              <icon-share-external />
            </template>
            {{ store.isFeature ? '移除全局关键字' : '添加文章关键字' }}
          </a-doption>
          <a-doption @click="handleReadonlyClick" v-if="!store.isSource">
            <template #icon>
              <icon-lock />
            </template>
            {{ store.isReadonly ? '取消只读模式' : '只读模式' }}
          </a-doption>
          <a-doption @click="handleSourceClick" v-if="!store.isReadonly">
            <template #icon>
              <icon-code />
            </template>
            {{ store.isSource ? '退出源码模式' : '源码模式' }}
          </a-doption>
          <a-doption @click="handleInfoClick">
            <template #icon>
              <icon-info-circle />
            </template>
            文档信息
          </a-doption>
        </template>
      </a-dropdown>
    </div>

    <div id="editor"></div>

    <div
      id="vditor"
      :class="{
        vditor: true, // enable style of editor
        'vditor--dark': isDark
      }"
      v-show="isReady && !store.isEmpty"
    ></div>
    <div class="tips" v-show="isReady && store.isEmpty">请在左侧选择文章</div>
    <div class="tips" v-show="!isReady">
      <a-spin></a-spin>
      <span>编辑器加载中...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { throttle } from 'lodash-es'
import SideBar from '@/components/SideBar.vue'
import { useArticleStore, useMainStore } from '@/store'
import { toolbar } from '@/data/toolbar'
import { isElectron, setItem, getItem } from '@/utils'
import { useEventListener } from '@/hooks/useEventListener'
import { $emit, useEventBus } from '@/hooks/useEventBus'
import { useArticleDropdown } from '@/hooks/useArticleDropdown'
import {
  SWITCH_FILE,
  EDITOR_LOADED,
  CHANGE_TITLE,
  IS_DARK,
  CATEGORY_MODE_CHANGE
} from '@/common/symbol'
import { __dirname } from '@/preload'

import 'bytemd/dist/index.css'
import 'highlight.js/styles/default.css'
import gfm from '@bytemd/plugin-gfm'
import breaks from '@bytemd/plugin-breaks'
import frontmatter from '@bytemd/plugin-frontmatter'
import highlight from '@bytemd/plugin-highlight'
import math from '@bytemd/plugin-math'
import mermaid from '@bytemd/plugin-mermaid'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import { Editor } from 'bytemd'

const lastKey = getItem('lastkey') || ''

const store = useArticleStore()
const mainStore = useMainStore()
const isCtrl = ref(false)
const isReady = ref(false) // 编辑器是否初始化完成

const titleInputDisabled = computed(() => !isReady.value || store.isEmpty || store.isReadonly)
const dropdownDisabled = computed(() => !isReady.value || store.isEmpty)

const isDark = inject<Ref<boolean>>(IS_DARK)!

const { handleFeatureClick, handleReadonlyClick, handleSourceClick, handleInfoClick } =
  useArticleDropdown(store)

store.loadArticle(lastKey)

useEventBus(SWITCH_FILE, ({ id, title }: { id: string; title: string }) => {
  // 更新store中选中文章id
  store.id = id
  store.title = title

  store.loadArticle(id, title)

  // 因为是共用一个编辑器，所以每次切换文章时，需要清空编辑器的历史记录
  // mainStore.editor!.setValue(store.code, true)
  // mainStore.editor!.focus()
})

useEventBus(CATEGORY_MODE_CHANGE, (mode: string) => {
  const d = document.querySelector('.vditor-outline') as HTMLElement

  if (mode === 'outline') {
    if (!d) return
    d.style.display = 'block'
  } else {
    if (!d) return
    d.style.display = 'none'
  }
})

useEventListener(document, 'keydown', (e: KeyboardEvent) => {
  const { metaKey, ctrlKey } = e
  isCtrl.value = metaKey || ctrlKey
})

onMounted(() => {
  // Editor组件挂载后 从ArticleStore中读取文章数据
  // 而数据初始化操作是在SideBar中完成的

  // @ts-ignore
  const editor = new Editor({
    target: document.querySelector('#editor'),
    props: {
      value: store.code,
      plugins: [gfm(), breaks(), frontmatter(), highlight(), math(), mermaid(), mediumZoom()]
    }
  })

  mainStore.editor = editor

  // 初始化完毕
  isReady.value = true
  $emit(EDITOR_LOADED, store.id)

  // @ts-ignore
  editor.$on('change', (e) => {
    const value = e.detail.value
    // @ts-ignore
    editor.$set({ value })

    // 更新store中的数据
    store.code = e.detail.value
    store.lastSavedAt = new Date().getTime()

    // 每次输入文字都把文章id更新到本地
    setItem('lastkey', store.id)
    store.saveArticle()
  })

  // mainStore.editor = new Vditor('vditor', {
  //   _lutePath: `${__dirname}/dist/js/lute/lute.min.js`,
  //   cdn: __dirname,
  //   theme: isDark.value ? 'dark' : 'classic',
  //   // 编辑器内容发生变化时，将数据保存到 store 中
  //   input: (value) => {
  //     store.code = value
  //     store.lastSavedAt = new Date().getTime()
  //     // 每次输入文字都把文章id更新到本地
  //     setItem('lastkey', store.id)
  //     store.saveArticle()
  //   },
  //   // 编辑器初始化完成后，将数据渲染到编辑器中
  //   after() {
  //     isReady.value = true
  //     mainStore.editor!.setValue(store.code)
  //     nextTick(() => mainStore.editor!.focus())
  //     $emit(EDITOR_LOADED, store.id)
  //   },
  //   outline: {
  //     enable: false,
  //     position: 'right'
  //   },
  //   counter: {
  //     enable: true
  //   },
  //   hint: {
  //     parse: false
  //   },
  //   toolbar,
  //   toolbarConfig: {
  //     pin: true
  //   },
  //   undoDelay: 50,
  //   placeholder: '输入文章内容...',
  //   preview: {
  //     delay: 100,
  //     hljs: {
  //       lineNumber: true,
  //       style: 'solarized-dark'
  //     },
  //     theme: {
  //       current: isDark.value ? 'dark' : 'light',
  //       path: `${__dirname}/dist/css/content-theme`
  //     },
  //     markdown: {
  //       toc: true
  //     }
  //   },
  //   link: {
  //     isOpen: false,
  //     click: (bom) => {
  //       if (!isCtrl.value) return
  //       const link = bom.innerHTML
  //       isElectron ? utools.shellOpenExternal(link) : window.open(link)
  //     }
  //   }
  // })
})

// 处理标题输入事件
const handleTitleChange = throttle(_handleTitleChange, 800)
function _handleTitleChange() {
  store.saveArticle()

  $emit(CHANGE_TITLE, {
    id: store.id,
    title: store.title
  })
}
</script>

<style lang="less" scoped>
.editor {
  position: absolute;
  top: 0;
  left: 220px;
  right: 0;
  bottom: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;

  .side-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 220px;
    height: 100%;
  }

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 8px;

    .title {
      width: 100%;
      height: 3em;

      :deep(.arco-input) {
        font-size: 1.2rem;
        font-weight: 500;
      }
    }

    .dropdown-btn {
      height: 3em;
      margin-left: 8px;
      .arco-icon {
        zoom: 1.2;
      }
    }
  }

  .tips {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999;
    font-size: 1.2rem;

    & > span {
      margin-left: 0.5rem;
    }
  }

  .vditor,
  #vditor {
    flex: 1;
  }
}
</style>

<style lang="less">
// 调整toolbar的样式
.vditor-toolbar {
  padding-left: 0 !important;
}

.vditor-toolbar__item {
  display: block !important; // 默认都显示 否则outline会隐藏掉
  padding-left: 2px;

  // 隐藏特定工具栏按钮
  & > button[data-type='only-edit'] {
    display: none;
  }
  & > button[data-type='edit-mode'] {
    display: none;
  }
}

.vditor-outline {
  position: fixed;
  left: 0;
  top: 33px;
  width: 220px;
  height: 100%;

  .vditor-outline__title {
    display: none;
  }
}

.vditor-preview {
  border: none;

  // 预览页顶部工具条
  .vditor-preview__action {
    display: none;
  }

  .vditor-reset {
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace !important;

    a {
      text-decoration: none;
      color: #0269c8;
      border-bottom: 1px solid #d1e9ff;

      &:hover {
        border-bottom: 1px solid #0269c8;
      }
    }
  }
}
</style>
