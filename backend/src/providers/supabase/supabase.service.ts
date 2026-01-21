import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Contribution, XirrEntry } from './supabase.types';

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
}
