<template>
  <div class="about">
    <img class="bg-icon" src="/logo.png" alt="logo" />
    <h1 class="title">超级Markdown</h1>
    <a-link @click="openLink('https://github.com/ZiuChen')">ZiuChen</a-link>
    <div class="footer-btns">
      <template v-for="btn of btns">
        <a-button @click="openLink(btn.url)">{{ btn.text }}</a-button>
      </template>
    </div>
    <div class="footer-tip">Copyright © 2019-present ZiuChen</div>
    <BackButton />
  </div>
</template>

<script lang="ts" setup>
import { usePageBack } from '@/hooks/usePageBack'
import { openLink } from '@/utils'

const btns = [
  { text: '插件主页', url: 'https://ziuchen.gitee.io/project/Markdown/' },
  { text: '开源地址', url: 'https://github.com/ZiuChen/SuperMarkdown' },
  { text: '快捷键一览', url: 'https://ziuchen.gitee.io/project/Markdown/shortcut/' },
  { text: '更新日志', url: 'https://ziuchen.gitee.io/project/Markdown/log/' }
]

const { BackButton } = usePageBack()
</script>

<style lang="less" scoped>
.about {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  margin: auto;
  text-align: center;
  .bg-icon {
    margin-top: 50px;
    width: 150px;
    left: 50%;
    top: 5%;
  }
  .title {
    background: linear-gradient(120deg, #bd34fe 30%, #41d1ff);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }
  .footer-btns {
    margin-top: 25px;
    .dot {
      :deep(.el-badge__content) {
        z-index: 1;
      }
    }
    & > * {
      margin: 0 5px;
    }
  }
  .footer-tip {
    position: absolute;
    bottom: 10px;
    width: 100%;
    margin: 0 auto;
    font-size: 12px;
    color: var(--text-color-lighter);
  }
}
</style>
