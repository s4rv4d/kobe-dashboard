import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TokenRow } from './token-row'
import type { Token } from '@/types'

interface TokenListProps {
  tokens: Token[]
}

export function TokenList({ tokens }: TokenListProps) {
  return (
    <div className="glass-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border/50 hover:bg-transparent">
            <TableHead className="text-muted font-medium">Token</TableHead>
            <TableHead className="text-right text-muted font-medium">Price</TableHead>
            <TableHead className="text-right text-muted font-medium">Balance</TableHead>
            <TableHead className="text-right text-muted font-medium">Value</TableHead>
            <TableHead className="text-right text-muted font-medium">%</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token) => (
            <TokenRow key={token.address} token={token} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
