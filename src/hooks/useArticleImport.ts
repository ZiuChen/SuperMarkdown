import { isElectron } from '@/utils'
import { Message } from '@arco-design/web-vue'
import { basename, extname, readFileSync } from '@/preload'

const FILE_NOT_NAMED = '导入的文章'
const FILE_NOT_SELECTED = '操作已取消'
const FILE_SELECT_TITLE = '选择要导入的 Markdown 文件'
const FILE_IMPORTING = '导入中'

export interface IFileImport {
  title: string
  data: string
}

export function useArticleImport() {
  return isElectron ? readFilesInElectron() : readFilesInBrowser()
}

/**
 * Electron环境下批量读取文件
 */
async function readFilesInElectron(): Promise<IFileImport[]> {
  return new Promise((resolve) => {
    const files = utools.showOpenDialog({
      title: FILE_SELECT_TITLE,
      filters: [{ name: 'Markdown', extensions: ['md'] }],
      properties: ['openFile', 'multiSelections']
    })

    if (!files || !files.length) {
      Message.warning(FILE_NOT_SELECTED)
      return resolve([])
    }

    const msgHandler = Message.info({
      content: FILE_IMPORTING,
      duration: 0
    })

    const res: IFileImport[] = []

    for (let i = 0; i < files.length; i++) {
      const fpath = files[i]
      const title = basename(fpath, extname(fpath))
      const data = readFileSync(fpath, 'utf-8')

      res.push({
        title,
        data
      })
    }

    msgHandler.close()

    resolve(res)
  })
}

/**
 * 浏览器环境下批量读取文件
 */
async function readFilesInBrowser(): Promise<IFileImport[]> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = '.md'

    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files

      if (!files || !files.length) {
        Message.warning(FILE_NOT_SELECTED)
        return resolve([])
      }

      const msgHandler = Message.info({
        content: FILE_IMPORTING,
        duration: 0
      })

      const res: IFileImport[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const title = file.name.slice(0, -3) || FILE_NOT_NAMED
        const data = await readAsText(file)

        res.push({
          title,
          data
        })
      }

      msgHandler.close()

      resolve(res)
    }

    input.click()
  })
}

/**
 * 浏览器环境下将Blob读取为文本
 * 本质上是FileReader的Promise封装
 */
async function readAsText(blob: Blob): Promise<string> {
  const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.onerror = reject
    reader.readAsText(blob)
  })
}
