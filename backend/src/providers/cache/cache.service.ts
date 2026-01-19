import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@songkeys/nestjs-redis'
import Redis from 'ioredis'

@Injectable()
export class CacheService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key)
    return data ? JSON.parse(data) : null
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    await this.redis.setex(key, ttlSeconds, JSON.stringify(value))
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }

  async getOrFetch<T>(
    key: string,
    ttl: number,
    fetcher: () => Promise<T>,
  ): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached !== null) {
      return cached
    }
    const fresh = await fetcher()
    await this.set(key, fresh, ttl)
    return fresh
  }
}
