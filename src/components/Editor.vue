<template>
  <div ref="el" />
</template>

<script lang="ts" setup>
// @ts-nocheck
import { Editor } from 'bytemd'

const props = defineProps({
  value: String,
  plugins: Array,
  sanitize: Function,
  remarkRehype: Object,
  mode: String,
  previewDebounce: Number,
  placeholder: String,
  editorConfig: Object,
  locale: Object,
  uploadImages: Function
})

const emit = defineEmits(['init', 'change'])

const el: Ref<HTMLElement | null> = ref(null)
const editorRef: Ref<Editor | null> = ref(null)

watch(
  () => props,
  (newValue) => {
    const copy = { ...newValue }
    for (let k in copy) {
      if (copy[k] === undefined) {
        delete copy[k]
      }
    }
    editorRef.value?.$set(copy)
  },
  { deep: true }
)

onMounted(() => {
  const editor = new Editor({
    target: el.value!,
    props
  })
  emit('init', editor)
  editor.$on('change', (e) => {
    emit('change', e.detail.value)
  })
  editorRef.value = editor
})

defineExpose({
  editor: editorRef.value
})
</script>

<style lang="less">
@import '@/style/scrollbar.less';

body.dark {
  // 鼠标光标颜色
  .CodeMirror-cursor {
    border-left: 1px solid var(--text-color);
  }

  .bytemd {
    background-color: var(--bg-color);
    color: #f9fafb;
    border-color: #4b5563;
  }

  .bytemd-toolbar {
    background-color: var(--text-bg-color);
    border-color: #4b5563;
  }

  .CodeMirror {
    background-color: var(--text-bg-color-lighter);
    color: #f9fafb;
  }

  .cm-variable-2 {
    color: #f9fafb;
  }

  .bytemd-split {
    border-color: #4b5563;
  }

  .bytemd-status {
    border-color: #4b5563;
  }

  .bytemd-toolbar-icon:hover {
    background-color: var(--text-bg-color-lighter);
  }

  .bytemd-preview {
    background: var(--text-color);
  }
}
</style>
