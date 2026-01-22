"use client";

import { useDonations } from "@/hooks/use-donations";
import { formatUSD } from "@/lib/utils/format";
import { DonationsList } from "@/components/donations/donations-list";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface UserDetailContentProps {
  address: string;
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function UserDetailContent({ address }: UserDetailContentProps) {
  const { data, isLoading, error } = useDonations(address);

  if (isLoading) {
    return <UserDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <AlertCircle className="h-8 w-8 mb-4 text-red-400" />
        <p>Failed to load donations</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const displayName = data.username || truncateAddress(address);
  const totalDonated = data.donations.reduce(
    (sum, d) => sum + d.usdDonateValue,
    0
  );

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{displayName}</h2>
        {data.username && (
          <p className="text-sm text-muted-foreground font-mono mt-1">
            {truncateAddress(address)}
          </p>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
          <p className="text-sm text-muted-foreground mb-1">Total Donated</p>
          <p className="text-2xl font-semibold font-mono text-amber-400">
            {formatUSD(totalDonated)}
          </p>
        </div>
        <div className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
          <p className="text-sm text-muted-foreground mb-1">Transactions</p>
          <p className="text-2xl font-semibold font-mono">{data.total}</p>
        </div>
      </div>

      {/* Donations List */}
      <DonationsList donations={data.donations} />
    </div>
  );
}

function UserDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32 mt-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}
