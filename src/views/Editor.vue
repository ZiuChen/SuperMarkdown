<template>
  <div class="editor">
    <div class="header">
      <input class="title" type="text" placeholder="输入文章标题..." v-model="store.title" @input="handleTitleChange">
      <div class="right-box">
        <div class="save-tip">
          <span v-if="isSaving === 0">保存成功</span>
          <span v-else-if="isSaving === 1">保存中...</span>
          <span v-else-if="isSaving === 2">保存失败</span>
          <span v-else-if="isSaving === 3">上次保存时间 {{ formatTime(store.lastSavedAt) }}</span>
        </div>
      </div>
    </div>
    <div id="vditor"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { throttle } from 'lodash-es'
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { useArticleStore } from '@/store'
import { toolbar } from '@/data/toolbar'
import { formatTime, isElectron } from '@/utils'
import { useEventListener } from '@/hooks/useEventListener'

const store = useArticleStore()
const vditor = ref<Vditor | null>(null);
const isSaving = ref(0) // 0: 保存成功 1: 保存中 2: 保存失败 3: 上次保存时间
const isCtrl = ref(false)

// 初始化数据
store.loadArticle()

// 处理标题输入事件
const handleTitleChange = throttle(_handleTitleChange, 800)
async function _handleTitleChange() {
  isSaving.value = 1
  const res = await store.saveArticle()
  if (res) isSaving.value = 0
}

watchEffect(() => {
  const val = isSaving.value
  if (val === 0) {
    setTimeout(() => {
      isSaving.value = 3
    }, 1500)
  }
})

useEventListener(document, 'keydown', (e: KeyboardEvent) => {
  const { metaKey, ctrlKey } = e
  isCtrl.value = metaKey || ctrlKey
})

onMounted(() => {
  vditor.value = new Vditor('vditor', {
    // 编辑器内容发生变化时，将数据保存到 store 中
    input: async (value) => {
      isSaving.value = 1
      store.$patch({
        code: value,
        lastSavedAt: new Date().getTime()
      })

      const res = await store.saveArticle()
      if (res) isSaving.value = 0
    },
    // 编辑器初始化完成后，将数据渲染到编辑器中
    after: () => {
      vditor.value!.setValue(store.code);
    },
    toolbar,
    toolbarConfig: {

    },
    placeholder: '输入文章内容...',
    mode: 'sv',
    preview: {
      delay: 250,
      hljs: {
        lineNumber: true,
        style: 'onedark'
      },
      markdown: {
        toc: true,
      }
    },
    link: {
      click: (bom) => {
        if (!isCtrl.value) return
        const link = bom.innerHTML
        isElectron ? utools.shellOpenExternal(link) : window.open(link)
      }
    }
  });
});

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
    padding: 1rem 1.5rem;

    .title {
      width: 100%;
      height: 2rem;
      border: none;
      outline: none;
      font-size: 1.6rem;
      font-weight: 500;
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
        font-size: 1rem;
      }
    }
  }

  .vditor {
    flex: 1;
  }
}
</style>

<style lang="less">
// 调整toolbar的样式
.vditor-toolbar__item {
  padding: 0 0.2rem;
  zoom: 110%;
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