import Redis from "ioredis";
import config from "./config";

export const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  connectTimeout: 10000,
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});
