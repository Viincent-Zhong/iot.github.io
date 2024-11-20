import { Schema, model } from 'mongoose';

// SensorDatas interface
interface ISensorDatas {
    _id: Schema.Types.ObjectId;
    deviceId: String;
    timestamp: String;
    value: Number;
}

// SensorDatas model
const sensorDatasSchema = new Schema<ISensorDatas>({
    _id: { type: Schema.Types.ObjectId, required: true },
    deviceId: { type: String, required: true },
    timestamp: { type: String, required: true},
    value: { type: Number, required: true}
})

export const SensorDatasModel = model('SensorDatas', sensorDatasSchema);