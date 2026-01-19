import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

/**
 * SSR 환경에서 클라이언트 마운트 여부를 감지하는 훅
 *
 * Portal 등 클라이언트 전용 렌더링이 필요한 경우 사용합니다.
 * `useSyncExternalStore`를 활용하여 `set-state-in-effect` lint 경고를 피합니다.
 *
 * @example
 * ```tsx
 * function Modal() {
 *   const isMounted = useIsMounted()
 *   if (!isMounted) return null
 *   return createPortal(<div>Modal</div>, document.body)
 * }
 * ```
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot)
}
