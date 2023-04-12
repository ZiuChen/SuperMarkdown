<template>
  <div class="editor">
    <a-layout>
      <a-layout-sider
        @collapse="handleSideBarCollapse"
        :width="220"
        :collapsed-width="25"
        :style="{
          height: '100vh'
        }"
        collapsible
      >
        <div v-show="sideBarCollapsed" class="collapse-tip">侧栏已折叠</div>
        <SideBar v-show="!sideBarCollapsed"></SideBar>
        <template #trigger>
          <icon-right-circle v-if="sideBarCollapsed"></icon-right-circle>
          <icon-left-circle v-else></icon-left-circle>
        </template>
      </a-layout-sider>

      <a-layout>
        <a-layout-header>
          <div class="header">
            <a-input
              ref="titleInputRef"
              class="title"
              type="text"
              placeholder="输入文章标题..."
              v-model="store.title"
              @input="handleTitleChange"
              @keydown.tab="handleTitleTab"
              :disabled="titleInputDisabled"
              :max-length="100"
              :show-word-limit="true"
            ></a-input>

            <a-dropdown>
              <a-button class="dropdown-btn" :disabled="dropdownDisabled">
                <icon-lock v-if="store.isReadonly"></icon-lock>
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
        </a-layout-header>

        <a-layout>
          <a-layout-content>
            <Editor
              id="editor"
              v-if="!store.isEmpty && !store.isReadonly"
              :value="store.code"
              :plugins="plugins"
              :locale="zhHans"
              @init="handleEditorInit"
              @change="handleEditorChange"
              placeholder="输入文章内容..."
            ></Editor>

            <div class="viewer-container" v-if="store.isReadonly && !store.isEmpty">
              <Viewer
                id="viewer"
                :value="store.code"
                :plugins="plugins"
                @init="handleEditorInit"
              ></Viewer>
            </div>

            <div class="tips" v-show="store.isEmpty">请在左侧选择文章</div>

            <div class="tips" v-show="!isReady && !store.isEmpty">
              <a-spin></a-spin>
              <span>编辑器加载中...</span>
            </div>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import type { Input } from '@arco-design/web-vue'
import { throttle } from 'lodash-es'
import 'bytemd/dist/index.css'
import 'highlight.js/styles/default.css'
import 'katex/dist/katex.css'
import '@/style/theme/normalize.css' // 编辑器样式重置(copy from juejin)
import zhHans from 'bytemd/locales/zh_Hans.json'

import SideBar from '@/components/SideBar.vue'
import Editor from '@/components/Editor.vue'
import Viewer from '@/components/Viewer.vue'
import { plugins } from '@/common/plugins/instance'
import { useArticleStore, useMainStore } from '@/store'
import { isElectron, setItem, getItem } from '@/utils'
import { useEventListener } from '@/hooks/useEventListener'
import { $emit, useEventBus } from '@/hooks/useEventBus'
import { useArticleDropdown } from '@/hooks/useArticleDropdown'
import { useScrollLock } from '@/hooks/useScrollLock'
import {
  SWITCH_FILE,
  EDITOR_LOADED,
  CHANGE_TITLE,
  IS_DARK,
  CREATE_FILE,
  FOCUS_EDITOR
} from '@/common/symbol'

const lastKey = getItem('lastkey') || ''
const store = useArticleStore()
const mainStore = useMainStore()
const isReady = computed(() => mainStore.isReady) // 编辑器是否初始化完成
const sideBarCollapsed = ref(false)
const titleInputRef = ref<InstanceType<typeof Input> | null>(null)

const titleInputDisabled = computed(() => !isReady.value || store.isEmpty || store.isReadonly)
const dropdownDisabled = computed(() => !isReady.value || store.isEmpty)

const isDark = inject<Ref<boolean>>(IS_DARK)!

const { handleFeatureClick, handleReadonlyClick, handleInfoClick } = useArticleDropdown(store)
const { lock } = useScrollLock()

