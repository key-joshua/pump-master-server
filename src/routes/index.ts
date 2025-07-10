
import { Router } from 'express';
import authRoute from './authRoute';

const router: Router = Router();

router.use('/auth', authRoute);

export default router;
