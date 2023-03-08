<template>
  <div class="setting">
    <BackButton></BackButton>
    <h1>Setting</h1>
  </div>
</template>

<script setup lang="ts">
import { usePageBack } from '@/hooks/usePageBack'

const { BackButton } = usePageBack()
</script>

<style lang="less" scoped>
.back {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
