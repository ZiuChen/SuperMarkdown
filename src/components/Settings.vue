<template>
  <div class="settings">
    <h3>插件设置</h3>
    <div class="item">
      <a-link
        @click="
          handleTipModal(
            '启用后，将添加两个空心关键字到插件中，在其他场景下，可以快速导入文本或图片到超级Markdown。例如：从超级剪贴板插件多选内容后，快速将选中的内容导入为Markdown笔记。'
          )
        "
      >
        从外部导入Markdown笔记
      </a-link>
      <a-switch v-model="setting.enableSaveAsMarkdown"></a-switch>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message, Modal } from '@arco-design/web-vue'
import { settings } from '@/data/settings'
import { setItem, getItem } from '@/utils'

const localSetting = getItem('setting') || settings // 从本地获取设置项
const setting = reactive(localSetting)

// 监听设置项变化 将设置项保存到本地
watch(setting, (newVal) => {
  // TODO: precheck 校验
  setItem('setting', newVal)
  Message.success('设置已保存')
})

/**
 * 显示设置项说明
 */
function handleTipModal(content: string) {
  Modal.info({
    title: '设置项说明',
    content
  })
}
</script>

<style lang="less" scoped>
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
}
</style>
