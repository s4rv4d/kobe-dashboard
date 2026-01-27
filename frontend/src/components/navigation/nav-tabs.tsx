'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const TAB_ITEMS = [
  { label: 'Home', href: '/dashboard', disabled: false },
  { label: 'Portfolio', href: '/portfolio', disabled: false },
  { label: 'Yield', href: null, disabled: true },
  { label: 'Liquidity', href: null, disabled: true },
] as const

export function NavTabs() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide -mb-px">
      {TAB_ITEMS.map((tab) => {
        const isActive = tab.href ? pathname.startsWith(tab.href) : false

        if (tab.disabled) {
          return (
            <span
              key={tab.label}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-muted-foreground/40 cursor-not-allowed whitespace-nowrap select-none"
            >
              {tab.label}
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-4 border-muted-foreground/20 text-muted-foreground/40 font-normal"
              >
                <span className="hidden sm:inline">Coming Soon</span>
                <span className="sm:hidden">Soon</span>
              </Badge>
            </span>
          )
        }

        return (
          <Link
            key={tab.label}
            href={tab.href!}
            className={cn(
              'relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors',
              isActive
                ? 'text-amber-400'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-400 rounded-full" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
