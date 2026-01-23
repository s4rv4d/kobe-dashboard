"use client";

import { useState } from "react";
import { Loader2, Twitter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfilePhotoUpload } from "./profile-photo-upload";
import {
  useUpdateUserProfile,
  useTwitterAuth,
  useDisconnectTwitter,
} from "@/hooks/use-user-profile";
import {
  userProfileFormSchema,
  type UserProfileFormValues,
} from "@/lib/validations/user-profile";
import type { UserProfile } from "@/types";

interface UserProfileEditProps {
  profile?: UserProfile;
  onCancel: () => void;
  onSaved: () => void;
  address: string;
}

export function UserProfileEdit({
  profile,
  onCancel,
  onSaved,
  address,
}: UserProfileEditProps) {
  const [formData, setFormData] = useState<UserProfileFormValues>({
    email: profile?.email || "",
    solanaWallet: profile?.solanaWallet || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateMutation = useUpdateUserProfile();
  const twitterAuthMutation = useTwitterAuth();
  const disconnectTwitterMutation = useDisconnectTwitter();

  const handleChange = (field: keyof UserProfileFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = userProfileFormSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await updateMutation.mutateAsync({
        email: parsed.data.email || null,
        solanaWallet: parsed.data.solanaWallet || null,
      });
      onSaved();
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : "Update failed",
      });
    }
  };

  const handleConnectTwitter = async () => {
    try {
      const redirectUri = window.location.href;
      const authUrl = await twitterAuthMutation.mutateAsync(redirectUri);
      window.location.href = authUrl;
    } catch (err) {
      setErrors({
        twitter: err instanceof Error ? err.message : "Twitter auth failed",
      });
    }
  };

  const handleDisconnectTwitter = async () => {
    try {
      await disconnectTwitterMutation.mutateAsync();
    } catch (err) {
      setErrors({
        twitter: err instanceof Error ? err.message : "Disconnect failed",
      });
    }
  };

  const isSubmitting = updateMutation.isPending;
  const isTwitterLoading =
    twitterAuthMutation.isPending || disconnectTwitterMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProfilePhotoUpload
        photoUrl={profile?.profilePhotoUrl || ""}
        address={profile?.address || address}
        editable
        size="lg"
      />

      <div className="space-y-4">
        {/* Twitter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Twitter</label>
          {profile?.twitterUsername ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 h-9 px-3 rounded-md border border-input bg-muted/50">
                <Twitter className="size-4 text-muted-foreground" />
                <span className="text-sm">@{profile.twitterUsername}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleDisconnectTwitter}
                disabled={isTwitterLoading}
              >
                {isTwitterLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <X className="size-4" />
                )}
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={handleConnectTwitter}
              disabled={isTwitterLoading}
              className="w-full"
            >
              {isTwitterLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Twitter className="size-4" />
              )}
              Connect Twitter
            </Button>
          )}
          {errors.twitter && (
            <p className="text-xs text-destructive">{errors.twitter}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Solana Wallet */}
        <div className="space-y-2">
          <label htmlFor="solanaWallet" className="text-sm font-medium">
            Solana Wallet
          </label>
          <Input
            id="solanaWallet"
            type="text"
            placeholder="Enter Solana address"
            value={formData.solanaWallet}
            onChange={(e) => handleChange("solanaWallet", e.target.value)}
            className="font-mono"
          />
          {errors.solanaWallet && (
            <p className="text-xs text-destructive">{errors.solanaWallet}</p>
          )}
        </div>
      </div>

      {errors.submit && (
        <p className="text-sm text-destructive">{errors.submit}</p>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Save
        </Button>
      </div>
    </form>
  );
}
