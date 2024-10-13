import {Router, Request, Response} from 'express';

const router = Router();

/*
    Body : { email: string, name: string, password: string}
    Response :
        - 200, createdMessage
        - 400, errorMessage
*/
router.post('/register', (req: Request, res: Response) => {
});

/*
    Body : { email: string, password: string}
    Response :
        - 200, loggedMessage, auth cookie
        - 400, errorMessage
*/
router.post('/login', (req: Request, res: Response) => {
});

/*
    Include credential (cookie)
    Response :
        - 200, deleteMessage, cookie deleted
        - 400, errorMessage
*/
router.post('/logout', (req: Request, res: Response) => {
});

export default router;