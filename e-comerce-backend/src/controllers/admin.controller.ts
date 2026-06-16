import { Request, Response } from 'express';
import { asString } from '../utils/params';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/ApiResponse';
import { adminService } from '../services/admin.service';

export const getDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await adminService.getDashboardStats();
  sendResponse(res, 200, { data: stats });
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await adminService.getUsers(req.query as Record<string, string>);
  sendResponse(res, 200, { data: result.data, pagination: result.pagination });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await adminService.updateUser(asString(req.params.userId), req.body);
  sendResponse(res, 200, { message: 'User updated', data: user });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await adminService.deleteUser(asString(req.params.userId));
  sendResponse(res, 200, { message: 'User deleted' });
});
