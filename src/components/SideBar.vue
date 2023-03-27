<template>
  <div class="side-bar">
    <a-input class="search" v-model="searchKey" placeholder="检索文章标题" allow-clear>
      <template #prefix>
        <icon-search />
      </template>
    </a-input>

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
          <icon-double-up v-if="expandedKeys.length" />
          <icon-double-down v-else />
        </template>
      </a-button>

      <a-dropdown :popup-max-height="false">
        <a-button class="drop-down">更多</a-button>
        <template #content>
          <a-doption
            @click="
              router.push({
                path: '/setting'
              })
            "
          >
            <template #icon>
              <icon-settings />
            </template>
            全局设置
          </a-doption>
          <a-doption
            @click="
              router.push({
                path: '/about'
              })
            "
          >
            <template #icon>
              <icon-info-circle />
            </template>
            关于
          </a-doption>
        </template>
      </a-dropdown>
    </div>

    <a-tree
      :data="treeData"
      :selected-keys="selectedKeys"
      v-model:expanded-keys="expandedKeys"
      @select="handleSelect"
      @drop="drop"
      :allow-drop="
        ({ dropNode, dropPosition }) => {
          if (dropNode.children) {
            return true
          }
          // 不允许向子节点内部拖拽 但是-1 | 1可以修改顺序
          return dropPosition !== 0
        }
      "
      showLine
      draggable
      block-node
    >
      <template
        #switcher-icon="// @ts-ignore
        node,
        { isLeaf }"
      >
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
import { useTreeData, findNodeByKey, collectAllParentKeys } from '@/hooks/useTreeData'
import { useTreeDrag } from '@/hooks/useTreeDrag'
import { useArticleStore } from '@/store'
import { setItem, getItem, removeItem, getFeatures, removeFeature } from '@/utils'
import {
  SWITCH_FILE,
  CATEGORY_CHANGE,
  EDITOR_LOADED,
  CHANGE_TITLE,
  CREATE_FILE,
  CREATE_FOLDER,
  DELETE_FILE,
  DELETE_FOLDER,
  FILE_ENTER
} from '@/common/symbol'
import { Message } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'

const localTreeData = getItem('category') || sidebar

const searchKey = ref('')
const selectedNode = ref<SidebarItem | null>(null) // 保证有且只有一个选中的节点
const originTreeData = ref(localTreeData)
const expandedKeys = ref<string[]>([])

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

const router = useRouter()
const store = useArticleStore()
const { addFile, addFolder, handleDelete, handleRename } = useTreeData(selectedNode, originTreeData)
const { drop } = useTreeDrag(originTreeData)

// 真实展示在view中的数据
const treeData = computed(() => {
  const o = originTreeData.value
  if (!searchKey.value) return o
  return searchData(searchKey.value, originTreeData.value)
})

// 侧栏初始化后 将当前目录保存
setItem('category', originTreeData.value)

// 增删改查操作 都应当触发目录保存
useEventBus(CATEGORY_CHANGE, () => {
  setItem('category', originTreeData.value)
})

// 文章加载完毕 切换active状态
useEventBus(EDITOR_LOADED, (id: string) => {
  // 选中当前文章对应的节点
  // selectedNode修改后 会触发selectedKeys的计算 进而修改视图
  const node = findNodeByKey(id, originTreeData.value)
  if (!node) return
  selectedNode.value = node

  // 从当前文章向上找到所有父节点 并展开
  const keys = collectAllParentKeys(id, originTreeData.value)
  expandedKeys.value = keys
})

// 当前文章标题修改 同步到侧栏展示和本地存储
useEventBus(CHANGE_TITLE, ({ id, title }: { id: string; title: string }) => {
  const node = findNodeByKey(id, originTreeData.value)
  if (node) {
    node.title = title
    setItem('category', originTreeData.value)
  }
})

// 通过全局关键字进入插件
useEventBus(FILE_ENTER, (key: string) => {
  const node = findNodeByKey(key, originTreeData.value)
  if (!node) {
    // 处理边界情况
    removeFeature(`note/${key}`)
    Message.error('未找到对应文章')
    return
  }

  // 激活侧栏 同时将触发watch 继而$emit(SWITCH_FILE)
  selectedNode.value = node

  // 展开所有相关父节点
  const keys = collectAllParentKeys(key, originTreeData.value)
  expandedKeys.value = keys
})

useEventBus(CREATE_FILE, handleCreate)
useEventBus(CREATE_FOLDER, handleCreate)

// 处理文件删除事件 删除完成后直接失焦 提醒用户自己切换文章
useEventBus(DELETE_FILE, (key: string) => {
  // 从本地存储中删除此文章
  removeItem(`note/${key}`)

  // 删除全局关键字
  if (store.isFeature) {
    removeFeature(`note/${key}`)
  }

  // 切换当前编辑器状态
  store.isEmpty = true
})
useEventBus(DELETE_FOLDER, (keys: string[]) => {
  // 删除文件夹下的所有文件
  const features = getFeatures()
  for (const key of keys) {
    // 删除文章
    removeItem(`note/${key}`)

    // 删除全局关键字

    if (!features) continue

    features.map((feature) => {
      if (feature.code === `note/${key}`) {
        removeFeature(`note/${key}`)
      }
    })
  }
  // 当前选中的是文件夹 已经失焦了 所以不必像DELETE_FILE那样切换状态
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
    // 切换当前编辑器状态
    store.isEmpty = true
  }
})

function handleSelect(_: any, data: any) {
  // 如果是文件夹 则不选中 直接展开
  if (data.node.children) {
    // 将当前节点的key添加到expandedKeys中
    expandedKeys.value = expandedKeys.value.includes(data.node.key)
      ? expandedKeys.value.filter((item: string) => item !== data.node.key)
      : [...expandedKeys.value, data.node.key]
  }
  selectedNode.value = data.node
}

function toggleExpanded() {
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

// 处理创建文件 | 文件夹事件 新建完成后自动切换到新建的文件
// 传递的key都为新建文件的key
function handleCreate(key: string) {
  selectedNode.value = findNodeByKey(key, originTreeData.value)!
  // 展开所有相关节点
  const keys = collectAllParentKeys(key, originTreeData.value)
  expandedKeys.value = keys
}
</script>

<style lang="less" scoped>
.side-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  background-color: var(--bg-color);
  overflow: hidden;
}

.search {
  width: 100%;
}

.btn-list {
  display: flex;
  .drop-down {
    flex: 1;
  }
}

.arco-tree {
  width: 100%;
  align-self: flex-start;
}
</style>
