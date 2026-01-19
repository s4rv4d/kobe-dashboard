import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <Card className="p-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Token Holdings</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-right">%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokens.map((token) => (
              <TokenRow key={token.address} token={token} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
