/**
 * 业务相关工具函数
 */

import { isElectron, getAttachment, setItem, readAsText } from '@/utils'
import { IArticleSaveExtend } from '@/types'
import { Buffer, basename, extname, readFileSync } from '@/preload'

export function loadImage(docId: string) {
  if (!isElectron) return ''

  const res = getAttachment('attachment/' + docId)
  if (res) return 'data:image/png;base64,' + Buffer.from(res).toString('base64')
  return ''
}

export function openLink(url: string) {
  isElectron ? utools.shellOpenExternal(url) : window.open(url)
}

/**
 * 对文章保存操作做一次封装
 * 便于类型约束
 */
export function saveArticle(article: IArticleSaveExtend) {
  const key = `note/${article.id}`
  setItem(key, article)
}

/**
 *
 * @param files
 * @returns
 */
export async function readFilesData(files: string[] | FileList) {
  if (!files || !files.length) return []

  const res: { title: string; data: string }[] = []

  // 路径数组 在Electron环境下使用readFileSync读取文件内容
  if (typeof files[0] === 'string') {
    for (let i = 0; i < files.length; i++) {
      const fpath = files[i] as string
      const title = basename(fpath, extname(fpath))
      const data = readFileSync(fpath, 'utf-8')

      res.push({
        title,
        data
      })
    }
  } else {
    for (let i = 0; i < files.length; i++) {
      const file = files[i] as File
      const title = file.name.slice(0, -3) || ''
      const data = await readAsText(file)

      res.push({
        title,
        data
      })
    }
  }

  return res
}
