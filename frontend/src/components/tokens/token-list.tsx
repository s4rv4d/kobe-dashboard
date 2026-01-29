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
import { TokenRow } from "./token-row";
import type { Token } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TokenListProps {
  tokens: Token[];
}

const ITEMS_PER_PAGE = 5;

export function TokenList({ tokens }: TokenListProps) {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(tokens.length / ITEMS_PER_PAGE);
  const startIndex = page * ITEMS_PER_PAGE;
  const paginatedTokens = tokens.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="solid-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#2a2a2a] hover:bg-transparent">
              <TableHead className="text-muted font-medium">Token</TableHead>
              <TableHead className="text-right text-muted font-medium">
                Price
              </TableHead>
              <TableHead className="text-right text-muted font-medium">
                Balance
              </TableHead>
              <TableHead className="text-right text-muted font-medium">
                Value
              </TableHead>
              <TableHead className="text-right text-muted font-medium">
                %
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTokens.map((token) => (
              <TokenRow key={token.address} token={token} />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>

          <span className="text-sm text-muted-foreground">
            {page + 1} / {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
