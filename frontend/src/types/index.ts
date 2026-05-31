export interface HealthResponse {
  success: boolean;
  message: string;
}

export interface UserSummary {
  id: number;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
  isActive: boolean;
  organizationId: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserSummary;
}

export interface AuthState {
  user: UserSummary | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  organizationId: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface Task {
  Id: number;
  Title: string;
  Description?: string;
  Priority: 'LOW' | 'MEDIUM' | 'HIGH';
  Status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'BLOCKED';
  AssigneeId?: number;
  ProjectId?: number;
  CreatedBy: number;
  DueDate?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}

export interface TaskCreatePayload {
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assigneeId?: number;
  projectId?: number;
  dueDate?: string;
}

export interface TaskUpdatePayload {
  title?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  assigneeId?: number;
  projectId?: number;
  dueDate?: string;
}

export interface TaskStatusUpdateRequest {
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'BLOCKED';
}

export interface Project {
  Id: number;
  Name: string;
  Description?: string;
  Status: 'ACTIVE' | 'ARCHIVED';
  OrganizationId: number;
  CreatedBy: number;
  CreatedAt?: string;
  UpdatedAt?: string;
}

export interface ProjectCreateRequest {
  name: string;
  description?: string;
  status?: 'ACTIVE' | 'ARCHIVED';
}

export interface UserRoleUpdateRequest {
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
}

export interface UserStatusUpdateRequest {
  isActive: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
