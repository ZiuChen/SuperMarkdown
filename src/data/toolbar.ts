import Vditor from 'vditor'
import { useImageUpload } from '@/hooks/useImageUpload'

export const toolbar = [
  'headings',
  'bold',
  'italic',
  'strike',

  '|',

  {
    name: 'quote',
    icon: `<svg t="1677846710477" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20756" width="250" height="250"><path d="M597.333333 725.333333h128l85.333334-170.666666V298.666667h-256v256h128M256 725.333333h128l85.333333-170.666666V298.666667H213.333333v256h128l-85.333333 170.666666z" fill="" p-id="20757"></path></svg>`
  },
  'link',

  'inline-code',
  'code',
  'line',

  '|',

  'list',
  'ordered-list',
  'check',
  {
    name: 'image',
    icon: `<svg t="1678596939661" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20947" width="128" height="128"><path d="M362.666667 576l106.666666 128 149.333334-192 192 256H213.333333m682.666667 42.666667V213.333333a85.333333 85.333333 0 0 0-85.333333-85.333333H213.333333a85.333333 85.333333 0 0 0-85.333333 85.333333v597.333334a85.333333 85.333333 0 0 0 85.333333 85.333333h597.333334a85.333333 85.333333 0 0 0 85.333333-85.333333z" fill="" p-id="20948"></path></svg>`,
    tip: '上传图片',
    tipPosition: 'n',
    async click() {
      const imgData = await useImageUpload()
      if (!imgData) return
    }
  },
  'table',

  'undo',
  'redo',

  '|',

  {
    name: 'only-edit',
    icon: `<svg t="1678009164870" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20789" width="128" height="128"><path d="M512 384a128 128 0 0 0-128 128 128 128 0 0 0 128 128 128 128 0 0 0 128-128 128 128 0 0 0-128-128m0 341.333333a213.333333 213.333333 0 0 1-213.333333-213.333333 213.333333 213.333333 0 0 1 213.333333-213.333333 213.333333 213.333333 0 0 1 213.333333 213.333333 213.333333 213.333333 0 0 1-213.333333 213.333333m0-533.333333C298.666667 192 116.48 324.693333 42.666667 512c73.813333 187.306667 256 320 469.333333 320s395.52-132.693333 469.333333-320c-73.813333-187.306667-256-320-469.333333-320z" fill="" p-id="20790"></path></svg>`,
    tip: '预览区可见性',
    tipPosition: 'n',
    click() {
      const d = document.querySelector('.vditor-preview') as HTMLElement
      if (d.style.display === 'block') {
        d.style.display = 'none'
      } else {
        d.style.display = 'block'
      }
    }
  },

  'fullscreen',
  'edit-mode',
  'export'
]
