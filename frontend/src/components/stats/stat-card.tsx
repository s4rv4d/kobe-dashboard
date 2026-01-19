import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  variant?: 'default' | 'positive' | 'negative'
}

export function StatCard({
  title,
  value,
  icon: Icon,
  variant = 'default',
}: StatCardProps) {
  return (
    <Card className="p-0">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p
              className={cn(
                'text-2xl font-bold mt-1',
                variant === 'positive' && 'text-green-500',
                variant === 'negative' && 'text-red-500'
              )}
            >
              {value}
            </p>
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}
