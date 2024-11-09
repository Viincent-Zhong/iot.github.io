import { Router } from 'express';
import { isAuth } from '../middleware/isAuth';
import { UserModel } from '../models/user';

const router = Router();

/*
    Include credential (cookie)
    Body : {subscription}
    Response :
        - 200, okMessage
        - 400, errorMessage
*/
router.post('/subscribe', isAuth, async (req: any, res: any) => {
    const userId = req.userId;
    const subscription = req.body.subscription;

    if (!subscription)
        return res.status(400).json({ message: 'Invalid input'});
    try {
        const user = await UserModel.updateOne({
            _id: userId
        }, {
            subscription: subscription
        })
        if (!user)
            return res.status(400).json({ message: 'Error'});
        return res.status(200).json({message: 'Subscribed'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error'});
    }
});

/*
    Include credential (cookie)
    Response :
        - 200, {publickey: string}
        - 400, errorMessage
*/
router.get('/vapid-key', isAuth, async (req: any, res: any) => {
    const userId = req.userId;

    try {
        const user = await UserModel.findOne({
            _id: userId
        })
        if (!user)
            return res.status(400).json({ message: 'Error'});
        return res.status(200).json({ publickey: user.vapid.publicKey});
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error'});
    }
});

export default router;