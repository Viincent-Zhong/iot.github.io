import { Schema, model } from 'mongoose';

// Device interface
interface IDevice {
    _id: Schema.Types.ObjectId;
    uid: Schema.Types.ObjectId;
    type: String;
    usersIds: [Schema.Types.ObjectId];
    threshold: Number;
}

// Device model
const deviceSchema = new Schema<IDevice>({
    _id: { type: Schema.Types.ObjectId, required: true },
    uid: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, required: true },
    usersIds: { type: [Schema.Types.ObjectId] },
    threshold: { type: Number }
})

export const DeviceModel = model('Device', deviceSchema);