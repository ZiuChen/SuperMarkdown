<template>
  <router-view v-slot="{ Component }">
    <transition name="opacity" mode="out-in" appear>
      <div class="main">
        <component :is="Component" :isDark="isDark" />
      </div>
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
import { useDarkMode } from '@/hooks/useDarkMode'
import { IS_DARK } from './common/symbol'

const isDark = useDarkMode()
provide(IS_DARK, isDark)
</script>

<style lang="less" scoped>
.opacity-enter-active,
.opacity-leave-active {
  transition: opacity 0.1s;
}

.opacity-enter,
.opacity-leave-to {
  opacity: 0;
}
</style>
