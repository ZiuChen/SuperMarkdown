<template>
  <div class="nav-bar">
    <div class="left">
      <img class="logo" src="/logo.png" alt="logo" @click="to('/home')" />
    </div>
    <div class="center"></div>
    <div class="right">
      <AButtonGroup>
        <a-button type="primary" @click="to('/home')"> 主页 </a-button>
        <a-button type="primary" @click="to('/editor')"> 编辑器 </a-button>
        <a-button type="primary" @click="to('/block')"> 积木 </a-button>
      </AButtonGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function to(path: string) {
  router.push(path)
}
</script>

<style lang="less" scoped>
.nav-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  background: var(--nav-bg-color);
  .logo {
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
  .left {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 20px;
  }
  .center {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 20px;
  }
}
</style>
