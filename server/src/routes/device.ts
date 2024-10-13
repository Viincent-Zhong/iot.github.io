import {Router, Request, Response} from 'express';

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
router.get('/:id?', (req: Request, res: Response) => {
    // No id = all
    // Id = one
});

/*
    Include credential (cookie)
    Params: id (deviceId)
    Response :
        - 200, okMessage
        - 400, errorMessage
*/
router.post('/link/:id', (req: Request, res: Response) => {
});

/*
    Include credential (cookie)
    Params : id? (deviceId)
    Response :
        - 200, okMessage
        - 400, errorMessage
*/
router.delete('/unlink/:id?', (req: Request, res: Response) => {
    // No id = all
    // Id = one
});

/*
    Include credential (cookie)
    Params : id? (deviceId)
    Response :
        - 200, okMessage
        - 400, errorMessage
*/
router.post('/ping/:id?', (req: Request, res: Response) => {
    // No id = all
    // Id = one
});

export default router;