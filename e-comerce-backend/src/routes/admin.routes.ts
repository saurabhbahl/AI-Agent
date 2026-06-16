import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import * as productController from '../controllers/product.controller';
import * as categoryController from '../controllers/category.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createProductSchema,
  updateProductSchema,
  createCategorySchema,
  updateCategorySchema,
  updateUserSchema,
  inventoryUpdateSchema,
  mongoIdSchema,
  userIdParamSchema,
  paginationQuerySchema,
  productQuerySchema,
} from '../validators/schemas';
import { UserRole } from '../types';
import { adminOrderRouter } from './order.routes';

const router = Router();

router.use(authenticate, authorize(UserRole.ADMIN));

router.get('/dashboard', adminController.getDashboard);

router.get('/users', validate(paginationQuerySchema, 'query'), adminController.getUsers);
router.put('/users/:userId', validate(userIdParamSchema, 'params'), validate(updateUserSchema), adminController.updateUser);
router.delete('/users/:userId', validate(userIdParamSchema, 'params'), adminController.deleteUser);

router.get('/products', validate(productQuerySchema, 'query'), productController.getAdminProducts);
router.post('/products', validate(createProductSchema), productController.createProduct);
router.put('/products/:id', validate(mongoIdSchema, 'params'), validate(updateProductSchema), productController.updateProduct);
router.delete('/products/:id', validate(mongoIdSchema, 'params'), productController.deleteProduct);
router.patch('/products/:id/inventory', validate(mongoIdSchema, 'params'), validate(inventoryUpdateSchema), productController.updateInventory);
router.get('/products/inventory/low-stock', productController.getLowStock);

router.get('/categories', categoryController.getAdminCategories);
router.post('/categories', validate(createCategorySchema), categoryController.createCategory);
router.put('/categories/:id', validate(mongoIdSchema, 'params'), validate(updateCategorySchema), categoryController.updateCategory);
router.delete('/categories/:id', validate(mongoIdSchema, 'params'), categoryController.deleteCategory);

router.use('/orders', adminOrderRouter);

export default router;
