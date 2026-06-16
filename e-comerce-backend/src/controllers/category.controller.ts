import { Request, Response } from 'express';
import { asString } from '../utils/params';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/ApiResponse';
import { categoryService } from '../services/category.service';

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await categoryService.getCategories();
  sendResponse(res, 200, { data: categories });
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.getCategoryById(asString(req.params.id));
  sendResponse(res, 200, { data: category });
});

export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.getCategoryBySlug(asString(req.params.slug));
  sendResponse(res, 200, { data: category });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);
  sendResponse(res, 201, { message: 'Category created', data: category });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.updateCategory(asString(req.params.id), req.body);
  sendResponse(res, 200, { message: 'Category updated', data: category });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await categoryService.deleteCategory(asString(req.params.id));
  sendResponse(res, 200, { message: 'Category deleted' });
});

export const getAdminCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await categoryService.getCategories(true);
  sendResponse(res, 200, { data: categories });
});
