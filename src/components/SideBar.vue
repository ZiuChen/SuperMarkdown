<template>
  <div class="side-bar">
    <a-input
      class="search"
      v-model="searchKey"
      @keydown.esc="clearKeyword"
      placeholder="检索文章标题"
      allow-clear
    >
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
          <a-doption @click="handleImportClick">
            <template #icon>
              <icon-import />
            </template>
            导入文档
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
import { Message } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'
import { sidebar, SidebarItem } from '@/data/sidebar'
import { useArticleImport } from '@/hooks/useArticleImport'
import { useEventListener } from '@/hooks/useEventListener'
import { $emit, useEventBus } from '@/hooks/useEventBus'
import { useTreeData, findNodeByKey, collectAllParentKeys, filterNode } from '@/hooks/useTreeData'
import { useTreeDrag } from '@/hooks/useTreeDrag'
import { useImageUpload } from '@/hooks/useImageUpload'
import { useArticleStore } from '@/store'
import {
  setItem,
  getItem,
  removeItem,
  getFeatures,
  removeFeature,
  readFilesData,
  saveArticle
} from '@/utils'
import {
  SWITCH_FILE,
  CATEGORY_CHANGE,
  EDITOR_LOADED,
  CHANGE_TITLE,
  DELETE_FILE,
  DELETE_FOLDER,
  ENTER_FILE,
  ENTER_CREATE,
  ENTER_IMPORT,
  ENTER_CONTENT,
  IMPORT_CONTENT_FLAG,
  RENAME_NODE,
  FOCUS_EDITOR
} from '@/common/symbol'
import { IPayloadFile } from '@/types'

const localTreeData = getItem('category') || sidebar

const searchKey = ref('')
const selectedNode = ref<SidebarItem | null>(null) // 保证有且只有一个选中的节点
const originTreeData = ref(localTreeData)
const expandedKeys = ref<string[]>([])

// 收集所有节点的key
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

// 当前已选中节点的key 单选 所以只有一个selectedNode.value.key
const selectedKeys = computed(() => {
  if (selectedNode.value) return [selectedNode.value.key]
  return []
})

const router = useRouter()
const store = useArticleStore()
const { addFile, addFolder, handleDelete, handleRename, patchFileExternal } = useTreeData(
  selectedNode,
  originTreeData
)
const { drop } = useTreeDrag(originTreeData)

