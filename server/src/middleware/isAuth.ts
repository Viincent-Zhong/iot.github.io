import jwt from 'jsonwebtoken';
import { UserModel } from "../models/user";

async function isAuth(req: any, res: any, next: any) {
    try {
        const authCookie = req.cookies.token;
        const decodedToken = jwt.verify(authCookie, process.env.JWT_SECRET);
        const userId = decodedToken.id;
        const user = await UserModel.findOne({
            _id: userId
        });
        if (!user)
            return res.status(401).json({message: 'Not authorized'});
        // Add userId in the request
        req.userId = userId;
        next();
    } catch(error) {
        console.log("Auth error : ", error);
        return res.status(500).json({ message: 'Internal server error'});
    }
}

export { isAuth }