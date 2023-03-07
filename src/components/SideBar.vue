<template>
  <div class="side-bar">
    <a-input-search class="search" v-model="searchKey" placeholder="检索文章标题" />

    <div class="btn-list">
      <a-button title="新文章" @click="addFile">
        <template #icon>
          <icon-file />
        </template>
      </a-button>
      <a-button title="新文件夹" @click="addFolder">
        <template #icon>
          <icon-folder-add />
        </template>
      </a-button>
      <a-button title="删除" @click="handleDelete">
        <template #icon>
          <icon-delete />
        </template>
      </a-button>
      <a-button title="重命名" @click="handleRename">
        <template #icon>
          <icon-edit />
        </template>
      </a-button>
      <a-button :title="expandedKeys.length ? '折叠' : '展开'" @click="toggleExpanded">
        <template #icon>
          <icon-double-down v-if="expandedKeys.length" />
          <icon-double-up v-else />
        </template>
      </a-button>
      <a-button class="words">文章字数:</a-button>
    </div>

    <a-tree
      :data="treeData"
      :selected-keys="selectedKeys"
      v-model:expanded-keys="expandedKeys"
      @select="handleSelect"
      @drop="drop"
      :allow-drop="
        ({ dropNode }) => {
          if (dropNode.children) {
            return true
          }
          return false
        }
      "
      showLine
      draggable
      block-node
    >
      <template #switcher-icon="node, { isLeaf }">
        <IconDown v-if="!isLeaf"></IconDown>
        <template v-else>
          <IconFile v-if="node?.children === undefined"></IconFile>
          <IconFolder v-else></IconFolder>
        </template>
      </template>
    </a-tree>
  </div>
</template>

<script setup lang="ts">
import { sidebar, SidebarItem } from '@/data/sidebar'
import { $emit, useEventBus } from '@/hooks/useEventBus'
import { useTreeData, findParent } from '@/hooks/useTreeData'
import { useTreeDrag } from '@/hooks/useTreeDrag'
import { useArticleStore } from '@/store'
import { setItem, getItem } from '@/utils'
import {
  SWITCH_FILE,
  CATEGORY_CHANGE,
  EDITOR_LOADED,
  CHANGE_TITLE,
  CREATE_FILE,
  CREATE_FOLDER,
  DELETE_FILE,
  DELETE_FOLDER
} from '@/common/symbol'

const localTreeData = getItem('category') || sidebar
const lastKey = getItem('lastkey') || ''

const searchKey = ref('')
const selectedNode = ref<SidebarItem | null>(null) // 保证有且只有一个选中的节点
const originTreeData = ref(localTreeData)
const expandedKeys = ref([])
const allExpandedKeys = computed(() => {
  const keys: string[] = []
  const loop = (data: SidebarItem[]) => {
    data.forEach((item) => {
      keys.push(item.key)
      if (item.children) {
        loop(item.children)
      }
    })
  }
  loop(originTreeData.value)
  return keys
})

const selectedKeys = computed(() => {
  if (selectedNode.value) return [selectedNode.value.key]
  return []
})

const store = useArticleStore()
const { addFile, addFolder, handleDelete, handleRename } = useTreeData(selectedNode, originTreeData)
const { drop } = useTreeDrag(originTreeData)

// 真实展示在view中的数据
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
  const node = findNodeByKey(id, originTreeData.value)
  selectedNode.value = node

  // 展开当前文章对应的父节点
  const parent = findParent(node, originTreeData.value)
  if (parent) {
    expandedKeys.value = [parent.key]
  }
})

// 当前文章标题修改 同步到侧栏展示和本地存储
useEventBus(CHANGE_TITLE, ({ id, title }: { id: string; title: string }) => {
  const node = findNodeByKey(id, originTreeData.value)
  if (node) {
    node.title = title
    setItem('category', originTreeData.value)
  }
})

// 处理创建文件 | 文件夹事件 新建完成后自动切换到新建的文件
useEventBus(CREATE_FILE, (key: string) => {
  selectedNode.value = findNodeByKey(key, originTreeData.value)
})
useEventBus(CREATE_FOLDER, (key: string) => {
  // 创建文件夹传递来的是文件夹的key
  const parent = findNodeByKey(key, originTreeData.value)
  if (parent) {
    selectedNode.value = parent.children?.[0]
  }
})

// 处理删除文件 | 文件夹事件 删除完成后自动切换到上一个文件
// 如果上一个文件不存在 则向上查找
// 入参key为被删除节点的父节点的key
useEventBus(DELETE_FILE, (key: string) => {
  // 找到父节点
  const node = findNodeByKey(key, originTreeData.value)
  if (node && node.children.length > 0) {
    // 选中父节点中的第一个节点
    selectedNode.value = node.children[0]
  }
})
useEventBus(DELETE_FOLDER, (key: string) => {
  const node = findNodeByKey(key, originTreeData.value)
  if (node && node.children.length > 0) {
    selectedNode.value = node.children[0]
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
  } else {
    // 选中的节点是文件夹
    // 触发事件总线
    $emit(SWITCH_FILE, {
      id: '',
      title: ''
    })
  }
})

function handleSelect(_: any, data: any) {
  // 如果是文件夹 则不选中 直接展开
  if (data.node.children) {
    // 将当前节点的key添加到expandedKeys中
    // @ts-ignore
    expandedKeys.value = expandedKeys.value.includes(data.node.key)
      ? expandedKeys.value.filter((item: string) => item !== data.node.key)
      : [...expandedKeys.value, data.node.key]
  }
  selectedNode.value = data.node
}

function toggleExpanded() {
  // @ts-ignore
  expandedKeys.value = expandedKeys?.value.length ? [] : allExpandedKeys.value
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
  const loop: (...args: any[]) => any = (data: SidebarItem[]) => {
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
  background-color: var(--bg-color);
  .search {
    width: 100%;
  }

  .btn-list {
    display: flex;
    .words {
      flex: 1;
    }
  }
}
</style>
