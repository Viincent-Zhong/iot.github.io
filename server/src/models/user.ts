import { Schema, model } from 'mongoose';

// User interface
interface IUser {
    _id: Schema.Types.ObjectId;
}

// User model
const userSchema = new Schema<IUser>({
    _id: { type: Schema.Types.ObjectId, required: true },
})

export const UserModel = model('User', userSchema);