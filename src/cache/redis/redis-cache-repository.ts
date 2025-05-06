import { Injectable } from "@nestjs/common";
import { CacheRepository } from "../cache-repository";
import { RedisService } from "./redis.service";

@Injectable()
export class RedisCacheRepository implements CacheRepository {
    
    constructor(private readonly redisService: RedisService) {}

    async get(key: string): Promise<string | null> {
        return await this.redisService.get(key)
    }
    async set(key: string, value: string, ex?: number): Promise<void> {
        await this.redisService.set(key, value)
    }
    async del(key: string): Promise<void> {
        await this.redisService.del(key)
    }

}