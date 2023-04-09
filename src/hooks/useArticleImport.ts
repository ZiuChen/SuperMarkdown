import { isElectron, readFilesData } from '@/utils'
import { Message } from '@arco-design/web-vue'

const FILE_NOT_SELECTED = '操作已取消'
const FILE_SELECT_TITLE = '选择要导入的 Markdown 文件'
const FILE_IMPORTING = '导入中'

export interface IFileImport {
  title: string
  data: string
}

export function useArticleImport() {
  return isElectron ? getFileListInElectron() : getFileListInBrowser()
}

/**
 * Electron环境下获取文件列表
 * 弹出文件选框 选择文件并批量读取文件 组织为带数据的fileList
 */
async function getFileListInElectron(): Promise<IFileImport[]> {
  return new Promise(async (resolve) => {
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

    const res = await readFilesData(files)

    msgHandler.close()

    resolve(res)
  })
}

/**
 * 浏览器环境下获取文件列表
 * 弹出文件选框 选择文件并批量读取文件 组织为带数据的fileList
 */
async function getFileListInBrowser(): Promise<IFileImport[]> {
  return new Promise(async (resolve) => {
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

      const res = await readFilesData(files)

      msgHandler.close()

      resolve(res)
    }

    input.click()
  })
}
