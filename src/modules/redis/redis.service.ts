import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  public readonly USERNAMES_SET_KEY = 'usernames:set';

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async addUsernames(values: string[]) {
    if (!!values.length) {
      await this.redis.sadd(this.USERNAMES_SET_KEY, ...values);
    }
  }

  async isUsersExist(value: string) {
    const exist = await this.redis.sismember(this.USERNAMES_SET_KEY, value);
    return exist === 1;
  }

  async getSet<T>(key: string): Promise<T[]> {
    const data = await this.redis.smembers(key);
    return data as T[];
  }

  async setData(key: string, value: any, ttl?: number) {
    const serializedValue = JSON.stringify(value);
    if (ttl) {
      await this.redis.set(key, serializedValue, 'EX', ttl);
    } else {
      await this.redis.set(key, serializedValue);
    }
  }

  async getData(key: string) {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async deleteData(key: string) {
    await this.redis.del(key);
  }

  async getAllKeys() {
    return await this.redis.keys('*');
  }

  async getAllData() {
    const keys = await this.getAllKeys();
    const result: Record<string, any> = {};

    for (const key of keys) {
      const value = await this.getData(key);
      result[key] = value;
    }

    return result;
  }

  async pushToList(key: string, value: any) {
    await this.redis.rpush(key, JSON.stringify(value));
  }

  async getList<T>(key: string): Promise<T[]> {
    const data = await this.redis.lrange(key, 0, -1);
    return data.map((item) => JSON.parse(item));
  }

  async deleteKey(key: string) {
    await this.redis.del(key);
  }
}
