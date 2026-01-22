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
      <CardContent className="flex flex-col items-center justify-center gap-1 p-4 sm:gap-2 sm:p-6">
        {Icon && (
          <div className="text-muted-foreground">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        )}
        <p className="text-foreground text-2xl font-bold sm:text-3xl">
          {customFormatter ? customFormatter(value) : value.toLocaleString()}
        </p>
        <p className="text-muted-foreground truncate whitespace-nowrap text-xs sm:text-sm">{title}</p>
        {subtext && <p className="text-primary truncate whitespace-nowrap text-xs font-medium">{subtext}</p>}
      </CardContent>
    </Card>
  )
}
