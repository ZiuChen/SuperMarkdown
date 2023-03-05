import { App } from 'vue'
import {
  IconFile,
  IconFolderAdd,
  IconDelete,
  IconEdit,
  IconDoubleDown,
  IconDoubleUp
} from '@arco-design/web-vue/es/icon'

const icons = [IconFile, IconFolderAdd, IconDelete, IconEdit, IconDoubleDown, IconDoubleUp]

export function registerIcon(app: App) {
  for (const icon of icons) {
    app.component(icon.name, icon)
  }
}
