import { TableRow, TableCell } from '@/components/ui/table'
import { TokenIcon } from './token-icon'
import { formatUSD, formatBalance } from '@/lib/utils/format'
import type { Token } from '@/types'

interface TokenRowProps {
  token: Token
}

export function TokenRow({ token }: TokenRowProps) {
  return (
    <TableRow className="border-b border-[#2a2a2a]/50 hover:bg-white/[0.02] transition-colors">
      <TableCell className="py-4">
        <div className="flex items-center gap-3">
          <TokenIcon symbol={token.symbol} logoUrl={token.logoUrl} />
          <div>
            <div className="font-medium text-foreground">{token.name}</div>
            <div className="text-xs text-muted-foreground font-mono">
              {token.symbol}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right font-mono text-muted-foreground">
        {formatUSD(token.priceUsd)}
      </TableCell>
      <TableCell className="text-right font-mono text-muted-foreground">
        {formatBalance(token.balanceFormatted)}
      </TableCell>
      <TableCell className="text-right font-mono font-medium text-foreground">
        {formatUSD(token.valueUsd)}
      </TableCell>
      <TableCell className="text-right">
        <span className="inline-flex px-2 py-0.5 rounded-md bg-[#8b7bf7]/10 text-[#8b7bf7] text-xs font-mono">
          {token.percentage.toFixed(1)}%
        </span>
      </TableCell>
    </TableRow>
  )
}
