import { ProjectRepository } from '../repositories/project.repository';

const repo = new ProjectRepository();

export class ProjectService {
  async createProject(data: any, user: any) {
    const result = await repo.create({
      ...data,
      organizationId: user.organizationId,
      createdBy: user.userId,
      status: data.status || 'ACTIVE',
    });

    return result;
  }

  async getProjects(filters: any, user: any) {
    const requestFilters = { ...filters, organizationId: user.organizationId };
    return repo.findAll(requestFilters);
  }

  async getProjectById(projectId: number) {
    const project = await repo.findById(projectId);
    if (!project) {
      throw {
        status: 404,
        code: 'PROJECT_NOT_FOUND',
        message: 'Project not found',
      };
    }
    return project;
  }
}
