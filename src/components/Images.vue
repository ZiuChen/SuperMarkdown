<template>
  <div class="images">
    <div class="header">
      <h3>已存储的图片</h3>
      <a-button @click="handleClearClick">
        <template #icon>
          <icon-delete></icon-delete>
        </template>
      </a-button>
    </div>

    <div v-if="!images?.length">
      <a-tag>当前未存储任何图片</a-tag>
    </div>

    <a-image-preview-group v-else infinite>
      <template v-for="img of imagesComputed">
        <a-image class="image-item" :src="img.imgData" height="100">
          <template #extra>
            <span @click="handleImageDelete(img._id)">
              删除
              <icon-delete></icon-delete>
            </span>
          </template>
        </a-image>
      </template>
    </a-image-preview-group>
  </div>
</template>

<script setup lang="ts">
import { DbDoc, allDocs, loadImage, removeDoc } from '@/utils'
import { Message, Modal } from '@arco-design/web-vue'

const images = ref<DbDoc[] | undefined>(allDocs('attachment/'))
const imagesComputed = computed(() => {
  if (!images.value) return undefined
  return images.value.map((img: DbDoc) => {
    const imgId = img._id.split('attachment/')[1]
    const imgData = loadImage(imgId)
    return {
      ...img,
      imgData
    }
  })
})

function handleImageDelete(docId: string) {
  Modal.warning({
    title: '是否删除选中图片',
    content: '删除后无法恢复',
    hideCancel: false,
    cancelText: '取消',
    onOk() {
      const res = removeDoc(docId)
      if (res && res.ok) {
        Message.success('删除图片成功')
        images.value = allDocs('attachment/')
      } else Message.error('删除图片失败')
    }
  })
}

function handleClearClick() {
  if (!images.value?.length) return Message.warning('当前未存储任何图片')
  Modal.warning({
    title: '是否清空所有图片',
    content: '删除后无法恢复',
    hideCancel: false,
    cancelText: '取消',
    onOk() {
      images.value?.forEach((img) => {
        removeDoc(img._id)
      })
      Message.success('所有图片都已删除')
      images.value = allDocs('attachment/')
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

.image-item {
  margin: 5px 5px 5px 0;
  &:hover {
    :deep(.arco-image-footer) {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

:deep(.arco-image-footer) {
  opacity: 0;
  transform: translateY(-5px);
  transition: all 0.2s;
}

:deep(.arco-image-footer-extra) {
  font-size: 14px;
  padding-left: 0;
  cursor: pointer;
}
</style>
