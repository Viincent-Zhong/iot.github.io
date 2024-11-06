import {Router, Request, Response} from 'express';
import { AlertsModel } from '../models/alerts';

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
router.get('/:id?', (req: Request, res: Response) => {
    // No id = all
    // Id = one
});

/*
    Include credential (cookie)
    Body : { deviceId: string, value: number }
    Response :
        - 200, okMessage
        - 400, errorMessage
*/
router.post('/threshold', (req: Request, res: Response) => {
});

export default router;