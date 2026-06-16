import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { validate } from '../middleware/validate.middleware';
import { productQuerySchema, mongoIdSchema, productSlugSchema } from '../validators/schemas';

const router = Router();

router.get('/', validate(productQuerySchema, 'query'), productController.getProducts);
router.get('/slug/:slug', validate(productSlugSchema, 'params'), productController.getProductBySlug);
router.get('/:id', validate(mongoIdSchema, 'params'), productController.getProductById);

export default router;
