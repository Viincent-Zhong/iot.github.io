import { Router } from "express";
import userRouter from './user'
import deviceRouter from './device'
import sensorDatasRouter from './sensorDatas'
import alertsRouter from './alerts'

const router = Router();

router.use('/', userRouter);
router.use('/device', deviceRouter);
router.use('sensor-datas', sensorDatasRouter);
router.use('/alerts', alertsRouter);

export default router;