import { useEventListener } from '@/hooks/useEventListener'
import { Button } from '@arco-design/web-vue'
import { IconLeft } from '@arco-design/web-vue/es/icon'

export function usePageBack() {
  const router = useRouter()
  const back = () => router.push('/editor')

  // 监听键盘事件 ESC执行返回
  useEventListener(document, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      back()
      e.stopPropagation()
    }
  })

  return {
    BackButton: () => (
      <Button class="back" onClick={back} shape="circle">
        <IconLeft />
      </Button>
    ),
    back
  }
}
