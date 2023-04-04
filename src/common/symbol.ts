/**
 * 侧栏目录树相关操作
 */
export const CREATE_FILE = Symbol('CREATE_FILE')
export const CREATE_FOLDER = Symbol('CREATE_FOLDER')
export const DELETE_FILE = Symbol('DELETE_FILE')
export const DELETE_FOLDER = Symbol('DELETE_FOLDER')
export const RENAME_NODE = Symbol('RENAME_NODE') // 文件/文件夹重命名
export const CATEGORY_CHANGE = Symbol('CATEGORY_CHANGE') // 侧栏目录树变化
export const SWITCH_FILE = Symbol('SWITCH_FILE') // 切换侧栏目录树 当前选中的文章

/**
 * 编辑器相关操作
 */
export const EDITOR_LOADED = Symbol('EDITOR_LOADED') // 编辑器挂载完毕
export const FOCUS_EDITOR = Symbol('FOCUS_EDITOR') // 主动聚焦编辑器

/**
 * 其他
 */
export const CHANGE_TITLE = Symbol('CHANGE_TITLE') // 标题变化
export const IS_DARK = Symbol('IS_DARK') // 当前主题色
export const FILE_ENTER = Symbol('FILE_ENTER') // 由关键字进入插件 打开文章
