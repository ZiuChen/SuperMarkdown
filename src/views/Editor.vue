<template>
  <div class="editor">
    <div class="header">
      <input class="title" type="text" placeholder="输入文章标题...">
      <div class="right-box">
        <div class="save-tip">
          保存成功
        </div>
      </div>
    </div>
    <div id="editor"></div>
  </div>
</template>

<script setup lang="ts">
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

import { useArticleStore } from '@/store'

const store = useArticleStore()

onMounted(() => {
  // @ts-ignore
  const editor = new Editor({
    target: document.querySelector('#editor'),
    props: {
      value: '',
      plugins: [
        gfm(),
        breaks(),
        frontmatter(),
        highlight(),
        math(),
        mermaid(),
        mediumZoom(),
      ],
    },
  })

  // @ts-ignore
  editor.$on('change', (e) => {
    // @ts-ignore
    editor.$set({ value: e.detail.value })

    // 更新store中的数据
    store.code = e.detail.value
    store.lastSaved = new Date().getTime()
  })
})


</script>

<style lang="less" scoped>
.editor {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

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
        font-size: 1.2rem;
      }
    }
  }

  #editor {
    flex: 1;

    :deep(.bytemd) {
      height: 100%;
    }
  }
}
</style>
