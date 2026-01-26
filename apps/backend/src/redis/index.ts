import { createClient, type RedisClientType } from "redis";
import { LocationMessage, LocationMessageType } from "./types";

type RedisCacheConfig = {
    url: string; // "redis://alice:foobared@awesome.redis.server:6380"
}

// CONSTANTS
const GPS_PREFIX_KEY = "gps"
const KEY_DELIMITER = ":"

export class RedisCache {
    private static instance: RedisCache
    private redis: RedisClientType

    constructor(r: any){
        this.redis = r;
    }

    static async getInstance(cfg?: RedisCacheConfig): Promise<RedisCache> {
        if (!this.instance) {
            if (!cfg) {
                throw Error("Thiếu config để kết nối đến Redis!")
            }
            try {
                const redisClient = await createClient({
                    url: cfg?.url,
                    
                }).on("error", (err) => console.log("Redis Client Error", err)).connect();
                
                console.log("Kết nối đến Redis thành công!")
                
                return new RedisCache(redisClient);
            } catch (error) {
                console.log("Failed to connect Redis")
            }
        }
        return this.instance
    }

    async saveLocation(l : LocationMessageType) {
        const key = `${GPS_PREFIX_KEY}${KEY_DELIMITER}${l.licenseNumber}`;
        const value = JSON.stringify(l);
        try {
            await this.redis.set(key, value)
        } catch (error) {
            console.log("Failed to save location into cache!")
        }
    }

    async getLocation(licenseNumber: string) : Promise<LocationMessageType | null> {
        const key = `${GPS_PREFIX_KEY}${KEY_DELIMITER}${licenseNumber}`;
        try {
            const rawValue = await this.redis.get(key)
            const value = LocationMessage.parse(JSON.parse(rawValue!))
            return value
        } catch (error) {
            console.log("Failed to save location from cache!")
        }
        return null
    }
}
