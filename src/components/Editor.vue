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

const emit = defineEmits(['change'])

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
  editor.$on('change', (e) => {
    emit('change', e.detail.value)
  })
  editorRef.value = editor
})

defineExpose({
  editor: editorRef.value
})
</script>
