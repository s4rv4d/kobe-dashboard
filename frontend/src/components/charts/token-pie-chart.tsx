'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatUSD } from '@/lib/utils/format'
import type { AllocationItem } from '@/types'

const COLORS = [
  '#3b82f6',
  '#22c55e',
  '#eab308',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#6b7280',
]

interface ChartData {
  symbol: string
  valueUsd: number
  percentage: number
  [key: string]: string | number
}

function groupSmallAllocations(
  allocation: AllocationItem[],
  threshold: number
): ChartData[] {
  const large: ChartData[] = []
  let smallSum = 0
  let smallValue = 0

  for (const item of allocation) {
    if (item.percentage >= threshold) {
      large.push({ ...item })
    } else {
      smallSum += item.percentage
      smallValue += item.valueUsd
    }
  }

  if (smallSum > 0) {
    large.push({ symbol: 'Others', percentage: smallSum, valueUsd: smallValue })
  }

  return large
}

interface TokenPieChartProps {
  allocation: AllocationItem[]
}

export function TokenPieChart({ allocation }: TokenPieChartProps) {
  const grouped = groupSmallAllocations(allocation, 2)

  return (
    <Card className="p-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Portfolio Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={grouped}
              dataKey="valueUsd"
              nameKey="symbol"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
            >
              {grouped.map((entry, i) => (
                <Cell key={entry.symbol} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatUSD(Number(value))}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
