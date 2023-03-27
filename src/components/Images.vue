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

    <a-image-preview-group
      v-else
      infinite
      :preview-props="{
        actionsLayout: ['rotateRight', 'zoomIn', 'zoomOut']
      }"
    >
      <template v-for="img of imagesComputed">
        <a-image class="image-item" :src="img.imgData" height="100">
          <template #extra>
            <icon-delete title="删除" @click="handleImageDelete(img._id)" />
            <icon-copy title="复制" @click="handleImageCopy(img.imgLink)" />
          </template>
        </a-image>
      </template>
    </a-image-preview-group>
  </div>
</template>

<script setup lang="ts">
import { DbDoc, allDocs, loadImage, removeDoc, copyText } from '@/utils'
import { Message, Modal } from '@arco-design/web-vue'

const images = ref<DbDoc[] | undefined>(allDocs('attachment/'))
const imagesComputed = computed(() => {
  if (!images.value) return undefined
  return images.value.map((img: DbDoc) => {
    const imgId = img._id.split('attachment/')[1]
    const imgData = loadImage(imgId)
    const imgLink = `![](attachment:${imgId})`
    return {
      ...img,
      imgId,
      imgData,
      imgLink
    }
  })
})

function handleImageCopy(imgLink: string) {
  const res = copyText(imgLink)
  res ? Message.success('图片链接已复制到剪贴板') : Message.error('图片链接复制失败')
}

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
@import '@/style/border.less';

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.image-item {
  margin: 5px 5px 5px 0;
  .border();

  &:hover {
    :deep(.arco-image-footer) {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

:deep(.arco-image-footer) {
  display: flex;
  align-items: center;
  justify-content: end;
  svg {
    zoom: 1.2;
    margin-left: 5px;
    cursor: pointer;
  }
  // animation
  opacity: 0;
  transform: translateY(2px);
  transition: all 0.2s;
}

:deep(.arco-image-footer-extra) {
  font-size: 14px;
  padding-left: 0;
}
</style>
