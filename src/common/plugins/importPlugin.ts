import type { BytemdPlugin } from 'bytemd'

export function importPlugin(): BytemdPlugin {
  return {
    actions: [
      {
        title: '导入 Markdown',
        icon: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="arco-icon arco-icon-download" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" filter="" data-v-249840b0="" style="font-size: 32px;"><path d="m33.072 22.071-9.07 9.071-9.072-9.07M24 5v26m16 4v6H8v-6"></path></svg>',
        position: 'right',
        handler: {
          type: 'action',
          click: ({ editor }) => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = '.md'
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0]
              if (!file) return
              const title = file.name.split('.md')[0]
              const reader = new FileReader()
              reader.onload = (e) => {
                console.log(e.target?.result)
                window.useTreeData.addFile(title)
                editor.setValue(e.target?.result as string)
              }
              reader.readAsText(file)
            }
            input.click()
          }
        }
      }
    ]
  }
}
