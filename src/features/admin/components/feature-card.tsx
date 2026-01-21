import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FeatureCardProps {
  title: string
  description: string
  icon?: React.ElementType
}

export function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <Card className="bg-card transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center gap-3">
        {Icon && (
          <div className="text-primary">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <CardTitle className="text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}
