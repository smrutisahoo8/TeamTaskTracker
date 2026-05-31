import { createClient, RedisClientType } from 'redis';
import { config } from './index';

const redisUrl = `redis://${config.redis.host}:${config.redis.port}`;

let redisClient: RedisClientType | null = null;
let isRedisConnected = false;

const createRedisClient = (): RedisClientType => {
  const client = createClient({
    url: redisUrl,
    password: config.redis.password || undefined,
  });

  client.on('error', (error) => {
    console.warn('[Redis] Connection error (non-critical):', error.message);
    isRedisConnected = false;
  });

  client.on('connect', () => {
    console.info('[Redis] Connected successfully');
    isRedisConnected = true;
  });

  client.on('reconnecting', () => {
    console.warn('[Redis] Attempting to reconnect...');
  });

  return client;
};

export const connectRedis = async (): Promise<void> => {
  try {
    if (!redisClient) {
      redisClient = createRedisClient();
    }

    if (!redisClient.isOpen) {
      await redisClient.connect();
      isRedisConnected = true;
    }
  } catch (error) {
    console.warn('[Redis] Connection unavailable - continuing without cache:', error instanceof Error ? error.message : String(error));
    isRedisConnected = false;
  }
};

export const getRedisClient = (): RedisClientType | null => {
  return redisClient && isRedisConnected ? redisClient : null;
};

export const isRedisAvailable = (): boolean => {
  return isRedisConnected && redisClient?.isOpen === true;
};

export const closeRedis = async (): Promise<void> => {
  if (redisClient && redisClient.isOpen) {
    try {
      await redisClient.quit();
      console.info('[Redis] Connection closed');
    } catch (error) {
      console.warn('[Redis] Error closing connection:', error instanceof Error ? error.message : String(error));
    }
  }
};
