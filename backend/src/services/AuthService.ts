import { IUser } from '../interfaces/domain.interface';
import { UserRepository } from '../repositories/UserRepository';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry, verifyRefreshToken } from '../utils/jwt';

export class AuthService {
  private userRepository: UserRepository;
  private refreshTokenRepository: RefreshTokenRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.refreshTokenRepository = new RefreshTokenRepository();
  }

  async register(fullName: string, email: string, password: string, organizationId: number) {
    const existingUser = await this.userRepository.getByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const passwordHash = await hashPassword(password);
    const user = await this.userRepository.create({
      organizationId,
      fullName,
      email,
      passwordHash,
      role: 'MEMBER',
      isActive: true,
    });

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('User account is inactive');
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    await this.userRepository.updateLastLogin(user.id);

    const accessToken = generateAccessToken({
      userId: user.id,
      organizationId: user.organizationId,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      organizationId: user.organizationId,
      role: user.role,
    });

    await this.refreshTokenRepository.create({
      userId: user.id,
      token: refreshToken,
      expiresAt: getRefreshTokenExpiry(),
      isRevoked: false,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      },
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const tokenRecord = await this.refreshTokenRepository.getByToken(refreshToken);
    if (!tokenRecord || tokenRecord.isRevoked) {
      throw new Error('Invalid or revoked refresh token');
    }

    if (new Date() > tokenRecord.expiresAt) {
      await this.refreshTokenRepository.revoke(refreshToken);
      throw new Error('Refresh token expired');
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      await this.refreshTokenRepository.revoke(refreshToken);
      throw new Error('Invalid refresh token');
    }

    await this.refreshTokenRepository.revoke(refreshToken);

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    await this.refreshTokenRepository.create({
      userId: payload.userId,
      token: newRefreshToken,
      expiresAt: getRefreshTokenExpiry(),
      isRevoked: false,
    });

    const user = await this.userRepository.getById(payload.userId);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: user ? {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      } : null,
    };
  }

  async logout(refreshToken: string) {
    await this.refreshTokenRepository.revoke(refreshToken);
  }
}
