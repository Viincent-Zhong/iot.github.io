import { Schema, model } from 'mongoose';

// SensorDatas interface
interface ISensorDatas {
    _id: Schema.Types.ObjectId;
    deviceId: Schema.Types.ObjectId;
    timestamp: Schema.Types.Date;
    value: Number;
}

// SensorDatas model
const sensorDatasSchema = new Schema<ISensorDatas>({
    _id: { type: Schema.Types.ObjectId, required: true },
    deviceId: { type: Schema.Types.ObjectId, required: true },
    timestamp: { type: Schema.Types.Date, required: true},
    value: { type: Number, required: true}
})

export const SensorDatasModel = model('SensorDatas', sensorDatasSchema);