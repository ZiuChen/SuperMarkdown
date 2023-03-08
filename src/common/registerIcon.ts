import { App } from 'vue'
import {
  IconFile,
  IconFolderAdd,
  IconDelete,
  IconEdit,
  IconDoubleDown,
  IconDoubleUp,
  IconRecord,
  IconDown,
  IconFolder,
  IconMore,
  IconShareExternal,
  IconLock,
  IconInfoCircle,
  IconSettings
} from '@arco-design/web-vue/es/icon'

const icons = [
  IconFile,
  IconFolderAdd,
  IconDelete,
  IconEdit,
  IconDoubleDown,
  IconDoubleUp,
  IconRecord,
  IconDown,
  IconFolder,
  IconMore,
  IconShareExternal,
  IconLock,
  IconInfoCircle,
  IconSettings
]

export function registerIcon(app: App) {
  for (const icon of icons) {
    app.component(icon.name, icon)
  }
}
