import { ReactNode } from 'react'

export function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-black/50">{label}</span>
      <div className="flex w-full flex-wrap gap-2">{children}</div>
    </div>
  )
}
