import { App } from 'vue'
import { IconFile, IconFolderAdd, IconDelete, IconEdit } from '@arco-design/web-vue/es/icon'

const icons = [IconFile, IconFolderAdd, IconDelete, IconEdit]

export function registerIcon(app: App) {
  for (const icon of icons) {
    app.component(icon.name, icon)
  }
}
