export const STATUS_FLOW: Record<string, string[]> = {
  TODO: ['IN_PROGRESS', 'BLOCKED'],
  IN_PROGRESS: ['IN_REVIEW', 'BLOCKED'],
  IN_REVIEW: ['DONE', 'BLOCKED'],
  DONE: [],
  BLOCKED: ['IN_PROGRESS'],
};

export const ALL_STATUSES = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'BLOCKED'] as const;

export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;
