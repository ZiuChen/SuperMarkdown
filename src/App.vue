<template>
  <SideBar></SideBar>
  <router-view v-slot="{ Component }">
    <transition name="opacity" mode="out-in" appear>
      <div class="main">
        <component :is="Component" :isDark="isDark" />
      </div>
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
import SideBar from './components/SideBar.vue'
import { useDarkMode } from '@/hooks/useDarkMode'
import { IS_DARK } from './common/symbol'

const isDark = useDarkMode()
provide(IS_DARK, isDark)
</script>

<style lang="less" scoped>
.side-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 220px;
  height: 100%;
  background-color: var(--bg-color);
  border-right: 1px solid var(--text-color-lighter);
}

.main {
  position: absolute;
  top: 0;
  left: 220px;
  right: 0;
  bottom: 0;
  overflow: auto;
  background-color: var(--bg-color);
}

.opacity-enter-active,
.opacity-leave-active {
  transition: opacity 0.1s;
}

.opacity-enter,
.opacity-leave-to {
  opacity: 0;
}
</style>
