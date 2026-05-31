export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  MEMBER: 'MEMBER',
} as const;

export const ROLE_PERMISSIONS = {
  ADMIN: ['read', 'create', 'update', 'delete'],
  MANAGER: ['read', 'create', 'update'],
  MEMBER: ['read'],
} as const;
