<template>
  <router-view v-slot="{ Component }">
    <transition name="opacity" mode="out-in" appear>
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
import { useDarkMode } from '@/hooks/useDarkMode'
import { IS_DARK } from './common/symbol'
import '@/style/theme/juejin.scss'
// import '@/style/theme/github.css'

const isDark = useDarkMode()
provide(IS_DARK, isDark)
</script>

<style lang="less" scoped>
.opacity-enter-active,
.opacity-leave-active {
  transition: opacity 0.1s ease-in-out;
}

.opacity-enter,
.opacity-leave-to {
  opacity: 0;
}
</style>
