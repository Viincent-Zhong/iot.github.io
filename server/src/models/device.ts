import { Schema, model } from 'mongoose';

// Device interface
interface IDevice {
    _id: Schema.Types.ObjectId;
    uid: String;
    type: String;
    usersIds: [String];
    threshold: Number;
}

// Device model
const deviceSchema = new Schema<IDevice>({
    _id: { type: Schema.Types.ObjectId, required: true },
    uid: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, required: true },
    usersIds: { type: [String] },
    threshold: { type: Number }
})

export const DeviceModel = model('Device', deviceSchema);