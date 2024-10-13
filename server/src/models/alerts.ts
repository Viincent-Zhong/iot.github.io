import { Schema, model } from 'mongoose';

// Alerts interface
interface IAlerts {
    _id: Schema.Types.ObjectId;
    deviceId: Schema.Types.ObjectId;
    timestamp: Schema.Types.Date;
    value: Number;
    userId: Schema.Types.ObjectId;
}

// Alerts model
const alertsSchema = new Schema<IAlerts>({
    _id: { type: Schema.Types.ObjectId, required: true },
    deviceId: { type: Schema.Types.ObjectId, required: true },
    timestamp: { type: Schema.Types.Date, required: true },
    value: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, required: true }
})

export const AlertsModel = model('Alerts', alertsSchema);