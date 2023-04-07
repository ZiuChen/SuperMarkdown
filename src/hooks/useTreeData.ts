import { Ref, h } from 'vue'
import { Message, Modal, Input } from '@arco-design/web-vue'
import { SidebarItem } from '@/data/sidebar'
import { $emit } from '@/hooks/useEventBus'
import {
  CREATE_FILE,
  CREATE_FOLDER,
  DELETE_FILE,
  DELETE_FOLDER,
  RENAME_NODE,
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

      // 选中新创建的文件
      activeNode.value = activeNode.value.children[activeNode.value.children.length - 1]

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

        // 选中新创建的文件
        activeNode.value = parent[0].children![parent[0].children!.length - 1]

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
        children: []
      })

      // 选中新创建的文件夹
      activeNode.value = activeNode.value.children[activeNode.value.children.length - 1]

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
          children: []
        })

        // 选中新创建的文件夹
        activeNode.value = parent[0].children![parent[0].children!.length - 1]

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
    if (node?.children) {
      // 检查当前文件夹是否为根节点 且只有一个文件夹
      if (!findParent(node.key, treeData.value).length && treeData.value.length === 1) {
        Message.error('根目录下至少要有一个文件夹')
        return
      }

      // 根节点 且有多个文件夹 允许删除
      if (!findParent(node.key, treeData.value).length && treeData.value.length > 1) {
        // 根节点下有内容 询问用户是否删除
        if (node.children.length) {
          Modal.warning({
            title: '当前文件夹中有文件，是否删除？',
            content: '删除后无法恢复',
            hideCancel: false,
            cancelText: '取消',
            onOk() {
              // 删除当前文件夹下的所有文件
              const index = treeData.value.findIndex((item) => item.key === node.key)
              if (index !== undefined) {
                treeData.value.splice(index, 1)
                $emit(
                  DELETE_FOLDER,
                  node.children!.map((item) => item.key)
                )
                $emit(CATEGORY_CHANGE)
                Message.success('删除成功')
              }
            }
          })
          return
        } else {
          // 当前文件夹中没有内容 直接删除
          const index = treeData.value.findIndex((item) => item.key === node.key)
          if (index !== undefined) {
            treeData.value.splice(index, 1)
            $emit(DELETE_FOLDER, [])
            $emit(CATEGORY_CHANGE)
            Message.success('删除成功')
          }
          return
        }
      }

      if (node.children.length) {
        // 当前文件夹中有内容(文件或文件夹)

        Modal.warning({
          title: '当前文件夹中有内容，是否删除？',
          content: '删除后无法恢复',
          hideCancel: false,
          cancelText: '取消',
          onOk() {
            // 删除当前文件夹下的所有文件
            // 递归收集所有被文件的key
            const keys: string[] = []

            function collectKeys(node: SidebarItem) {
              if (node.children) {
                node.children.forEach((item) => {
                  collectKeys(item)
                })
              } else {
                keys.push(node.key)
              }
            }

            collectKeys(node)

            // 删除当前文件夹
            const parent = findParent(node.key, treeData.value)
            if (parent.length) {
              const index = parent[0].children?.findIndex((item) => item.key === node.key)
              if (index !== undefined) {
                parent[0].children?.splice(index, 1)

                $emit(DELETE_FOLDER, keys)
                $emit(CATEGORY_CHANGE)
                Message.success('删除成功')
              }
            }
          }
        })
      } else {
        // 空文件夹 直接删除
        const parent = findParent(node.key, treeData.value)
        // 有父节点 则找到当前节点并删除
        if (parent.length) {
          const index = parent[0].children?.findIndex((item) => item.key === node.key)
          if (index !== undefined) {
            parent[0].children?.splice(index, 1)
            $emit(
              DELETE_FOLDER,
              node.children!.map((item) => item.key)
            )
            $emit(CATEGORY_CHANGE)
            Message.success('删除成功')
          }
        }
      }
    } else {
      // 当前节点是文件
      Modal.warning({
        title: '是否删除当前文件？',
        content: '删除后无法恢复',
        hideCancel: false,
        cancelText: '取消',
        onOk() {
          // 删除当前节点
          const parent = findParent(node.key, treeData.value)
          if (parent.length) {
            const index = parent[0].children?.findIndex((item) => item.key === node.key)
            if (index !== undefined) {
              parent[0].children?.splice(index, 1)

              // 检查前一个节点是否存在
              if (index - 1 >= 0) {
                // 存在则选中前一个节点
                activeNode.value = parent[0].children![index - 1]
              }

              $emit(DELETE_FILE, node.key)
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

    Modal.confirm({
      title: `重命名${node.children ? '文件夹' : '文章'}：【${node.title}】`,
      cancelText: '取消',
      content: () =>
        h(Input, {
          defaultValue: title,
          onInput: (value: string) => {
            title = value
          }
        }),
      onOk() {
        if (!title) {
          Message.error('标题不能为空')
          return
        }

        if (title.length > 100) {
          Message.error('标题过长')
          return
        }

        // 标题未改变
        if (title === node.title) return

        node.title = title

        $emit(RENAME_NODE, node.key)
        $emit(CATEGORY_CHANGE)
        Message.success('重命名成功')
      }
    })
  }

  function patchFileExternal(fileList: { title: string; data: string }[]) {
    const res = preCheck()
    if (!res) return []

    let key = Date.now()

    // 将titleList转为nodeList
    const nodeList = fileList.map(({ title, data }) => ({
      title,
      data,
      key: (key++).toString()
    }))

    // 当前节点是文件夹
    if (activeNode.value!.children) {
      activeNode.value!.children.push(...nodeList)

      // TODO: 暂时不做导入后的默认选中了
      // // 选中最后一个节点
      // activeNode.value = activeNode.value!.children[activeNode.value!.children.length - 1]
    } else {
      // 当前节点是文件 添加到同级父文件夹
      const parent = findParent(activeNode.value!.key, treeData.value)
      if (parent.length) {
        const index = parent[0].children?.findIndex((item) => item.key === activeNode.value!.key)
        if (index !== undefined) {
          parent[0].children!.push(...nodeList)
        }

        // // 选中最后一个节点
        // activeNode.value = parent[0].children![parent[0].children!.length - 1]
      }
    }

    $emit(CATEGORY_CHANGE)

    return nodeList
  }

  return {
    addFile,
    addFolder,
    handleDelete,
    handleRename,
    patchFileExternal
  }
}

/**
 * 找到key节点的最近父节点
 */
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

/**
 * 找到key节点
 */
export function findNodeByKey(key: string, treeData: SidebarItem[]) {
  const loop: (...args: any[]) => SidebarItem | undefined = (data: SidebarItem[]) => {
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      // 找到匹配的节点
      if (item.key === key) {
        return item
      } else if (item.children?.length) {
        // 继续遍历子节点
        const filterData = loop(item.children)
        if (filterData) {
          return filterData
        }
      }
    }
  }

  return loop(treeData)
}

/**
 * 收集key节点的所有父节点的key
 */
export function collectAllParentKeys(key: string, treeData: SidebarItem[]): string[] {
  const keys = []
  let parent = findParent(key, treeData)
  while (parent.length) {
    keys.push(parent[0].key)
    parent = findParent(parent[0].key, treeData)
  }
  return keys
}

/**
 * 根据关键字过滤节点
 */
export function filterNode(keyword: string, treeData: SidebarItem[]) {
  const loop: (...args: any[]) => SidebarItem[] = (data: SidebarItem[]) => {
    const result: SidebarItem[] = []
    data.forEach((item) => {
      if (item.children) {
        const children = loop(item.children)
        if (children.length) {
          result.push({
            ...item,
            children
          })
        }
      } else if (item.title.includes(keyword)) {
        result.push(item)
      }
    })
    return result
  }

  return loop(treeData)
}
