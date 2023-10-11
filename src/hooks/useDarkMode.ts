import { useMedia } from '@/hooks/useMedia'

export function useDarkMode() {
  // MediaQuery theme
  const isDark = useMedia('(prefers-color-scheme: dark)')

  watch(
    isDark,
    (val) => {
      if (val) {
        document.body.classList.add('dark')
        document.body.setAttribute('arco-theme', 'dark')
      } else {
        document.body.classList.remove('dark')
        document.body.removeAttribute('arco-theme')
      }
    },
    { immediate: true }
  )

  return isDark
}
