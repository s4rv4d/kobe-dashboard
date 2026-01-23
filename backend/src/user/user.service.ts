import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../providers/supabase/supabase.service';
import { UserDetails, UserProfileUpdate } from './user.types';
import { UserDetailsRow } from '../providers/supabase/supabase.types';

@Injectable()
export class UserService {
  constructor(private supabaseService: SupabaseService) {}

  private mapRowToUserDetails(row: UserDetailsRow): UserDetails {
    return {
      address: row.address,
      twitterUsername: row.twitter_username,
      email: row.email,
      solanaWallet: row.solana_wallet,
      profilePhotoUrl: row.profile_photo_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async getUserDetails(
    address: string,
    requestingAddress?: string,
  ): Promise<UserDetails | null> {
    const row = await this.supabaseService.getUserDetails(address);

    if (!row) {
      return null;
    }

    const userDetails = this.mapRowToUserDetails(row);

    // Hide email unless viewing own profile
    const isOwner =
      requestingAddress?.toLowerCase() === address.toLowerCase();
    if (!isOwner) {
      return { ...userDetails, email: null };
    }

    return userDetails;
  }

  async updateUserProfile(
    address: string,
    updates: UserProfileUpdate,
  ): Promise<UserDetails> {
    const row = await this.supabaseService.upsertUserDetails(address, {
      email: updates.email,
      solana_wallet: updates.solanaWallet,
    });

    return this.mapRowToUserDetails(row);
  }

  async uploadProfilePhoto(
    address: string,
    file: Buffer,
    contentType: string,
  ): Promise<UserDetails> {
    const photoUrl = await this.supabaseService.uploadProfilePhoto(
      address,
      file,
      contentType,
    );

    const row = await this.supabaseService.upsertUserDetails(address, {
      profile_photo_url: photoUrl,
    });

    return this.mapRowToUserDetails(row);
  }

  async deleteProfilePhoto(address: string): Promise<UserDetails> {
    await this.supabaseService.deleteProfilePhoto(address);

    const row = await this.supabaseService.upsertUserDetails(address, {
      profile_photo_url: null,
    });

    return this.mapRowToUserDetails(row);
  }

  async updateTwitterUsername(
    address: string,
    twitterUsername: string | null,
  ): Promise<UserDetails> {
    const row = await this.supabaseService.upsertUserDetails(address, {
      twitter_username: twitterUsername,
    });

    return this.mapRowToUserDetails(row);
  }

  async disconnectTwitter(address: string): Promise<UserDetails> {
    const row = await this.supabaseService.upsertUserDetails(address, {
      twitter_username: null,
    });

    return this.mapRowToUserDetails(row);
  }
}
