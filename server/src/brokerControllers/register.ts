import { Types } from 'mongoose';
import { DeviceModel } from "../models/device";

async function registerDevice(message: any) {
    let data = JSON.parse(message);
    try {
        const device = await DeviceModel.findOne({
            uid: data.device
        })
        if (device)
            return;
        await DeviceModel.create({
            _id: new Types.ObjectId(),
            uid: data.device,
            type: "captor"
        })
        return;
    } catch (err) {
        console.log('Error on device registration : ', err);
    }
}

export { registerDevice }