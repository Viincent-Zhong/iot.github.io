import { Schema, model } from 'mongoose';

// Alerts interface
interface IAlerts {
    _id: Schema.Types.ObjectId;
    deviceId: String;
    timestamp: Schema.Types.Date;
    value: Number;
}

// Alerts model
const alertsSchema = new Schema<IAlerts>({
    _id: { type: Schema.Types.ObjectId, required: true },
    deviceId: { type: String, required: true },
    timestamp: { type: Schema.Types.Date, required: true },
    value: { type: Number, required: true },
})

export const AlertsModel = model('Alerts', alertsSchema);