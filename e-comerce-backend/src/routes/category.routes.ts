import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { validate } from '../middleware/validate.middleware';
import { mongoIdSchema, categorySlugSchema } from '../validators/schemas';

const router = Router();

router.get('/', categoryController.getCategories);
router.get('/slug/:slug', validate(categorySlugSchema, 'params'), categoryController.getCategoryBySlug);
router.get('/:id', validate(mongoIdSchema, 'params'), categoryController.getCategoryById);

export default router;
