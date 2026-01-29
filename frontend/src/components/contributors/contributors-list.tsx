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
import { ContributorRow } from "./contributor-row";
import type { Contributor } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ContributorsListProps {
  contributors: Contributor[];
}

const ITEMS_PER_PAGE = 10;

export function ContributorsList({ contributors }: ContributorsListProps) {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(contributors.length / ITEMS_PER_PAGE);
  const startIndex = page * ITEMS_PER_PAGE;
  const paginatedContributors = contributors.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-4">
      <div className="solid-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#2a2a2a] hover:bg-transparent">
              <TableHead className="text-muted font-medium">Wallet</TableHead>
              <TableHead className="text-right text-muted font-medium">
                Invested
              </TableHead>
              <TableHead className="text-right text-muted font-medium">
                Current Value
              </TableHead>
              <TableHead className="text-right text-muted font-medium">
                Equity
              </TableHead>
              <TableHead className="text-right text-muted font-medium">
                Multiple
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedContributors.map((contributor) => (
              <ContributorRow
                key={contributor.address}
                contributor={contributor}
              />
            ))}
          </TableBody>
        </Table>
      </div>

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
