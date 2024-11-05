import {Router} from 'express';
import { isAuth } from '../middleware/isAuth';

const router = Router();

router.get('/subscribe', isAuth, () => {});

// router.post('/push', isAuth, () => {});

export default router;