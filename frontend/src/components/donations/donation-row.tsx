import { TableRow, TableCell } from "@/components/ui/table";
import { formatUSD, formatDate } from "@/lib/utils/format";
import type { Donation } from "@/types";

interface DonationRowProps {
  donation: Donation;
}

export function DonationRow({ donation }: DonationRowProps) {
  return (
    <TableRow className="border-b border-border/30 hover:bg-white/[0.02] transition-colors">
      <TableCell className="py-4">
        <span className="text-sm text-muted-foreground">
          {formatDate(donation.transactionDate)}
        </span>
      </TableCell>
      <TableCell className="text-right font-mono text-sm">
        {donation.contributionAmount.toFixed(4)}
      </TableCell>
      <TableCell className="text-right">
        <span className="inline-flex px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-xs font-mono uppercase">
          {donation.currency}
        </span>
      </TableCell>
      <TableCell className="text-right font-mono text-sm text-muted-foreground">
        {formatUSD(donation.ethPriceUsd)}
      </TableCell>
      <TableCell className="text-right font-mono text-sm font-medium text-foreground">
        {formatUSD(donation.usdDonateValue)}
      </TableCell>
    </TableRow>
  );
}
