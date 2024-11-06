import {Router} from 'express';
import { isAuth } from '../middleware/isAuth';
import { getDevices, linkDevice, unlinkDevice, pingDevice } from '../controllers/device';

const router = Router();

interface IDeviceResponse {
    id: String;
    type: String;
    threshold: Number;
}

/*
    Include credential (cookie)
    Params : id? (deviceId)
    Response :
        - 200, [IDeviceResponse]
        - 400, errorMessage
*/
router.get('/:id?', isAuth, getDevices);

/*
    Include credential (cookie)
    Params: id (deviceId)
    Response :
        - 200, okMessage
        - 400, errorMessage
*/
router.post('/link/:id', isAuth, linkDevice);

/*
    Include credential (cookie)
    Params : id? (deviceId)
    Response :
        - 200, okMessage
        - 400, errorMessage
*/
router.delete('/unlink/:id?', isAuth, unlinkDevice);

/*
    Include credential (cookie)
    Body : { deviceId: string, value: string ('1' or '0')}
    Response :
        - 200, okMessage
        - 400, errorMessage
*/
router.post('/ping', isAuth, pingDevice);

export default router;