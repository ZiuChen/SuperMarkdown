<template>
  <!-- theme use this class to specify style -->
  <div class="markdown-body" v-html="file.toString()" @click="handleClick" ref="markdownBody"></div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { getProcessor } from 'bytemd'

const props = defineProps({
  value: String,
  plugins: Array,
  sanitize: Function,
  remarkRehype: Object
})

const emit = defineEmits(['init'])

const markdownBody: Ref<HTMLElement | null> = ref(null)
const cbs = ref([])
const file = computed(() => {
  return getProcessor(props).processSync(props.value)
})

const needUpdate = computed(() => {
  return [file, props.plugins, props.sanitize, props.remarkRehype]
})

watch(
  needUpdate,
  () => {
    off()
    nextTick(() => {
      on()
    })
  },
  { deep: true }
)

onMounted(() => {
  on()
  emit('init')
})

onUnmounted(() => {
  off()
})

const handleClick = (e: MouseEvent) => {
  const $ = e.target as HTMLElement
  if ($.tagName !== 'A') return

  const href = $.getAttribute('href')
  if (!href || !href.startsWith('#')) return

  const dest = (markdownBody.value as HTMLElement).querySelector('#user-content-' + href.slice(1))
  if (dest) dest.scrollIntoView()
}

const off = () => {
  if (cbs.value.length) {
    cbs.value.forEach((cb: any) => cb && cb())
  }
}

const on = () => {
  if (props.plugins && file) {
    cbs.value = props.plugins.map(
      ({ viewerEffect }: any) =>
        viewerEffect && viewerEffect({ markdownBody: markdownBody.value, file })
    )
  }
}
</script>
