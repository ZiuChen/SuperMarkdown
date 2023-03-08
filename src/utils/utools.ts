import { isElectron } from './env'

interface IFeature {
  code: string
  explain: string
  platform: ('darwin' | 'win32' | 'linux') | Array<'darwin' | 'win32' | 'linux'>
  icon?: string
  cmds: (
    | string
    | {
        type: 'img' | 'files' | 'regex' | 'over' | 'window'
        label: string
      }
  )[]
}

export function setFeature(feature: IFeature) {
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
