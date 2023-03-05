import { isElectron } from '@/utils'

export function setItem(key: string, value: any) {
  const data = JSON.stringify(value)

  if (isElectron) {
    return utools.dbStorage.setItem(key, data)
  } else {
    localStorage.setItem(key, data)
  }
}

export function getItem(key: string) {
  if (isElectron) {
    const data = utools.dbStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } else {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }
}

export function removeItem(key: string) {
  const dbStorage = isElectron ? utools.dbStorage : localStorage
  dbStorage.removeItem(key)
}
