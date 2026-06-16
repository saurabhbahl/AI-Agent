import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createOrderSchema, orderIdParamSchema, updateOrderStatusSchema } from '../validators/schemas';
import { UserRole } from '../types';

const router = Router();

router.use(authenticate);

router.post('/', validate(createOrderSchema), orderController.createOrder);
router.get('/my', orderController.getMyOrders);
router.get('/:orderId', validate(orderIdParamSchema, 'params'), orderController.getOrderById);

export default router;

export const adminOrderRouter = Router();
adminOrderRouter.use(authenticate, authorize(UserRole.ADMIN));
adminOrderRouter.get('/', orderController.getAllOrders);
adminOrderRouter.put(
  '/:orderId/status',
  validate(orderIdParamSchema, 'params'),
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus,
);
