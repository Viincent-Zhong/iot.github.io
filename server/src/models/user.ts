import { Schema, model } from 'mongoose';

// User interface
interface IUser {
    _id: Schema.Types.ObjectId;
    email: String;
    name: String;
    password: String;
    vapid: {
        mailto: String,
        publicKey: String,
        privateKey: String
    },
    subscription: PushSubscription
}

// User model
const userSchema = new Schema<IUser>({
    _id: { type: Schema.Types.ObjectId, required: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    vapid: {
        mailto: { type: String, required: true },
        publicKey: { type: String, required: true },
        privateKey: { type: String, required: true }
    },
    subscription: { type: PushSubscription }
})

export const UserModel = model('User', userSchema);