<template>
  <div class="side-bar">
    <a-input-search class="search" v-model="searchKey" placeholder="全局检索关键字..." />

    <div class="btn-list" @click="handleCategoryChange">
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
      :data="treeData"
      :selected-keys="selectedKeys"
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
import { $emit, useEventBus } from '@/hooks/useEventBus'
import { useTreeData } from '@/hooks/useTreeData'
import { useArticleStore } from '@/store'
import { setItem, getItem } from '@/utils'
import { SWITCH_FILE, CATEGORY_CHANGE, EDITOR_LOADED, CHANGE_TITLE } from '@/common/symbol'

const localTreeData = getItem('category') || sidebar
const lastKey = getItem('lastkey') || ''

const searchKey = ref('')
const selectedNode = ref<SidebarItem | null>(null) // 保证有且只有一个选中的节点
const originTreeData = ref(localTreeData)
const selectedKeys = computed(() => {
  if (selectedNode.value) return [selectedNode.value.key]
  return []
})

const store = useArticleStore()
const { addFile, addFolder, handleDelete, handleRename } = useTreeData(selectedNode, originTreeData)

const treeData = computed(() => {
  const o = originTreeData.value
  if (!searchKey.value) return o
  return searchData(searchKey.value, originTreeData.value)
})

store.loadArticle(lastKey)

// 增删改查操作 都应当触发目录保存
useEventBus(CATEGORY_CHANGE, () => {
  setItem('category', originTreeData.value)
})

// 文章加载完毕 切换active状态
useEventBus(EDITOR_LOADED, (id: string) => {
  // 选中当前文章对应的节点
  // selectedNode修改后 会触发selectedKeys的计算 进而修改视图
  selectedNode.value = findNodeByKey(id, originTreeData.value)
})

// 当前文章标题修改 同步到侧栏展示和本地存储
useEventBus(CHANGE_TITLE, ({ id, title }: { id: string; title: string }) => {
  const node = findNodeByKey(id, originTreeData.value)
  if (node) {
    node.title = title
    setItem('category', originTreeData.value)
  }
})

watch(selectedNode, (val) => {
  // 选中的节点是文件
  if (val && !val.children) {
    // 触发事件总线
    $emit(SWITCH_FILE, {
      id: val.key,
      title: val.title
    })

    // 更新本地存储的上次预览内容
    setItem('lastkey', val.key)
  }
})

function handleSelect(_: string[], data: any) {
  selectedNode.value = data.node
}

// 遍历树，检索匹配的节点
// 根据Node.title的内容匹配关键字
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

function findNodeByKey(key: string, treeData: SidebarItem[]) {
  const loop = (data: any[]) => {
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      if (item.key === key) {
        return item
      } else if (item.children) {
        const filterData = loop(item.children)
        if (filterData) {
          return filterData
        }
      }
    }
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
