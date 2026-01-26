import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: number
  icon?: React.ElementType
  subtext?: string
  customFormatter?: (value: number) => string
}

export function StatCard({ title, value, icon: Icon, subtext, customFormatter }: StatCardProps) {
  return (
    <Card className="bg-card">
      <CardContent className="flex flex-col items-center justify-center gap-1 p-4 md:gap-2 md:p-6">
        {Icon && (
          <div className="text-muted-foreground">
            <Icon className="h-5 w-5 md:h-6 md:w-6" />
          </div>
        )}
        <p className="text-foreground text-2xl font-bold md:text-3xl">
          {customFormatter ? customFormatter(value) : value.toLocaleString()}
        </p>
        <p className="text-muted-foreground truncate whitespace-nowrap text-xs md:text-sm">{title}</p>
        {subtext && <p className="text-primary truncate whitespace-nowrap text-xs font-medium">{subtext}</p>}
      </CardContent>
    </Card>
  )
}
