interface SectionLabelTagProps {
  children: React.ReactNode
}

export function SectionLabelTag({ children }: SectionLabelTagProps) {
  return (
    <span className="inline-flex rounded-md bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
      {children}
    </span>
  )
}
