import { isElectron } from './env'
import { Message } from '@arco-design/web-vue'

type TFeature = Parameters<typeof utools.setFeature>[0]
type TDialogOptions = Parameters<typeof utools.showOpenDialog>[0]

export function setFeature(feature: TFeature) {
  if (!isElectron) return
  return utools.setFeature(feature)
}

export function getFeatures(codes?: string[]) {
  if (!isElectron) return
  return utools.getFeatures(codes)
}

export function removeFeature(code: string) {
  if (!isElectron) return
  return utools.removeFeature(code)
}

export function showOpenDialog(options: TDialogOptions): Promise<string[] | FileList | undefined> {
  if (isElectron) {
    return new Promise((resolve) => {
      const res = utools.showOpenDialog(options)
      resolve(res || undefined)
    })
  } else {
    return new Promise((resolve) => {
      const isMultiple = !!options.properties?.includes('multiSelections')
      const input = document.createElement('input')
      input.type = 'file'
      input.multiple = isMultiple

      // TODO: 目前只接受图片 适用性较差
      input.accept =
        options.filters
          ?.map((item) => item.extensions.map((ext) => `image/${ext}`).join(','))
          .join(',') || ''

      input.click()
      input.onchange = () => {
        const files = input.files || undefined

        if (!files) return

        // 检查文件类型
        if (options.filters) {
          const extensions = options.filters
            .map((item) => item.extensions)
            .flat()
            .map((ext) => ext.toLowerCase())

          for (let i = 0; i < files.length; i++) {
            const file = files?.item(i)
            if (file && !extensions.includes(file.name.split('.').pop()?.toLowerCase() || '')) {
              Message.error('文件类型不符合要求')
              return
            }
          }
        }

        resolve(input.files || undefined)
      }
      input.onabort = () => {
        resolve(undefined)
      }
    })
  }
}
