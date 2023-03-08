<template>
  <div class="editor">
    <div class="header">
      <a-input
        class="title"
        type="text"
        placeholder="输入文章标题..."
        v-model="store.title"
        @input="handleTitleChange"
        :disabled="!isReady || store.isEmpty"
        :max-length="100"
        :show-word-limit="true"
      ></a-input>
      <a-dropdown>
        <a-button class="dropdown-btn" :disabled="!isReady || store.isEmpty">
          <icon-more></icon-more>
        </a-button>
        <template #content>
          <a-doption @click="handleFeatureClick">
            <template #icon>
              <icon-share-external />
            </template>
            {{ store.isFeature ? '移除全局关键字' : '添加文章关键字' }}
          </a-doption>
          <a-doption @click="handleReadonlyClick">
            <template #icon>
              <icon-lock />
            </template>
            {{ store.isReadonly ? '取消只读模式' : '只读模式' }}
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
    <div
      id="vditor"
      :class="{
        vditor: true, // enable style of editor
        'vditor--dark': isDark
      }"
      v-show="!store.isEmpty"
    ></div>
    <div class="tips" v-show="store.isEmpty">请在左侧选择文章</div>
    <div class="tips" v-show="!isReady">
      <a-spin></a-spin>
      <span>编辑器加载中...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { throttle } from 'lodash-es'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { useArticleStore } from '@/store'
import { toolbar } from '@/data/toolbar'
import { isElectron, setItem } from '@/utils'
import { useEventListener } from '@/hooks/useEventListener'
import { $emit, useEventBus } from '@/hooks/useEventBus'
import { useArticleDropdown } from '@/hooks/useArticleDropdown'
import { SWITCH_FILE, EDITOR_LOADED, CHANGE_TITLE, IS_DARK } from '@/common/symbol'

const store = useArticleStore()
const isCtrl = ref(false)
const isReady = ref(false) // 编辑器是否初始化完成
const vditor = ref<Vditor | null>(null)

const isDark = inject<Ref<boolean>>(IS_DARK)!

const { handleFeatureClick, handleReadonlyClick, handleInfoClick } = useArticleDropdown(store)

useEventBus(SWITCH_FILE, ({ id, title }: { id: string; title: string }) => {
  // 更新store中选中文章id
  store.id = id
  store.title = title

  store.loadArticle(id, title)

  vditor.value!.setValue(store.code)
  vditor.value!.focus()
})

useEventBus(EDITOR_LOADED, () => {
  // 编辑器实例挂载到store.editor上
  store.editor = vditor.value
})

useEventListener(document, 'keydown', (e: KeyboardEvent) => {
  const { metaKey, ctrlKey } = e
  isCtrl.value = metaKey || ctrlKey
})

onMounted(() => {
  // Editor组件挂载后 从ArticleStore中读取文章数据
  // 而数据初始化操作是在SideBar中完成的
  vditor.value = new Vditor('vditor', {
    theme: isDark.value ? 'dark' : 'classic',
    // 编辑器内容发生变化时，将数据保存到 store 中
    input: (value) => {
      store.$patch({
        code: value,
        lastSavedAt: new Date().getTime()
      })

      // 每次输入文字都把文章id更新到本地
      setItem('lastkey', store.id)

      store.saveArticle()
    },
    // 编辑器初始化完成后，将数据渲染到编辑器中
    after: () => {
      isReady.value = true
      vditor.value!.setValue(store.code)
      $emit(EDITOR_LOADED, store.id)
    },
    outline: {
      enable: false,
      position: 'right'
    },
    counter: {
      enable: true
    },
    hint: {
      parse: false
    },
    toolbar,
    toolbarConfig: {
      pin: true
    },
    undoDelay: 150,
    placeholder: '输入文章内容...',
    preview: {
      delay: 250,
      hljs: {
        lineNumber: true,
        style: 'solarized-dark'
      },
      theme: {
        current: isDark.value ? 'dark' : 'light'
      },
      markdown: {
        toc: true
      }
    },
    link: {
      isOpen: false,
      click: (bom) => {
        if (!isCtrl.value) return
        const link = bom.innerHTML
        isElectron ? utools.shellOpenExternal(link) : window.open(link)
      }
    }
  })
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

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
  padding: 0 0.2rem;
  zoom: 90%;
}

.vditor-preview {
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
