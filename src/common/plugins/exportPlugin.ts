import type { BytemdPlugin } from 'bytemd'

export function exportPlugin(): BytemdPlugin {
  return {
    actions: [
      {
        title: '导出',
        icon: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="arco-icon arco-icon-export" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" filter="" data-v-249840b0="" style="font-size: 32px;"><path d="M31.928 33.072 41 24.002l-9.072-9.072M16.858 24h24M31 41H7V7h24"></path></svg>',
        position: 'right',
        handler: {
          type: 'dropdown',
          actions: [
            {
              title: '导出为 Markdown',
              icon: '',
              handler: {
                type: 'action',
                click: (ctx) => {
                  console.log('export markdown')
                }
              }
            },
            {
              title: '导出为 HTML',
              icon: '',
              handler: {
                type: 'action',
                click: (ctx) => {
                  console.log('export html')
                }
              }
            },
            {
              title: '导出为 PDF',
              icon: '',
              handler: {
                type: 'action',
                click: (ctx) => {
                  console.log('export pdf')
                }
              }
            }
          ]
        }
      }
    ]
  }
}
