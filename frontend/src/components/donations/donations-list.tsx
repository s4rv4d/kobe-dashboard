"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DonationRow } from "./donation-row";
import type { Donation } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DonationsListProps {
  donations: Donation[];
}

const PAGE_SIZE = 5;

export function DonationsList({ donations }: DonationsListProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(donations.length / PAGE_SIZE);
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const paginatedDonations = donations.slice(start, end);

  if (donations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No donations found
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border/50 hover:bg-transparent">
            <TableHead className="text-xs font-medium text-muted-foreground">
              Date
            </TableHead>
            <TableHead className="text-right text-xs font-medium text-muted-foreground">
              Amount
            </TableHead>
            <TableHead className="text-right text-xs font-medium text-muted-foreground">
              Currency
            </TableHead>
            <TableHead className="text-right text-xs font-medium text-muted-foreground">
              ETH Price
            </TableHead>
            <TableHead className="text-right text-xs font-medium text-muted-foreground">
              USD Value
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedDonations.map((donation) => (
            <DonationRow key={donation.id} donation={donation} />
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
          <span className="text-xs text-muted-foreground">
            {start + 1}-{Math.min(end, donations.length)} of {donations.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
