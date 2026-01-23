import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Contribution, XirrEntry, Donation, UserDetailsRow } from './supabase.types';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient<any, any, any, any, any>;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!url || !key) {
      throw new Error(
        'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured',
      );
    }

    this.client = createClient(url, key);
  }

  async getContributions(): Promise<Contribution[]> {
    const { data, error } = await this.client
      .from('contributions')
      .select('address, total_inv_usd, equity_perc')
      .order('equity_perc', { ascending: false });

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    return data || [];
  }

  async getXirrData(): Promise<XirrEntry[]> {
    const { data, error } = await this.client
      .from('xirr')
      .select('id, date, amount')
      .order('date', { ascending: true });

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    return data || [];
  }

  async getConfig(key: string): Promise<string | null> {
    const { data, error } = await this.client
      .from('config')
      .select('value')
      .eq('key', key)
      .single<{ value: string }>();

    if (error) return null;
    return data?.value ?? null;
  }

  async isAllowlisted(address: string): Promise<boolean> {
    const { data, error } = await this.client
      .from('contributions')
      .select('address')
      .ilike('address', address)
      .limit(1);

    if (error) return false;
    return data !== null && data.length > 0;
  }

  async getDonationsByAddress(address: string): Promise<Donation[]> {
    const { data, error } = await this.client
      .from('donations')
      .select(
        'id, address, username, transaction_date, contribution_amount, currency, eth_price_usd, usd_donate_value, total_contribution, funding_round_id',
      )
      .ilike('address', address)
      .order('transaction_date', { ascending: true });

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    return data || [];
  }

  async getUserDetails(address: string): Promise<UserDetailsRow | null> {
    const { data, error } = await this.client
      .from('user_details')
      .select('*')
      .ilike('address', address)
      .single<UserDetailsRow>();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Supabase error: ${error.message}`);
    }

    return data;
  }

  async upsertUserDetails(
    address: string,
    updates: Partial<Omit<UserDetailsRow, 'address' | 'created_at' | 'updated_at'>>,
  ): Promise<UserDetailsRow> {
    const { data, error } = await this.client
      .from('user_details')
      .upsert(
        { address: address.toLowerCase(), ...updates },
        { onConflict: 'address' },
      )
      .select()
      .single<UserDetailsRow>();

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    return data;
  }

  async uploadProfilePhoto(
    address: string,
    file: Buffer,
    contentType: string,
  ): Promise<string> {
    const extension = contentType.split('/')[1] || 'jpg';
    const fileName = `${address.toLowerCase()}.${extension}`;
    const filePath = `profile-photos/${fileName}`;

    const { error: uploadError } = await this.client.storage
      .from('profile-photos')
      .upload(filePath, file, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Upload error: ${uploadError.message}`);
    }

    const { data: urlData } = this.client.storage
      .from('profile-photos')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  }

  async deleteProfilePhoto(address: string): Promise<void> {
    const extensions = ['jpg', 'jpeg', 'png', 'webp'];
    const filePaths = extensions.map(
      (ext) => `profile-photos/${address.toLowerCase()}.${ext}`,
    );

    const { error } = await this.client.storage
      .from('profile-photos')
      .remove(filePaths);

    if (error) {
      throw new Error(`Delete error: ${error.message}`);
    }
  }
}
