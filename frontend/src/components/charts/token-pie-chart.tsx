'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { formatUSD } from '@/lib/utils/format'
import type { AllocationItem } from '@/types'

const COLORS = [
  '#ff5f1f', // electric-orange
  '#8b7bf7', // cool-violet
  '#b8f53d', // neon-green
  '#ff8c5a', // lighter orange
  '#a99bf7', // lighter violet
  '#c8f76d', // lighter green
  '#525252', // neutral-600 (Others)
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

interface TooltipPayloadItem {
  name: string
  value: number
  payload: ChartData
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  const data = payload[0].payload

  return (
    <div className="solid-card px-3 py-2 text-sm">
      <p className="font-medium">{data.symbol}</p>
      <p className="font-mono text-[#ff5f1f]">{formatUSD(data.valueUsd)}</p>
      <p className="text-muted-foreground text-xs">
        {data.percentage.toFixed(1)}%
      </p>
    </div>
  )
}

interface LegendItemProps {
  color: string
  symbol: string
  percentage: number
}

function LegendItem({ color, symbol, percentage }: LegendItemProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-muted-foreground">{symbol}</span>
      <span className="font-mono text-xs ml-auto">{percentage.toFixed(1)}%</span>
    </div>
  )
}

export function TokenPieChart({ allocation }: TokenPieChartProps) {
  const grouped = groupSmallAllocations(allocation, 2)

  return (
    <div className="solid-card p-5">
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={grouped}
              dataKey="valueUsd"
              nameKey="symbol"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              strokeWidth={0}
            >
              {grouped.map((entry, i) => (
                <Cell
                  key={entry.symbol}
                  fill={COLORS[i % COLORS.length]}
                  className="transition-opacity hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Custom Legend */}
        <div className="w-full pt-4 border-t border-[#2a2a2a] mt-2 space-y-2">
          {grouped.map((item, i) => (
            <LegendItem
              key={item.symbol}
              color={COLORS[i % COLORS.length]}
              symbol={item.symbol}
              percentage={item.percentage}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
