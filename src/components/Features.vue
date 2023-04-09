<template>
  <div class="features">
    <div class="header">
      <h3>已设置的全局关键字</h3>
      <a-button @click="handleClearClick">
        <template #icon>
          <icon-delete></icon-delete>
        </template>
      </a-button>
    </div>

    <div v-if="!features?.length">
      <a-tag>当前全局关键字为空</a-tag>
    </div>
    <template v-else v-for="f of features" :key="f.code">
      <a-tag
        class="feature"
        @click="handleFeatureClick(f)"
        @close="handleFeatureClose(f)"
        :checked="true"
        checkable
        closable
        >{{ f.cmds[0] }}</a-tag
      >
    </template>
  </div>
</template>

<script setup lang="ts">
import { TFeature, getFeatures, removeFeature } from '@/utils'
import { Modal, Message } from '@arco-design/web-vue'

const features = ref<TFeature[] | undefined>(getFeatures())

/**
 * 点击移除全局关键字
 */
function handleFeatureClose(feature: TFeature) {
  const res = removeFeature(feature.code)
  if (res) Message.success('成功移除全局关键字')
}

/**
 * 点击跳转全局关键字
 */
function handleFeatureClick(feature: TFeature) {
  // @ts-ignore
  utools.redirect(feature.cmds[0])
}

/**
 * 清空全局关键字
 */
function handleClearClick() {
  if (!features.value?.length) return Message.warning('当前全局关键字为空')
  Modal.warning({
    title: '是否清空所有全局关键字',
    content: '删除后无法恢复',
    hideCancel: false,
    cancelText: '取消',
    onOk() {
      features.value?.forEach((f) => {
        removeFeature(f.code)
      })
      Message.success('所有全局关键字都已删除')
      features.value = getFeatures()
    }
  })
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feature {
  margin-right: 5px;
}
</style>
