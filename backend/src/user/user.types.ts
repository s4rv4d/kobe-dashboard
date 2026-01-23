export interface UserDetails {
  address: string;
  twitterUsername: string | null;
  email: string | null;
  solanaWallet: string | null;
  profilePhotoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetailsRow {
  address: string;
  twitter_username: string | null;
  email: string | null;
  solana_wallet: string | null;
  profile_photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfileUpdate {
  email?: string | null;
  solanaWallet?: string | null;
}

export interface TwitterAuthState {
  address: string;
  codeVerifier: string;
  redirectUri: string;
}
