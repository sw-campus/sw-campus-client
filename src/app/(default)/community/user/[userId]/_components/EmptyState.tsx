import { IconType } from 'react-icons'

interface EmptyStateProps {
  icon: IconType
  title: string
  description: string
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 sm:min-h-[400px] sm:rounded-2xl">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-white sm:mb-5 sm:h-20 sm:w-20">
        <Icon className="h-8 w-8 text-gray-300 sm:h-10 sm:w-10" />
      </div>
      <p className="text-base font-semibold text-gray-800 sm:text-lg">{title}</p>
      <p className="mt-1.5 text-xs text-gray-500 sm:mt-2 sm:text-sm">{description}</p>
    </div>
  )
}
