<template>
  <div class="app">
    <!-- <NavBar /> -->
    <router-view v-slot="{ Component }">
      <transition name="opacity" mode="out-in" appear>
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import NavBar from './components/NavBar.vue'
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
