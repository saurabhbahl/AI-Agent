import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/ApiResponse';
import { authService } from '../services/auth.service';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body.name, req.body.email, req.body.password, res);
  sendResponse(res, 201, { message: 'Registration successful', data: result });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body.email, req.body.password, res);
  sendResponse(res, 200, { message: 'Login successful', data: result });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken as string | undefined;
  const result = await authService.refresh(token || '', res);
  sendResponse(res, 200, { message: 'Token refreshed', data: result });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await authService.logout(req.user!.userId, req.cookies.refreshToken, res);
  sendResponse(res, 200, { message: 'Logged out successfully' });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await authService.getProfile(req.user!.userId);
  sendResponse(res, 200, { data: profile });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await authService.updateProfile(req.user!.userId, req.body);
  sendResponse(res, 200, { message: 'Profile updated', data: profile });
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.changePassword(req.user!.userId, req.body.currentPassword, req.body.newPassword);
  sendResponse(res, 200, { message: 'Password changed successfully' });
});
