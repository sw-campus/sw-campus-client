'use client'

import { cn } from '@/lib/utils'

import { APPROVAL_STATUS_LABEL, type ApprovalStatus } from '../../types/organization.type'

interface OrganizationFilterProps {
  currentStatus: ApprovalStatus
  onStatusChange: (status: ApprovalStatus | undefined) => void
}

const filterOptions: { label: string; value: ApprovalStatus }[] = [
  { label: APPROVAL_STATUS_LABEL.PENDING, value: 'PENDING' },
  { label: APPROVAL_STATUS_LABEL.APPROVED, value: 'APPROVED' },
  { label: APPROVAL_STATUS_LABEL.REJECTED, value: 'REJECTED' },
]

export function OrganizationFilter({ currentStatus, onStatusChange }: OrganizationFilterProps) {
  return (
    <div className="flex gap-2">
      {filterOptions.map(option => {
        const isActive = currentStatus === option.value

        return (
          <button
            key={option.label}
            onClick={() => onStatusChange(option.value)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
