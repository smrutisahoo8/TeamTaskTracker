export interface IUser {
  id: number;
  organizationId: number;
  fullName: string;
  email: string;
  passwordHash: string;
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRefreshToken {
  id: number;
  userId: number;
  token: string;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt?: Date;
}

export interface IJWTPayload {
  userId: number;
  organizationId: number;
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
}
