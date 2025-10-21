import { ICacheService } from "../interfaces/ICacheService";
import { redis } from "../config/redis";

export class CacheService implements ICacheService {
  async get(key: string): Promise<string | null> {
    return redis.get(key);
  }

  async set(
    key: string,
    value: string,
    expireMode: string = "EX",
    duration: number = 60
  ): Promise<void> {
    if (expireMode === "EX") {
      await redis.set(key, value, "EX", duration);
    } else {
      await redis.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await redis.del(key);
  }
}
