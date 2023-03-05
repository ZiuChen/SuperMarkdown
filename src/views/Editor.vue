<template>
  <div class="editor">
    <div class="header">
      <a-input
        class="title"
        type="text"
        placeholder="输入文章标题..."
        v-model="store.title"
        @input="handleTitleChange"
        :disabled="!isReady"
        :max-length="100"
        :show-word-limit="true"
      ></a-input>

      <div class="right-box">
        <div class="save-tip">
          <span>{{ statusMap[isSaving] }}</span>
        </div>
      </div>
    </div>
    <div
      id="vditor"
      :class="{
        vditor: true, // enable style of editor
        loading: !isReady
      }"
    >
      <div class="loading-tip">
        <a-spin></a-spin>
        <span>编辑器加载中...</span>
      </div>
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
import { formatTime, isElectron, setItem } from '@/utils'
import { useEventListener } from '@/hooks/useEventListener'
import { $emit, useEventBus } from '@/hooks/useEventBus'
import { SWITCH_FILE, EDITOR_LOADED, CHANGE_TITLE } from '@/common/symbol'

const store = useArticleStore()
const isSaving = ref<0 | 1 | 2 | 3>(0) // 0: 保存成功 1: 保存中 2: 保存失败 3: 上次保存时间
const isCtrl = ref(false)
const isReady = ref(false) // 编辑器是否初始化完成
const vditor = ref<Vditor | null>(null)

const statusMap = computed(() => ({
  0: '保存成功',
  1: '保存中...',
  2: '保存失败',
  3: '上次保存时间: ' + formatTime(store.lastSavedAt)
}))

watchEffect(() => {
  const val = isSaving.value
  if (val === 0) {
    setTimeout(() => {
      isSaving.value = 3
    }, 1500)
  }
})

useEventBus(SWITCH_FILE, ({ id, title }: { id: string; title: string }) => {
  // 更新store中选中文章id
  store.id = id
  store.title = title
  store.loadArticle(id, title)
  vditor.value!.setValue(store.code)
  vditor.value!.focus()
})

useEventListener(document, 'keydown', (e: KeyboardEvent) => {
  const { metaKey, ctrlKey } = e
  isCtrl.value = metaKey || ctrlKey
})

onMounted(() => {
  // Editor组件挂载后 从ArticleStore中读取文章数据
  // 而数据初始化操作是在SideBar中完成的
  vditor.value = new Vditor('vditor', {
    // 编辑器内容发生变化时，将数据保存到 store 中
    input: async (value) => {
      isSaving.value = 1

      store.$patch({
        code: value,
        lastSavedAt: new Date().getTime()
      })

      // 每次输入文字都把文章id更新到本地
      setItem('lastkey', store.id)

      const res = await store.saveArticle()
      if (res) isSaving.value = 0
    },
    // 编辑器初始化完成后，将数据渲染到编辑器中
    after: () => {
      console.log('after')
      isReady.value = true
      vditor.value!.setValue(store.code)
      $emit(EDITOR_LOADED, store.id)
    },
    toolbar,
    toolbarConfig: {},
    placeholder: '输入文章内容...',
    mode: 'sv',
    preview: {
      delay: 250,
      hljs: {
        lineNumber: true,
        style: 'github'
      },
      markdown: {
        toc: true
      }
    },
    link: {
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
async function _handleTitleChange() {
  isSaving.value = 1
  const res = await store.saveArticle()
  if (res) isSaving.value = 0
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
    position: relative;
    padding: 0.5rem;

    .title {
      width: 60%;
      height: 3em;

      :deep(.arco-input) {
        font-size: 1.2rem;
        font-weight: 500;
      }
    }

    .btn-list {
      display: flex;
      align-items: center;

      .ant-btn {
        margin-left: 0.5rem;
      }
    }

    .right-box {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .save-tip {
        margin-right: 1rem;
        color: #999;
        font-size: 0.9rem;
      }
    }

    // 宽度小于 768px 时，隐藏保存提示
    @media (max-width: 1000px) {
      .right-box {
        display: none;
      }
      .title {
        width: 100%;
      }
    }
  }

  .vditor,
  #vditor {
    flex: 1;

    // 编辑器加载中 给loading-tip布局
    &.loading {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .loading-tip {
        color: #999;
        font-size: 1.2rem;

        & > span {
          margin-left: 0.5rem;
        }
      }
    }
  }
}
</style>

<style lang="less">
// 调整toolbar的样式
.vditor-toolbar__item {
  padding: 0 0.2rem;
  zoom: 90%;
}

.vditor-reset {
  font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace !important;
}

.vditor-preview {
  // 预览页顶部工具条
  .vditor-preview__action {
    display: none;
  }

  .vditor-reset {
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
