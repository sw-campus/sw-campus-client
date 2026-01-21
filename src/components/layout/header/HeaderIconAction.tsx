'use client'

import type { ReactNode } from 'react'

import Link from 'next/link'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type Props =
  | {
      kind: 'link'
      tooltip: string
      children: ReactNode
      ariaLabel: string
      href: string
    }
  | {
      kind: 'button'
      tooltip: string
      children: ReactNode
      ariaLabel: string
      onClick: () => void
      disabled?: boolean
    }

export function HeaderIconAction(props: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {props.kind === 'link' ? (
          <Link href={props.href} aria-label={props.ariaLabel} className="transition hover:opacity-80">
            {props.children}
          </Link>
        ) : (
          <button
            onClick={props.onClick}
            disabled={props.disabled}
            className="transition hover:opacity-80 disabled:opacity-50"
          >
            {props.children}
          </button>
        )}
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-semibold">{props.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}
