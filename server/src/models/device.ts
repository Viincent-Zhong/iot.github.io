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
    uid: { type: String, required: true },
    type: { type: String, required: true },
    usersIds: { type: [String], default: [] },
    threshold: { type: Number, default: 300 }
})

export const DeviceModel = model('Device', deviceSchema);