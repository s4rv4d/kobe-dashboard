"use client";

import { useDonations } from "@/hooks/use-donations";
import { useUserProfile } from "@/hooks/use-user-profile";
import { DonationsList } from "@/components/donations/donations-list";
import { Skeleton } from "@/components/ui/skeleton";
import { UserProfile } from "./user-profile";
import { UserStats } from "./user-stats";
import { AlertCircle } from "lucide-react";

interface UserDetailContentProps {
  address: string;
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function UserDetailContent({ address }: UserDetailContentProps) {
  const { data: donationsData, isLoading: donationsLoading, error: donationsError } = useDonations(address);
  const { data: profileData, isLoading: profileLoading } = useUserProfile(address);

  const isLoading = donationsLoading || profileLoading;

  if (isLoading) {
    return <UserDetailSkeleton />;
  }

  if (donationsError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <AlertCircle className="h-8 w-8 mb-4 text-red-400" />
        <p>Failed to load donations</p>
      </div>
    );
  }

  if (!donationsData) {
    return null;
  }

  const displayName = donationsData.username || truncateAddress(address);

  return (
    <div className="space-y-8">
      {/* User Profile */}
      <UserProfile
        profile={profileData ?? null}
        address={address}
        displayName={displayName}
      />

      {/* Summary Stats */}
      <UserStats donations={donationsData.donations} total={donationsData.total} />

      {/* Donations List */}
      <DonationsList donations={donationsData.donations} />
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
