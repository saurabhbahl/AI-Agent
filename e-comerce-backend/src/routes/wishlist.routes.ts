import { Router } from 'express';
import * as wishlistController from '../controllers/wishlist.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { wishlistItemSchema, productIdParamSchema } from '../validators/schemas';

const router = Router();

router.use(authenticate);

router.get('/', wishlistController.getWishlist);
router.post('/', validate(wishlistItemSchema), wishlistController.addToWishlist);
router.delete('/:productId', validate(productIdParamSchema, 'params'), wishlistController.removeFromWishlist);

export default router;
