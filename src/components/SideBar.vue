<template>
  <div class="side-bar">
    <a-input-search class="search" v-model="searchKey" />
    <a-tree
      :checkable="true"
      v-model:checked-keys="checkedKeys"
      :checked-strategy="'all'"
      :data="treeData"
      showLine
    >
      <template #extra="nodeData">
        <div
          style="position: absolute; right: 8px; font-size: 12px; top: 10px; color: #3370ff"
          @click="() => onIconClick(nodeData)"
        >
          Add
        </div>
      </template>
    </a-tree>
  </div>
</template>

<script setup lang="ts">
import { sidebar } from '@/data/sidebar'

const searchKey = ref('')
const checkedKeys = ref([])
const originTreeData = ref(sidebar)

const treeData = computed(() => {
  const o = originTreeData.value
  if (!searchKey.value) return o
  return searchData(searchKey.value)
})

const strategyOptions = [
  {
    value: 'all',
    label: 'show all'
  },
  {
    value: 'parent',
    label: 'show parent'
  },
  {
    value: 'child',
    label: 'show child'
  }
]

// 遍历树，找到匹配的节点
function searchData(keyword: string) {
  const loop = (data: any[]) => {
    const result: any[] = []
    data.forEach((item) => {
      if (item.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
        result.push({ ...item })
      } else if (item.children) {
        const filterData = loop(item.children)
        if (filterData.length) {
          result.push({
            ...item,
            children: filterData
          })
        }
      }
    })
    return result
  }

  return loop(originTreeData.value)
}

// 获取匹配的索引
function getMatchIndex(title: string) {
  if (!searchKey.value) return -1
  return title.toLowerCase().indexOf(searchKey.value.toLowerCase())
}

function onIconClick(nodeData: any) {
  const children = nodeData.children || []

  children.push({
    title: 'new tree node',
    key: nodeData.key + '-' + (children.length + 1)
  })

  nodeData.children = children

  // 给originTreeData赋值，会触发treeData的更新
  originTreeData.value = [...originTreeData.value]
}
</script>

<style lang="less" scoped>
.side-bar {
  .search {
    margin-bottom: 8px;
    width: 100%;
  }
}
</style>
