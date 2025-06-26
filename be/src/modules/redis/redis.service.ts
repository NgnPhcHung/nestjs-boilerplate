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

  async getHashKey<T>(hashKey: string, key: string): Promise<T | undefined> {
    const keyName = `room:list:${hashKey}`;
    const value = await this.redis.hget(keyName, key);
    if (!!value) return JSON.parse(value) as T;
    return null;
  }

  async pushToList(key: string, value: any) {
    const keyName = `room:list:${key}`;

    const t = await this.redis.type(keyName);
    if (t !== 'none' && t !== 'hash') {
      throw new Error(`Key "${keyName}" is type ${t}, not hash`);
    }

    // const existing = await this.redis.lrange(keyName, 0, -1);
    // const existingParsed = existing.map((item) => JSON.parse(item));
    // const hasSameId = existingParsed.some((player) => player.id === value.id);
    // if (hasSameId) return;

    await this.redis.hset(
      keyName,
      value.userId.toString(),
      JSON.stringify(value),
    );
  }

  async getList<T>(key: string): Promise<T[]> {
    const keyName = `room:list:${key}`;
    const data = await this.redis.hvals(keyName);
    return data.map((item) => JSON.parse(item));
  }
  async removeFromList(key: string, value: any, count = 1) {
    const keyName = `room:list:${key}`;
    await this.redis.lrem(keyName, count, JSON.stringify(value));
  }

  async deleteKey(key: string) {
    const keyName = `room:list:${key}`;
    await this.redis.del(keyName);
  }
}
