import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async setData(key: string, value: any, ttl?: number): Promise<void> {
    const serializedValue = JSON.stringify(value);
    if (ttl) {
      await this.redis.set(key, serializedValue, 'EX', ttl);
    } else {
      await this.redis.set(key, serializedValue);
    }
  }

  async getData(key: string): Promise<any> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async deleteData(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async getAllKeys(): Promise<string[]> {
    return await this.redis.keys('*');
  }

  async getAllData(): Promise<Record<string, any>> {
    const keys = await this.getAllKeys();
    const result: Record<string, any> = {};

    for (const key of keys) {
      const value = await this.getData(key);
      result[key] = value;
    }

    return result;
  }

  async pushToList(key: string, value: any): Promise<void> {
    await this.redis.rpush(key, JSON.stringify(value));
  }

  async getList(key: string): Promise<any[]> {
    const data = await this.redis.lrange(key, 0, -1);
    return data.map((item) => JSON.parse(item));
  }

  async deleteKey(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
