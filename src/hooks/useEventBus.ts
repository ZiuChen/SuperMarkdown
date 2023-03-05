/**
 * @desc 统一管理 Eventbus 以约束类型 自动注册和移除事件
 */

// @ts-ignore
import emitter from 'tiny-emitter/instance'
import { onUnmounted } from 'vue'

export const $on = (event: symbol, ...args: any[]) => emitter.on(event, ...args)
export const $emit = (event: symbol, ...args: any[]) => emitter.emit(event, ...args)
export const $off = (event: symbol, ...args: any[]) => emitter.off(event, ...args)
export const $once = (event: symbol, ...args: any[]) => emitter.once(event, ...args)

// 注册事件
export function useEventBus(type: symbol, listner: Function) {
  // 注册事件
  $on(type, listner)
  // 自动移除事件
  onUnmounted(() => $off(type, listner))
}
