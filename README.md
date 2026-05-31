# TeamTaskTracker

TeamTaskTracker is a full-stack task management system with a Node.js/TypeScript backend, SQL Server persistence, Redis caching, JWT authentication, role-based access control, and a Vite/React frontend.

## Deliverables

1. **GitHub repository**
   - Repository should use clean, incremental commits instead of a single end-state commit.
   - Each feature and fix should be tracked in a separate commit for history clarity.

2. **README includes:**
   - Setup instructions using `docker compose up -d`
   - Caching strategy and invalidation approach
   - One database design decision explanation
   - Future improvements and additions given more time

3. **API documentation**
   - Swagger/OpenAPI spec is provided in `backend/docs/swagger.yaml`
   - Live Swagger UI is available at `http://localhost:4000/api/docs`

## Setup

From the repository root:

```bash
docker compose up -d
```

This command will:

- build and start the backend service
- start SQL Server
- start Redis

Once the services are up, the backend API is available at:

```text
http://localhost:4000
```

### Health check

```bash
curl http://localhost:4000/api/health
```

Expected response:

```json
{"success":true,"message":"API running"}
```

## Environment configuration

The backend reads settings from `backend/.env`. Key values include:

- `DB_SERVER` - database hostname
- `DB_PORT` - SQL Server port
- `DB_DATABASE` - database name
- `DB_USER` / `DB_PASSWORD` - SQL authentication
- `REDIS_HOST` / `REDIS_PORT` - Redis connection
- `JWT_SECRET` / `JWT_REFRESH_SECRET` - token secrets

## Database schema description

The application uses a normalized SQL Server schema with the following primary entities:

- `Organizations`
  - Stores tenant organization metadata: `Id`, `Name`, `CreatedAt`, `UpdatedAt`, `IsDeleted`.
- `Users`
  - Stores application users: `Id`, `OrganizationId`, `FullName`, `Email`, `PasswordHash`, `Role`, `IsActive`, `CreatedAt`, `UpdatedAt`, `IsDeleted`.
  - Users belong to an organization and can be `ADMIN`, `MANAGER`, or `MEMBER`.
- `Projects`
  - Stores projects scoped to an organization: `Id`, `OrganizationId`, `Name`, `Description`, `CreatedBy`, `CreatedAt`, `UpdatedAt`, `IsDeleted`.
- `Tasks`
  - Stores tasks attached to a project and potentially assigned to a user: `Id`, `ProjectId`, `Title`, `Description`, `Priority`, `Status`, `AssigneeId`, `CreatedBy`, `DueDate`, `CreatedAt`, `UpdatedAt`, `IsDeleted`.
- `RefreshTokens`
  - Stores refresh tokens for JWT rotation: `Id`, `UserId`, `Token`, `ExpiresAt`, `IsRevoked`, `CreatedAt`.

### Relationships

- A `User` belongs to an `Organization`.
- A `Project` belongs to an `Organization` and is created by a `User`.
- A `Task` belongs to a `Project`, is created by a `User`, and may be assigned to a `User`.
- A `RefreshToken` belongs to a `User`.

### Indexes

The schema includes indexes on the most frequently queried fields for task listing and filtering:

- `IX_Tasks_Status` on `Tasks(Status)`
- `IX_Tasks_AssigneeId` on `Tasks(AssigneeId)`
- `IX_Tasks_DueDate` on `Tasks(DueDate)`
- `IX_Tasks_ProjectId` on `Tasks(ProjectId)`
- `IX_Users_Email` on `Users(Email)`

These indexes are chosen because task list APIs commonly filter tasks by `status`, `assignee`, and `due_date`, and the query planner benefits from these indexes when the task table grows.

## Caching strategy

The backend caches task list results in Redis by using a cache key built from the requesting user's ID and the query filters used for pagination and task list retrieval.

Example cache key pattern:

```text
tasks:<userId>:{"page":1,"limit":10,"status":"TODO","priority":"HIGH"}
```

### Cache invalidation

Cache invalidation occurs whenever tasks are mutated:

- Task creation
- Task updates
- Status updates
- Task deletion

When a task changes, the backend clears cached task pages for the affected assignee/user so subsequent list requests return fresh data. This ensures that readers do not see stale task state after a mutation.

## Database design decision

I chose a normalized relational model with explicit foreign key constraints to keep ownership, assignment, and organization boundaries consistent.

- `Tasks` are linked to `Projects` and `Users` through explicit foreign keys to enforce data integrity.
- Indexes on `Status`, `AssigneeId`, and `DueDate` are added because those are the most common filter fields for task queries and help keep list retrieval performant.
- Keeping `IsDeleted` as a soft-delete flag allows historical cleanup and makes task filtering safer without permanently removing records.

In production, this structure supports scalable task filtering and safe multi-tenant separation while still leaving room for future audit logging or tenant-level policy enforcement.

## What I would improve or add given more time

Add database migrations and seed scripts to make the environment fully reproducible across setups.

Introduce structured logging and monitoring (logs, metrics, tracing) for better observability in production.

Enhance RBAC to support dynamic permissions instead of fixed roles for finer-grained access control.

Improve caching with better TTL strategies, cache versioning, and protection against cache stampede.

Introduce event-driven updates for task changes using a message broker for notifications and audit logs.

Add stronger testing coverage including integration tests with real database and CI automation.

Harden security with rate limiting, token revocation tracking, and optional multi-factor authentication for admins.

## API documentation

- Swagger/OpenAPI spec: `backend/docs/swagger.yaml`
- Live docs: `http://localhost:4000/api/docs`

## Notes

- The `docker compose up -d` command is enough to start all required services after the first build.
- If the backend container does not start, inspect logs with `docker logs teamtasktracker-api`.
