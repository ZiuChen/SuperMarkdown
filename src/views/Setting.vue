<template>
  <div class="setting">
    <BackButton></BackButton>
    <Features v-if="isElectron" class="setting-box"></Features>
    <Images v-if="isElectron" class="setting-box"></Images>
    <Settings class="setting-box"></Settings>
  </div>
</template>

<script setup lang="ts">
import { usePageBack } from '@/hooks/usePageBack'
import Features from '@/components/Features.vue'
import Images from '@/components/Images.vue'
import Settings from '@/components/Settings.vue'
import { isElectron } from '@/utils'

const { BackButton } = usePageBack()
</script>

<style lang="less" scoped>
@import '@/style/border.less';

.setting {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.setting-box {
  padding: 10px 20px 20px 20px;
  margin: 10px 0;
  width: 80%;
  .border();
}
</style>
