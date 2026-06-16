import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { cartItemSchema, updateCartItemSchema, productIdParamSchema } from '../validators/schemas';

const router = Router();

router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/', validate(cartItemSchema), cartController.addToCart);
router.put('/:productId', validate(productIdParamSchema, 'params'), validate(updateCartItemSchema), cartController.updateCartItem);
router.delete('/:productId', validate(productIdParamSchema, 'params'), cartController.removeFromCart);
router.delete('/', cartController.clearCart);

export default router;
