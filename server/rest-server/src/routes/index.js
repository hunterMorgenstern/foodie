import express from 'express';

import authRouter from '../components/auth/authRouter';
import menuRouter from '../components/menu/menuRouter';
import cartRouter from '../components/cart/cartRouter';
import businessRouter from '../components/business/businessRouter';
import searchRestaurantsRouter from '../components/Feed/searchRestaurantsRouter';
import poolRouter from '../components/pool/poolRouter';
import reviewsRouter from '../components/reviews/reviewsRouter';
import chatRouter from '../components/chat/chatRouter';
import paymentsRouter from '../components/stripe/paymentsRouter';
import ordersRouter from '../components/orders/ordersRouter';

import { resolve } from 'path';

const router = express.Router();

router
  .route('/')
  .get((req, res) =>
    res.sendFile(resolve(__dirname, '../../../../client/public/index.html'))
  );

router.use('/api/auth', authRouter);

router.use('/api/users', searchRestaurantsRouter);

router.use('/api/menu', menuRouter);

router.use('/api/cart', cartRouter);

router.use('/api/business', businessRouter);

router.use('/api/pool', poolRouter);

router.use('/api/stripe', paymentsRouter);

router.use('/api/reviews', reviewsRouter);

router.use('/api/chat', chatRouter);
router.use('/api/orders', ordersRouter);

export default router;
