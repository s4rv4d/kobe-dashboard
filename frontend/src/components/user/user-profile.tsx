"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfilePhotoUpload } from "./profile-photo-upload";
import { SocialLinks } from "./social-links";
import { UserProfileEdit } from "./user-profile-edit";
import { useAuth } from "@/hooks/use-auth";
import type { UserProfile as UserProfileType } from "@/types";

interface UserProfileProps {
  profile: UserProfileType | null;
  address: string;
  displayName: string;
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function UserProfile({
  profile,
  address,
  displayName,
}: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { address: authAddress } = useAuth();

  const canEdit = authAddress?.toLowerCase() === address.toLowerCase();

  // If editing and we have a profile, show edit form
  if (isEditing) {
    return (
      <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a]">
        <UserProfileEdit
          profile={profile || undefined}
          onCancel={() => setIsEditing(false)}
          onSaved={() => setIsEditing(false)}
          address={address}
        />
      </div>
    );
  }

  // View mode
  return (
    <div className="flex items-start gap-4">
      <ProfilePhotoUpload
        photoUrl={profile?.profilePhotoUrl ?? null}
        address={address}
        size="md"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold tracking-tight truncate">
            {displayName}
          </h2>
          {canEdit && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="size-4" />
            </Button>
          )}
        </div>

        {displayName !== truncateAddress(address) && (
          <p className="text-sm text-muted-foreground font-mono mt-1">
            {truncateAddress(address)}
          </p>
        )}

        {profile && (
          <SocialLinks
            twitterUsername={profile.twitterUsername}
            email={profile.email}
            solanaWallet={profile.solanaWallet}
            className="mt-2"
          />
        )}
      </div>
    </div>
  );
}
