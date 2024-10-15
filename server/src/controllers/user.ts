import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from "../models/user";

const validateEmail = (email: string) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

async function register(req: any, res: any) {
    const {email, name, password } = req.body;

    if (!email || !name || !password || !validateEmail(email))
        return res.status(400).json({message: 'Incorrect input provided.'});
    try {
        const user = await UserModel.findOne({ email: email });
        if (user)
            return res.status(400).json({message: 'Email already exists'});
        const hashedPassword = bcrypt.hashSync(password, 10);

        await UserModel.create({
            _id: new Types.ObjectId(),
            email: email,
            name: name,
            password: hashedPassword
        })
        return res.status(200).json({ message: 'User created' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error'});
    }
}

async function login(req: any, res: any) {
    const {email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({message: 'Incorrect input provided.'});

    try {
        const user = await UserModel.findOne({
            email: email
        });
        if (!user)
            return res.status(400).json({message: 'Incorrect input.'});

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(400).json({message: 'Incorrect input.'});

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: '1h'});
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.prod === 'production',
            sameSite: 'strict'
        });
        return res.status(200).json({message: 'Signed in'});
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

async function logout(req: any, res: any) {
    const authCookie = req.cookies.token;

    if (!authCookie) {
        return res.status(401).json({ message: 'Not logged in'});
    }
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out' });
}

export { register, login, logout }