<template>
  <div class="side-bar">
    <a-input-search class="search" v-model="searchKey" placeholder="全局检索关键字..." />

    <div class="btn-list">
      <a-button @click="addFile">
        <template #icon>
          <icon-file />
        </template>
      </a-button>
      <a-button @click="addFolder">
        <template #icon>
          <icon-folder-add />
        </template>
      </a-button>
      <a-button @click="handleDelete">
        <template #icon>
          <icon-delete />
        </template>
      </a-button>
      <a-button @click="handleRename">
        <template #icon>
          <icon-edit />
        </template>
      </a-button>
      <a-button class="words">文章字数: </a-button>
    </div>

    <a-tree
      :checked-strategy="'all'"
      :data="treeData"
      @select="handleSelect"
      showLine
      draggable
      block-node
    >
    </a-tree>
  </div>
</template>

<script setup lang="ts">
import { sidebar, SidebarItem } from '@/data/sidebar'
import { useTreeData } from '@/hooks/useTreeData'
import { setItem, getItem } from '@/utils'

const lastKey = getItem('lastKey') || '1677900764969'

const searchKey = ref('')
const selectedNode = ref<SidebarItem | null>(null) // 保证有且只有一个选中的节点
const originTreeData = ref(sidebar)
const currentKey = ref('')

const { addFile, addFolder, handleDelete, handleRename } = useTreeData(selectedNode, originTreeData)

const treeData = computed(() => {
  const o = originTreeData.value
  if (!searchKey.value) return o
  return searchData(searchKey.value, originTreeData.value)
})

watch(selectedNode, (val) => {
  console.log('selectedNode', val)

  // 选中的节点是文件
  if (val && !val.children) {
    currentKey.value = val.key
    setItem('lastKey', val.key)
  }
})

function handleSelect(_: string[], data: any) {
  console.log('currentKey', _)
  console.log('data', data)

  selectedNode.value = data.node
}

// 遍历树，检索匹配的节点
function searchData(keyword: string, treeData: SidebarItem[]) {
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

  return loop(treeData)
}
</script>

<style lang="less" scoped>
.side-bar {
  .search {
    margin-bottom: 8px;
    width: 100%;
  }

  .btn-list {
    display: flex;
    margin-bottom: 8px;
    .words {
      flex: 1;
    }
  }
}
</style>
