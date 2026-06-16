import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createReviewSchema, mongoIdSchema } from '../validators/schemas';
import { paginationQuerySchema } from '../validators/schemas';

const router = Router({ mergeParams: true });

router.get('/', validate(paginationQuerySchema, 'query'), reviewController.getProductReviews);
router.post('/', authenticate, validate(createReviewSchema), reviewController.createReview);

export default router;

export const reviewDeleteRouter = Router();
reviewDeleteRouter.delete('/:id', authenticate, validate(mongoIdSchema, 'params'), reviewController.deleteReview);
