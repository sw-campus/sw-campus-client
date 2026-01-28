'use client'

import type { ReactNode } from 'react'

import Link from 'next/link'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type BaseProps = {
  tooltip: string
  children: ReactNode
  ariaLabel: string
  showTooltip?: boolean
}

type Props =
  | (BaseProps & {
      kind: 'link'
      href: string
    })
  | (BaseProps & {
      kind: 'button'
      onClick: () => void
      disabled?: boolean
    })

export function HeaderIconAction(props: Props) {
  const { showTooltip = true } = props

  const content =
    props.kind === 'link' ? (
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
    )

  if (!showTooltip) {
    return content
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent>
        <p className="font-semibold">{props.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}
