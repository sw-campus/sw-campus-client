import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: number
  icon?: React.ElementType
  subtext?: string
}

export function StatCard({ title, value, icon: Icon, subtext }: StatCardProps) {
  return (
    <Card className="bg-card">
      <CardContent className="flex flex-col items-center justify-center gap-2 p-6">
        {Icon && (
          <div className="text-muted-foreground">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <p className="text-foreground text-3xl font-bold">{value.toLocaleString()}</p>
        <p className="text-muted-foreground text-sm">{title}</p>
        {subtext && <p className="text-primary text-xs font-medium">{subtext}</p>}
      </CardContent>
    </Card>
  )
}
