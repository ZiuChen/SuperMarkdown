import { createClient, readFileSync, gzipSync, unzipSync, writeFile } from '@/preload'
import { FILE_NAME } from '@/global/setting'
import setting from '@/global/setting'

const WORK_DIR = '/SuperClipboardData'

// 客户端构造函数
export const Client = function () {
  const { url, username, password } = setting.advance.webDav
  return createClient(url, {
    username,
    password
  })
}

// 检查WebDav是否可用
export async function validServer({
  url,
  username,
  password
}: {
  url: string
  username: string
  password?: string
}) {
  return createClient(url, {
    username,
    password
  })
    .exists('/')
    .then((res) => {
      if (res) return true
      else {
        utools.showNotification('WebDav连接失败')
        return false
      }
    })
    .catch((err) => {
      utools.showNotification('WebDav连接出错: ' + err)
    })
}

// 初始化WebDav数据目录
export async function initWebDav() {
  const { url, username, password } = setting.advance.webDav
  const client = Client()

  return validServer({ url, username, password }).then((res) => {
    if (res) {
      client
        .exists(WORK_DIR)
        .then((exists) => {
          if (!exists) {
            client.createDirectory(WORK_DIR)
          }
        })
        .catch((err) => utools.showNotification('WebDav目录创建出错: ' + err))
    } else {
      utools.showNotification('初始化WebDav连接失败')
    }
  })
}

// 下载数据
export async function downloadWebDav() {
  // 从WebDav下载文件 经过gzip解压后 写入本地磁盘
  const client = Client()
  const p = window.db.path

  const data = await client.getFileContents(`${WORK_DIR}/${FILE_NAME}.gz`)
  const unzip = unzipSync(data)

  return new Promise((resolve) => {
    writeFile(
      p,
      unzip,
      {
        encoding: 'utf8'
      },
      (err) => {
        if (err) resolve(false)
        else resolve(true)
      }
    )
  })
}

// 上传数据
export async function uploadWebDav() {
  // 从本地读取文件 经过gzip压缩后 上传到WebDav
  const client = Client()
  const p = window.db.path

  const data = readFileSync(p)
  const gzip = gzipSync(data)

  return client.putFileContents(`${WORK_DIR}/${FILE_NAME}.gz`, gzip, {
    overwrite: true,
    contentLength: false
  })
}

// 比较文件信息
export async function getFileStat() {
  const client = Client()
  return client.stat(`${WORK_DIR}/${FILE_NAME}.gz`)
}
