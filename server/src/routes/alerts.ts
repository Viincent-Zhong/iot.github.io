import {Router} from 'express';
import { getAlerts, setThreshold } from '../controllers/alerts';
import { isAuth } from '../middleware/isAuth';

const router = Router();

interface IAlertResponse {
    deviceId: String;
    timestamp: Date;
    value: Number;
}

/*
    Include credential (cookie)
    Params : id? (deviceId)
    Response :
        - 200, [IAlertResponse]
        - 400, errorMessage
*/
router.get('/:id?', isAuth, getAlerts);

/*
    Include credential (cookie)
    Body : { deviceId: string, value: number }
    Response :
        - 200, okMessage
        - 400, errorMessage
*/
router.post('/threshold', isAuth, setThreshold);

export default router;