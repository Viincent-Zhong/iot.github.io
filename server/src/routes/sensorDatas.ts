import {Router, Request, Response} from 'express';
import { getDatas } from '../controllers/sensorDatas';
import { isAuth } from '../middleware/isAuth';
const router = Router();

interface ISensorDatasResponse {
    timestamp: Date;
    value: Number;    
}
/*
    Include credential (cookie)
    Params : id (deviceId)
    Response :
        - 200, [ISensorDatasResponse]
        - 400, errorMessage
*/
router.get('/:id', isAuth, getDatas);

export default router;