// 真实展示在view中的数据
const treeData = computed(() => {
  const o = originTreeData.value
  if (!searchKey.value) return o
  return filterNode(searchKey.value, originTreeData.value)
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
useEventBus(ENTER_FILE, (key: string) => {
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

// 通过全局关键字创建文章
useEventBus(ENTER_CREATE, () => {
  addFile()
})

// 通过全局关键字导入.md文件
// 此操作只会在Electron环境触发
useEventBus(ENTER_IMPORT, async (payload: IPayloadFile[]) => {
  return Promise.resolve(payload)
    .then((payload) => {
      const files = payload.map((item) => item.path)
      if (!files || !files.length) return []
      return files
    })
    .then((files) => readFilesData(files))
    .then((fileList) => {
      if (!fileList || !fileList.length) return []

      return handleArticleImport(fileList)
    })
    .then((nodeList) => {
      const len = nodeList.length
      if (!len) return

      // 选中导入的最后一个文章
      const node = nodeList[len - 1]
      if (node) selectedNode.value = node
    })
})

// 从文本/图片创建带内容的文档
useEventBus(ENTER_CONTENT, async ({ type, payload }: { type: string; payload: string }) => {
  // 文本内容
  if (type === 'over') {
    // 纯文本 正常导入
    const nodeList = handleArticleImport([
      {
        title: '导入的文章',
        data: payload
      }
    ])

    const len = nodeList.length
    if (!len) return

    // 选中导入的最后一个文章
    const node = nodeList[len - 1]
    if (node) selectedNode.value = node

    return
  }

  // 图片内容 上传图片
  if (type === 'img') {
    useImageUpload(payload).then((hash) => {
      if (!hash) return Message.error('图片上传失败')

      const nodeList = handleArticleImport([
        {
          title: '导入的文章',
          data: `![导入的图片](attachment:${hash})`
        }
      ])

      const len = nodeList.length
      if (!len) return

      // 选中导入的最后一个文章
      const node = nodeList[len - 1]
      if (node) selectedNode.value = node
    })
    return
  }

  // 结构化数据
  if (type === 'regex') {
    // 检查是否为结构化数据
    if (payload.startsWith(IMPORT_CONTENT_FLAG.description!)) {
      const data = payload.replace(IMPORT_CONTENT_FLAG.description!, '')
      try {
        type TContentList = {
          type: 'text' | 'image'
          data: string
        }[]

        const res = []
        const contentList: TContentList = JSON.parse(data)

        for (const item of contentList) {
          if (item.type === 'image') {
            const hash = await useImageUpload(item.data)
            if (!hash) Message.error('图片上传失败')
            else res.push(`![导入的图片](attachment:${hash})`)
          } else {
            res.push(item.data)
          }
        }

        const nodeList = handleArticleImport([
          {
            title: '导入的文章',
            data: res.join('\n')
          }
        ])

        const len = nodeList.length
        if (!len) return

        // 选中导入的最后一个文章
        const node = nodeList[len - 1]
        if (node) selectedNode.value = node
      } catch (error) {
        Message.error('导入的数据格式有误: ' + error)
      }
      return
    }
  }
})

// 处理文件删除事件
// 删除完成后直接失焦 提醒用户自己切换文章
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

useEventBus(RENAME_NODE, (key: string) => {
  const node = findNodeByKey(key, originTreeData.value)
  if (!node) return

  // 重命名的节点是文章 需要将修改同步到文章标题
  if (!node?.children) {
    store.title = node.title
  }
})

watch(selectedNode, (val) => {
  if (!val) return

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
    // 展开当前文件夹
    if (!expandedKeys.value.includes(val.key)) {
      expandedKeys.value = [...expandedKeys.value, val.key]
    }

    // 切换当前编辑器状态
    store.isEmpty = true
  }
})

// 每次聚焦时 都从本地存储获取最新的侧栏数据
useEventListener(window, 'focus', () => {
  const data = getItem('category')
  if (data) {
    originTreeData.value = data
  }
})

/**
 * 处理在搜索框中按下ESC的行为
 * 清空搜索框
 */
function clearKeyword(ev: KeyboardEvent) {
  if (searchKey.value) {
    searchKey.value = ''
    ev.stopPropagation()
  }
}

/**
 * 选中树中的节点时触发
 * handleSelect => selectedNode => watch(selectedNode)
 */
function handleSelect(_: any, data: any) {
  // 更新当前激活的节点
  selectedNode.value = data.node

  // 选中的节点是文章 需要聚焦编辑器
  if (!data.node?.children) $emit(FOCUS_EDITOR)
}

/**
 * 切换侧栏展开状态
 */
function toggleExpanded() {
  expandedKeys.value = expandedKeys?.value.length ? [] : allExpandedKeys.value
}

/**
 * 批量导入按钮点击
 */
function handleImportClick() {
  // 弹窗进行文件选择
  const promise = useArticleImport()

  promise
    .then((fileList) => handleArticleImport(fileList))
    .then((nodeList) => {
      const len = nodeList.length
      if (!len) return

      // 选中导入的最后一个文章
      const node = nodeList[len - 1]
      if (node) selectedNode.value = node
    })
    .catch((err) => Message.error(err.message))
}

/**
 * 将文件patch到侧栏 并保存到本地存储
 */
function handleArticleImport(fileList: { title: string; data: string }[]) {
  if (!fileList || !fileList.length) return []

  // 将fileList添加到侧栏 并获取到带key的nodeList
  const nodeList = patchFileExternal(fileList)

  if (!nodeList || !nodeList.length) {
    Message.error('导入出错')
    return []
  }

  for (const node of nodeList) {
    saveArticle({
      id: node.key,
      title: node.title,
      code: node.data,
      lastSavedAt: parseInt(node.key),
      createAt: parseInt(node.key)
    })
  }

  Message.success('导入成功')

  return nodeList
}
</script>

<style lang="less" scoped>
@import '@/style/scrollbar.less';

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
  height: 100%;
  width: 100%;
  align-self: flex-start;
  overflow: auto;
  .scrollbar();

  :deep(.arco-tree-node-title) {
    font-size: 13px;
  }
}
</style>
