interface SectionTitleProps {
  title: string
}

export function SectionTitle({ title }: SectionTitleProps) {
  return (
    <div className="w-full py-4 border-b border-[#020202] flex items-center justify-center gap-2.5">
      <h2 className="flex-1 text-xl font-bold text-[#020202]">{title}</h2>
    </div>
  )
}
