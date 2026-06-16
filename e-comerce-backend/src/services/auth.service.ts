import { Response } from 'express';
import { env } from '../config/env';
import {
  UnauthorizedError,
  ConflictError,
  NotFoundError,
  BadRequestError,
} from '../utils/ApiError';
import { userRepository } from '../repositories/user.repository';
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  getRefreshTokenExpiry,
} from '../utils/jwt';
import { UserRole } from '../types';
import { IUser } from '../models/User.model';

const sanitizeUser = (user: IUser) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  phone: user.phone,
  addresses: user.addresses,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

const setRefreshTokenCookie = (res: Response, token: string): void => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth/refresh',
  });
};

export class AuthService {
  async register(name: string, email: string, password: string, res: Response) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new ConflictError('Email already registered');

    const user = await userRepository.create({
      name,
      email,
      password,
      role: UserRole.CUSTOMER,
    });

    const tokens = await this.issueTokens(user, res);
    return { user: sanitizeUser(user), ...tokens };
  }

  async login(email: string, password: string, res: Response) {
    const user = await userRepository.findByEmail(email, true);
    if (!user || !(await user.comparePassword(password))) {
      throw new UnauthorizedError('Invalid email or password');
    }
    if (!user.isActive) throw new UnauthorizedError('Account is deactivated');

    const tokens = await this.issueTokens(user, res);
    return { user: sanitizeUser(user), ...tokens };
  }

  async refresh(refreshToken: string, res: Response) {
    if (!refreshToken) throw new UnauthorizedError('Refresh token required');

    const hashed = hashToken(refreshToken);
    const user = await userRepository.findByRefreshToken(hashed);

    if (!user) throw new UnauthorizedError('Invalid refresh token');

    user.refreshTokens = user.refreshTokens.filter((t) => t.token !== hashed);
    await user.save();

    const tokens = await this.issueTokens(user, res);
    return { user: sanitizeUser(user), ...tokens };
  }

  async logout(userId: string, refreshToken: string | undefined, res: Response) {
    const user = await userRepository.findById(userId);
    if (user && refreshToken) {
      const hashed = hashToken(refreshToken);
      user.refreshTokens = user.refreshTokens.filter((t) => t.token !== hashed);
      await user.save();
    }
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
  }

  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    return sanitizeUser(user);
  }

  async updateProfile(userId: string, data: { name?: string; phone?: string; avatar?: string }) {
    const user = await userRepository.updateById(userId, data);
    if (!user) throw new NotFoundError('User not found');
    return sanitizeUser(user);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await userRepository.findByEmail(
      (await userRepository.findById(userId))?.email || '',
      true,
    );
    if (!user) throw new NotFoundError('User not found');
    if (!(await user.comparePassword(currentPassword))) {
      throw new BadRequestError('Current password is incorrect');
    }
    user.password = newPassword;
    await user.save();
  }

  private async issueTokens(user: IUser, res: Response) {
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken();
    const hashedRefresh = hashToken(refreshToken);

    user.refreshTokens.push({ token: hashedRefresh, expiresAt: getRefreshTokenExpiry() });
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    await user.save();

    setRefreshTokenCookie(res, refreshToken);
    return { accessToken };
  }
}

export const authService = new AuthService();
