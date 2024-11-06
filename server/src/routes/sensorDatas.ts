import {Router, Request, Response} from 'express';

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
router.get('/:id', (req: Request, res: Response) => {
});

export default router;