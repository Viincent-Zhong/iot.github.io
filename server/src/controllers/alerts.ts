import { AlertsModel } from '../models/alerts';
import { DeviceModel } from "../models/device";

interface IAlertResponse {
    deviceId: String;
    alerts: {
        timestamp: Date;
        value: Number;
    }[];
}

async function getAlerts(req: any, res: any) {
    const { id } = req.params;
    const userId = req.userId;

    try {
        if (!id) { // Get alerts from all devices from this user
            const devices = await DeviceModel.find({
                usersIds: userId
            })

            if (!devices)
                return res.status(400).json({ message: 'Invalid devices'});

            const alertsResponse : IAlertResponse[] = await Promise.all(devices.map(async (device: any) => {
                const datas = await AlertsModel.find({
                    deviceId: device.uid
                }).sort({timestamp: -1});
                return {
                    deviceId: device.uid,
                    alerts: datas.map((data: any) => ({
                        timestamp: data.timestamp,
                        value: data.value
                    }))
                }
            }));
            return res.status(200).json(alertsResponse);
        } else {
            const datas = await AlertsModel.find({
                deviceId: id
            }).sort({timestamp: -1});

            const datasResponse : IAlertResponse[] = [{
                deviceId: id,
                alerts: datas.map((data: any) => ({
                    timestamp: data.timestamp,
                    value: data.value
                }))
            }]
            return res.status(200).json(datasResponse);
        }
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
                usersIds: userId
            },
            {
                threshold: parseInt(value)
            }
        );

        if (!result || !result.upsertedId)
            return res.status(400).json({ message: 'Could not update threshold'});

        return res.status(200).json({ message: 'Threshold updated'});
    } catch(error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error'});
    }
}

export { getAlerts, setThreshold }