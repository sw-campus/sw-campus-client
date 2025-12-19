import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: number
  icon?: React.ReactNode
}

export function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card className="bg-card">
      <CardContent className="flex flex-col items-center justify-center gap-2 p-6">
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <p className="text-foreground text-3xl font-bold">{value.toLocaleString()}</p>
        <p className="text-muted-foreground text-sm">{title}</p>
      </CardContent>
    </Card>
  )
}
