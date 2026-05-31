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

## Caching strategy

The backend caches task list queries in Redis to reduce repeated database reads. Cache keys are generated using the requesting user's ID and the request query filters.

Cache invalidation happens whenever a task is created, updated, deleted, or its status changes. The service clears cached task entries for the affected user so clients always receive fresh task data after mutations.

## Database design decision

A normalized relational schema is used with separate tables for `Organizations`, `Users`, `Projects`, `Tasks`, and `RefreshTokens`.

Key design choices:

- **Foreign key relationships** keep ownership and membership consistent across organizations, users, projects, and tasks.
- **Indexed columns** such as `Users.email`, `Projects.organizationId`, and `Tasks.assignedTo` support efficient lookup and filtering.
- **Role enforcement** in the application layer helps secure user permissions for `ADMIN`, `MANAGER`, and `MEMBER` roles.

## What I would improve or add given more time

- Add a full Postman collection and more complete OpenAPI documentation for all endpoints.
- Add end-to-end integration tests for auth, task, project, and user flows.
- Implement database migrations and seed data for reproducible environments.
- Add audit logging for task and permission changes.
- Create a richer frontend task/project dashboard with RBAC-based UI flows.
- Improve caching coverage for additional query types and add cache warming.

## API documentation

- Swagger/OpenAPI spec: `backend/docs/swagger.yaml`
- Live docs: `http://localhost:4000/api/docs`

## Notes

- The `docker compose up -d` command is enough to start all required services after the first build.
- If the backend container does not start, inspect logs with `docker logs teamtasktracker-api`.