lastKey ? store.loadArticle(lastKey) : store.initArticle()

lock() // 锁定滚动

// 更新store中选中文章id
useEventBus(SWITCH_FILE, ({ id, title }: { id: string; title: string }) => {
  store.id = id
  store.title = title
  store.loadArticle(id, title)
})

// 新建文章 聚焦标题并全选内容
useEventBus(CREATE_FILE, () => {
  titleInputRef.value?.focus()
  nextTick(() => titleInputRef.value?.inputRef?.select())
})

// 每次聚焦时 都从本地存储获取最新的文章内容并加载
useEventListener(window, 'focus', () => {
  store.loadArticle(store.id)
})

// 卸载时更新状态库
onUnmounted(() => {
  mainStore.isReady = false
})

/**
 * 插件初始化完毕时触发
 * 父组件先于子组件挂载
 */
function handleEditorInit() {
  // 初始化完毕
  mainStore.isReady = true
  $emit(EDITOR_LOADED, store.id)
  nextTick(() => $emit(FOCUS_EDITOR))
}

/**
 * 文章标题变化时触发
 */
const handleTitleChange = throttle(_handleTitleChange, 800)
function _handleTitleChange() {
  store.saveArticle()

  $emit(CHANGE_TITLE, {
    id: store.id,
    title: store.title
  })
}

/**
 * 标题聚焦时按下tab时触发
 */
function handleTitleTab(ev: KeyboardEvent) {
  ev.preventDefault() // 取消默认操作: 聚焦下一个Tabindex元素

  // 聚焦编辑器
  $emit(FOCUS_EDITOR)
}

/**
 * 编辑器文本变化时触发
 * @param value 当前编辑器的值
 */
function handleEditorChange(value: string) {
  // 更新store中的数据
  store.code = value
  store.lastSavedAt = new Date().getTime()

  // 每次输入文字都把文章id更新到本地
  setItem('lastkey', store.id)
  store.saveArticle()
}

/**
 * 侧边栏折叠状态变化时触发
 */
function handleSideBarCollapse(collapsed: boolean) {
  sideBarCollapsed.value = collapsed
}
</script>

<style lang="less" scoped>
@import '@/style/scrollbar.less';
@import '@/style/border.less';

.collapse-tip {
  text-align: center;
  color: var(--text-color);
  margin-top: 25px;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0 8px 8px 8px;

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
  height: calc(100vh - 58px);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  font-size: 1.2rem;

  & > span {
    margin-left: 0.5rem;
  }
}

#editor {
  :deep(.bytemd) {
    height: calc(100vh - 50px); // 减去标题栏的高度
    border: none;

    .CodeMirror-vscrollbar {
      z-index: 0; // 图片mediumzoom时，编辑器滚动条会遮挡图片
    }
  }
}

.viewer-container {
  height: calc(100vh - 50px); // 减去标题栏的高度
  padding: 0 10px;
  overflow: auto;
  background-color: #fff;
  .scrollbar();
  .border-part(top);
}

// #viewer {}
</style>

<style lang="less">
// 隐藏编辑器工具栏中的部分按钮
.bytemd-toolbar-left {
  .bytemd-tippy[bytemd-tippy-path='6'] {
    display: none;
  }
  .bytemd-tippy[bytemd-tippy-path='14'] {
    display: none;
  }
  .bytemd-tippy[bytemd-tippy-path='18'] {
    display: none;
  }
}

.bytemd-toolbar-right {
  // 宽度小于800px时 隐藏部分item
  @media only screen and (max-width: 800px) {
    .bytemd-tippy[bytemd-tippy-path='2'] {
      display: none;
    }
    .bytemd-tippy[bytemd-tippy-path='3'] {
      display: none;
    }
  }

  .bytemd-tippy[bytemd-tippy-path='1'] {
    display: none;
  }
  .bytemd-tippy[bytemd-tippy-path='5'] {
    display: none;
  }
}
</style>
