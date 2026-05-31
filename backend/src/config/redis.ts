import { createClient, RedisClientType } from 'redis';
import { config } from './index';

const redisUrl = `redis://${config.redis.host}:${config.redis.port}`;

export const redisClient: RedisClientType = createClient({
  url: redisUrl,
  password: config.redis.password || undefined,
});

redisClient.on('error', (error) => {
  console.error('Redis client error:', error);
});

redisClient.on('connect', () => {
  console.info('Connected to Redis successfully');
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  return redisClient;
};
