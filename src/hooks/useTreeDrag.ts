import { SidebarItem } from '@/data/sidebar'
import { $emit } from '@/hooks/useEventBus'
import { CATEGORY_CHANGE } from '@/common/symbol'

export function useTreeDrag(treeData: Ref<SidebarItem[]>) {
  function dragStart(ev: DragEvent, node: SidebarItem) {}
  function dragOver(ev: DragEvent, node: SidebarItem) {}
  function dragLeave(ev: DragEvent, node: SidebarItem) {}

  function drop({
    dragNode,
    dropNode,
    dropPosition
  }: {
    dragNode: any // SidebarItem
    dropNode: any // SidebarItem
    dropPosition: any // number
  }) {
    const data = treeData.value
    const loop = (data: any, key: string, callback: any) => {
      // @ts-ignore
      data.some((item, index, arr) => {
        if (item.key === key) {
          callback(item, index, arr)
          return true
        }
        if (item.children) {
          return loop(item.children, key, callback)
        }
        return false
      })
    }

    // @ts-ignore
    loop(data, dragNode.key, (_, index, arr) => {
      arr.splice(index, 1)
    })

    if (dropPosition === 0) {
      loop(data, dropNode.key, (item: any) => {
        item.children = item.children || []
        item.children.push(dragNode)
      })
    } else {
      // @ts-ignore
      loop(data, dropNode.key, (_, index, arr) => {
        arr.splice(dropPosition < 0 ? index : index + 1, 0, dragNode)
      })
    }

    // 触发侧栏目录树保存到本地
    $emit(CATEGORY_CHANGE)
  }

  return {
    dragStart,
    dragOver,
    dragLeave,
    drop
  }
}
