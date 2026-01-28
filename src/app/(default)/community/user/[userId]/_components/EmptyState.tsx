import { IconType } from 'react-icons'

interface EmptyStateProps {
  icon: IconType
  title: string
  description: string
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 md:min-h-[400px] md:rounded-2xl">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-white md:mb-5 md:h-20 md:w-20">
        <Icon className="h-8 w-8 text-gray-300 md:h-10 md:w-10" />
      </div>
      <p className="text-base font-semibold text-gray-800 md:text-lg">{title}</p>
      <p className="mt-1.5 text-xs text-gray-500 md:mt-2 md:text-sm">{description}</p>
    </div>
  )
}
