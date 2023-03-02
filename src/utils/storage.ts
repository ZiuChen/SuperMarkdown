import { isElectron } from '@/utils'

export function setItem(key: string, value: any) {
  const dbStorage = isElectron ? utools.dbStorage : localStorage
  dbStorage.setItem(key, value)
}

export function getItem(key: string) {
  const dbStorage = isElectron ? utools.dbStorage : localStorage
  return dbStorage.getItem(key)
}

export function removeItem(key: string) {
  const dbStorage = isElectron ? utools.dbStorage : localStorage
  dbStorage.removeItem(key)
}
