import { TableRow, TableCell } from '@/components/ui/table'
import { TokenIcon } from './token-icon'
import { formatUSD, formatBalance } from '@/lib/utils/format'
import type { Token } from '@/types'

interface TokenRowProps {
  token: Token
}

export function TokenRow({ token }: TokenRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <TokenIcon symbol={token.symbol} logoUrl={token.logoUrl} />
          <div>
            <div className="font-medium">{token.name}</div>
            <div className="text-sm text-muted-foreground">{token.symbol}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right">{formatUSD(token.priceUsd)}</TableCell>
      <TableCell className="text-right">
        {formatBalance(token.balanceFormatted)}
      </TableCell>
      <TableCell className="text-right font-medium">
        {formatUSD(token.valueUsd)}
      </TableCell>
      <TableCell className="text-right text-muted-foreground">
        {token.percentage.toFixed(1)}%
      </TableCell>
    </TableRow>
  )
}
