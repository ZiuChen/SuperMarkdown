import { Ref, h } from 'vue'
import { Message, Modal, Input } from '@arco-design/web-vue'
import { SidebarItem } from '@/data/sidebar'

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

    // 如果当前节点是文件夹 则添加到当前节点下
    if (activeNode.value?.children) {
      activeNode.value.children.push({
        title: '新建文件',
        key: Date.now().toString()
      })
      Message.success('创建成功')
    } else {
      // 如果当前节点是文件 则添加到当前节点的父节点下
      const parent = findParent(activeNode.value.key, treeData.value)
      console.log('parent', parent)
      if (parent.length) {
        parent[0].children?.push({
          title: '新建文件',
          key: Date.now().toString()
        })
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
        title: '新建文件夹',
        key: t.toString(),
        children: [
          {
            title: '新建文件',
            key: (t + 1).toString()
          }
        ]
      })
      Message.success('创建成功')
    } else {
      // 如果当前节点是文件 则添加到当前节点的父节点下
      const parent = findParent(activeNode.value.key, treeData.value)

      if (parent.length) {
        parent[0].children?.push({
          title: '新建文件夹',
          key: t.toString(),
          children: [
            {
              title: '新建文件',
              key: (t + 1).toString()
            }
          ]
        })
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

    // 如果当前节点是文件夹 检查文件夹中是否有文件
    // 有文件则提示用户是否删除 无文件则直接删除
    if (activeNode.value?.children) {
      // 当前文件夹中有文件
      if (activeNode.value.children.length) {
        Modal.confirm({
          title: '当前文件夹中有文件，是否删除？',
          content: '删除后无法恢复',
          onOk() {
            // 删除当前节点
            const parent = findParent(activeNode.value.key, treeData.value)
            if (parent.length) {
              const index = parent[0].children?.findIndex(
                (item) => item.key === activeNode.value!.key
              )
              if (index !== undefined) {
                parent[0].children?.splice(index, 1)
                Message.success('删除成功')
              }
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
            const parent = findParent(activeNode.value.key, treeData.value)
            if (parent.length) {
              const index = parent[0].children?.findIndex(
                (item) => item.key === activeNode.value!.key
              )
              if (index !== undefined) {
                parent[0].children?.splice(index, 1)
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
          const parent = findParent(activeNode.value.key, treeData.value)
          if (parent.length) {
            const index = parent[0].children?.findIndex(
              (item) => item.key === activeNode.value!.key
            )
            if (index !== undefined) {
              parent[0].children?.splice(index, 1)
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

    let title = activeNode.value.title
    console.log(title)

    Modal.info({
      title: '重命名',
      content: () =>
        h(Input, {
          defaultValue: title,
          onInput: (value: string) => {
            title = value
          }
        }),
      onOk() {
        activeNode.value.title = title
        Message.success('重命名成功')
      }
    })

    // const title = window.prompt('请输入新的文件名', activeNode.value.title)
    // if (title) {
    //   activeNode.value.title = title
    //   Message.success('重命名成功')
    // }
  }

  return {
    addFile,
    addFolder,
    handleDelete,
    handleRename
  }
}

// 遍历树，找到匹配的节点的最近父节点
function findParent(key: string, treeData: SidebarItem[]): SidebarItem[] {
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
