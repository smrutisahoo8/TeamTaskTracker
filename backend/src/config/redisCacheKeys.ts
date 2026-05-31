export const getTaskCacheKey = (userId: number) =>
  `tasks:user:${userId}`;