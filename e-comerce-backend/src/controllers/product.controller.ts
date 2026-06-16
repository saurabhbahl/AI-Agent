import { Request, Response } from 'express';
import { asString } from '../utils/params';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/ApiResponse';
import { productService } from '../services/product.service';

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const result = await productService.getProducts(req.query as Record<string, string>);
  sendResponse(res, 200, { data: result.data, pagination: result.pagination });
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getProductById(asString(req.params.id));
  sendResponse(res, 200, { data: product });
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getProductBySlug(asString(req.params.slug));
  sendResponse(res, 200, { data: product });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body);
  sendResponse(res, 201, { message: 'Product created', data: product });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.updateProduct(asString(req.params.id), req.body);
  sendResponse(res, 200, { message: 'Product updated', data: product });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await productService.deleteProduct(asString(req.params.id));
  sendResponse(res, 200, { message: 'Product deleted' });
});

export const updateInventory = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.updateInventory(asString(req.params.id), req.body.stock);
  sendResponse(res, 200, { message: 'Inventory updated', data: product });
});

export const getAdminProducts = asyncHandler(async (req: Request, res: Response) => {
  const result = await productService.getAdminProducts(req.query as Record<string, string>);
  sendResponse(res, 200, { data: result.data, pagination: result.pagination });
});

export const getLowStock = asyncHandler(async (_req: Request, res: Response) => {
  const products = await productService.getLowStock();
  sendResponse(res, 200, { data: products });
});
