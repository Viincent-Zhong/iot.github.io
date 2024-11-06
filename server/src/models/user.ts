import { Schema, model } from 'mongoose';

// User interface
interface IUser {
    _id: Schema.Types.ObjectId;
    email: String;
    name: String;
    password: String;
}

// User model
const userSchema = new Schema<IUser>({
    _id: { type: Schema.Types.ObjectId, required: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true }
})

export const UserModel = model('User', userSchema);