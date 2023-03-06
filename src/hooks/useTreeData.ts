import { Ref, h } from 'vue'
import { Message, Modal, Input } from '@arco-design/web-vue'
import { SidebarItem } from '@/data/sidebar'
import { $emit } from '@/hooks/useEventBus'
import {
  CREATE_FILE,
  CREATE_FOLDER,
  DELETE_FILE,
  DELETE_FOLDER,
  RENAME_FILE,
  RENAME_FOLDER,
  SWITCH_FILE,
  CATEGORY_CHANGE
} from '@/common/symbol'

const DEFAULT_FILE_NAME = '默认文章'
const DEFAULT_FOLDER_NAME = '新建文件夹'

export function useTreeData(activeNode: Ref<SidebarItem | null>, treeData: Ref<SidebarItem[]>) {
  function preCheck() {
    if (!activeNode.value) {
      Message.error('请先选择一个文章或文件夹')
      return false
    }
    return true
  }

  /**
   * 添加文件到当前目录
   */
  function addFile() {
    const res = preCheck()
    if (!res) return

    const key = Date.now().toString()

    // 如果当前节点是文件夹 则添加到当前节点下
    if (activeNode.value?.children) {
      activeNode.value.children.push({
        title: DEFAULT_FILE_NAME,
        key
      })
      $emit(CREATE_FILE, key)
      $emit(CATEGORY_CHANGE)
      Message.success('创建成功')
    } else {
      // 如果当前节点是文件 则添加到当前节点的父节点下
      const parent = findParent(activeNode.value!.key, treeData.value)
      if (parent.length) {
        parent[0].children?.push({
          title: DEFAULT_FILE_NAME,
          key
        })
        $emit(CREATE_FILE, key)
        $emit(CATEGORY_CHANGE)
        Message.success('创建成功')
      }
    }
  }

  /**
   * 添加文件夹到当前目录
   */
  function addFolder() {
    const res = preCheck()
    if (!res) return

    const t = Date.now()

    // 如果当前节点是文件夹 则添加到当前节点下
    if (activeNode.value?.children) {
      activeNode.value.children.push({
        title: DEFAULT_FOLDER_NAME,
        key: t.toString(),
        children: [
          {
            title: DEFAULT_FILE_NAME,
            key: (t + 1).toString()
          }
        ]
      })
      $emit(CREATE_FOLDER, t.toString())
      $emit(CATEGORY_CHANGE)
      Message.success('创建成功')
    } else {
      // 如果当前节点是文件 则添加到当前节点的父节点下
      const parent = findParent(activeNode.value!.key, treeData.value)

      if (parent.length) {
        parent[0].children?.push({
          title: DEFAULT_FOLDER_NAME,
          key: t.toString(),
          children: [
            {
              title: DEFAULT_FILE_NAME,
              key: (t + 1).toString()
            }
          ]
        })
        $emit(CREATE_FOLDER, t.toString())
        $emit(CATEGORY_CHANGE)
        Message.success('创建成功')
      }
    }
  }

  /**
   * 删除当前文件或文件夹
   */
  function handleDelete() {
    const res = preCheck()
    if (!res) return

    const node = activeNode.value!

    // 如果当前节点是文件夹 检查文件夹中是否有文件
    // 有文件则提示用户是否删除 无文件则直接删除
    if (activeNode.value?.children) {
      // 当前文件夹中有文件
      if (activeNode.value.children.length) {
        Modal.confirm({
          title: '当前文件夹中有文件，是否删除？',
          content: '删除后无法恢复',
          onOk() {
            // 删除当前文件夹下的所有文件
            // 同时清理本地存储
            const parent = findParent(node.key, treeData.value)
            console.log(parent)
            if (parent.length) {
              // const index = parent[0].children?.findIndex((item) => item.key === node.key)
              // if (index !== undefined) {
              //   // 获取子节点
              //   const children = parent[0].children?.[index]?.children
              //   // 删除侧栏中数据
              //   parent[0].children?.splice(index, 1)
              //   $emit(DELETE_FOLDER, parent[0].key)
              //   $emit(CATEGORY_CHANGE)
              //   Message.success('删除成功')
              // }
            }
          }
        })
      } else {
        // 无文件 直接删除
        Modal.confirm({
          title: '是否删除当前文件夹？',
          content: '删除后无法恢复',
          onOk() {
            // 删除当前节点
            const parent = findParent(node.key, treeData.value)
            if (parent.length) {
              const index = parent[0].children?.findIndex((item) => item.key === node.key)
              if (index !== undefined) {
                parent[0].children?.splice(index, 1)
                $emit(DELETE_FOLDER, parent[0].key)
                $emit(CATEGORY_CHANGE)
                Message.success('删除成功')
              }
            }
          }
        })
      }
    } else {
      // 当前节点是文件 直接删除
      Modal.confirm({
        title: '是否删除当前文件？',
        content: '删除后无法恢复',
        onOk() {
          // 删除当前节点
          const parent = findParent(node.key, treeData.value)
          if (parent.length) {
            const index = parent[0].children?.findIndex((item) => item.key === node.key)
            if (index !== undefined) {
              parent[0].children?.splice(index, 1)
              $emit(DELETE_FILE, parent[0].key)
              $emit(CATEGORY_CHANGE)
              Message.success('删除成功')
            }
          }
        }
      })
    }
  }

  /**
   * 重命名当前文件或文件夹
   */
  function handleRename() {
    const res = preCheck()
    if (!res) return

    const node = activeNode.value!
    let title = activeNode.value!.title

    Modal.info({
      title: `重命名${node.children ? '文件夹' : '文章'}：【${node.title}】`,
      content: () =>
        h(Input, {
          defaultValue: title,
          onInput: (value: string) => {
            title = value
          }
        }),
      onOk() {
        node.title = title
        // 文件和文件名都用这一个Symbol? 反正都一样
        $emit(RENAME_FILE, node.key)
        $emit(CATEGORY_CHANGE)
        Message.success('重命名成功')
      }
    })
  }

  return {
    addFile,
    addFolder,
    handleDelete,
    handleRename
  }
}

// 遍历树，找到匹配的节点的最近父节点
export function findParent(key: string, treeData: SidebarItem[]): SidebarItem[] {
  const parent: SidebarItem[] = []
  treeData.forEach((item) => {
    if (item.children) {
      if (item.children.some((child) => child.key === key)) {
        parent.push(item)
      } else {
        parent.push(...findParent(key, item.children))
      }
    }
  })
  return parent
}
