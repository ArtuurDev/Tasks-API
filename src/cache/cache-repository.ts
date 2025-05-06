export abstract class CacheRepository {
    abstract get(key: string): Promise<string | null>
    abstract set(key: string, value: string, ex?: number): Promise<void>
    abstract del(key: string): Promise<void>
}


