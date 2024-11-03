import { AlertsModel } from '../models/alerts';
import { DeviceModel } from "../models/device";

interface IAlertResponse {
    deviceId: String;
    timestamp: Date;
    value: Number;
}

async function getAlerts(req: any, res: any) {
    const { id } = req.params;
    const userId = req.userId;

    try {
        // Get datas (newest to oldest)
        let datas : any;

        if (!id) { // Get alerts from all devices from this user
            datas = await AlertsModel.find({
                userId: userId
            }).sort({timestamp: -1});
        } else {
            datas = await AlertsModel.find({
                deviceId: id,
                userId: userId
            }).sort({timestamp: -1});
        }

        if (!datas)
            return res.status(400).json({ message: 'Invalid device'});

        const datasResponse : [IAlertResponse] = datas.map((data: any) => ({
            timestamp: data.timestamp,
            value: data.value,
            deviceId: data.deviceId
        }));

        return res.status(200).json(datasResponse);
    } catch(error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error'});
    }
}

async function setThreshold(req: any, res: any) {
    const { deviceId, value } = req.body;
    const userId = req.userId;

    try {
        const result = await DeviceModel.updateOne(
            {
                uid: deviceId,
                usersIds: {$in: [userId]}
            },
            {
                threshold: parseInt(value)
            }
        );

        if (!result)
            return res.status(400).json({ message: 'Could not update threshold'});

        return res.status(200).json({ message: 'Threshold updated'});
    } catch(error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error'});
    }
}

export { getAlerts, setThreshold }