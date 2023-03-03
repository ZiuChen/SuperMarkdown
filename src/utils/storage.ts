import { isElectron } from '@/utils'

export function setItem(key: string, value: any) {
  if (isElectron) {
    return utools.dbStorage.setItem(key, value)
  } else {
    const data = JSON.stringify(value)
    localStorage.setItem(key, data)
  }
}

export function getItem(key: string) {
  if (isElectron) {
    return utools.dbStorage.getItem(key)
  } else {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }
}

export function removeItem(key: string) {
  const dbStorage = isElectron ? utools.dbStorage : localStorage
  dbStorage.removeItem(key)
}
