import { Router } from 'express';
import { register, login, logout } from '../controllers/user';

const router = Router();

/*
    Body : { email: string, name: string, password: string}
    Response :
        - 200, createdMessage
        - 400, errorMessage
*/
router.post('/register', register)

/*
    Body : { email: string, password: string}
    Response :
        - 200, loggedMessage, auth cookie
        - 400, errorMessage
*/
router.post('/login', login)

/*
    Include credential (cookie)
    Response :
        - 200, deleteMessage, cookie deleted
        - 400, errorMessage
*/
router.post('/logout', logout)

export default router;