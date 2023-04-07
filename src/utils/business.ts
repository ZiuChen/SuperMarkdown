/**
 * 业务相关工具函数
 */

import { isElectron, getAttachment, setItem } from '@/utils'
import { IArticleSaveExtend } from '@/types'
import { Buffer } from '@/preload'

export function loadImage(docId: string) {
  if (!isElectron) return ''

  const res = getAttachment('attachment/' + docId)
  if (res) return 'data:image/png;base64,' + Buffer.from(res).toString('base64')
  return ''
}

export function openLink(url: string) {
  if (isElectron) {
    utools.shellOpenExternal(url)
  } else {
    window.open(url)
  }
}

/**
 * 对文章保存操作做一次封装
 * 便于类型约束
 */
export function saveArticle(article: IArticleSaveExtend) {
  const key = `note/${article.id}`
  setItem(key, article)
}
