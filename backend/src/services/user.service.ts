import { UserRepository } from '../repositories/UserRepository';

const repo = new UserRepository();

export class UserService {
  async getUsers() {
    return repo.findAll();
  }

  async updateRole(userId: number, role: string) {
    const user = await repo.getById(userId);
    if (!user) {
      throw {
        status: 404,
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      };
    }

    return repo.updateRole(userId, role);
  }

  async setStatus(userId: number, isActive: boolean) {
    const user = await repo.getById(userId);
    if (!user) {
      throw {
        status: 404,
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      };
    }

    return repo.updateStatus(userId, isActive);
  }
}
