<template>
  <router-view> </router-view>
</template>

<script lang="ts" setup>
import { useDarkMode } from '@/hooks/useDarkMode'
import { IS_DARK } from './common/symbol'
import { useMainStore } from './store'
import { initWebDav } from './utils/webdav'
import { Message } from '@arco-design/web-vue'

const isDark = useDarkMode()
const store = useMainStore()
provide(IS_DARK, isDark)

onMounted(async () => {
  const res = store.setting.webDav.enable ? await initWebDav() : null
  res
    ?.filter((item) => item.status === 'rejected')
    .forEach((item: any) => Message.error(`WebDav init failed: ${item.reason}`))
})
</script>
