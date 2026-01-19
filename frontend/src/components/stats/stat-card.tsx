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
    <div className="glass-card stat-card p-5 group">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p
            className={cn(
              'display-value',
              variant === 'positive' && 'text-emerald-400',
              variant === 'negative' && 'text-red-400'
            )}
            data-value
          >
            {value}
          </p>
        </div>
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300',
            'bg-white/5 group-hover:bg-white/10',
            variant === 'positive' && 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
            variant === 'negative' && 'bg-red-500/10 group-hover:bg-red-500/20'
          )}
        >
          <Icon
            className={cn(
              'h-5 w-5 transition-transform duration-300 group-hover:scale-110',
              variant === 'default' && 'text-amber-400/70',
              variant === 'positive' && 'text-emerald-400',
              variant === 'negative' && 'text-red-400'
            )}
          />
        </div>
      </div>
    </div>
  )
}
