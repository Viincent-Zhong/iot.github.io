import { DeviceModel } from "../models/device";
import { UserModel } from "../models/user";
import brokerClient from "../server-mqtt"

interface IDeviceResponse {
    id: String;
    type: String;
    threshold: Number;
}

async function getDevices(req: any, res: any) {
    const { id } = req.params;
    const userId = req.userId;

    try {
        if (!id) { // All devices
            const devices = await DeviceModel.find({
                usersIds: userId
            })
            if (!devices)
                return res.status(400).json({message: 'Could not get devices'});

            const devicesResponse: IDeviceResponse[] = devices.map((device : any) => ({
                id: device.uid,
                type: device.type,
                threshold: device.threshold
            }));
    
            return res.status(200).json(devicesResponse);
        } else { // Single device
            const device = await DeviceModel.findOne({
                uid: id,
                usersIds: userId
            })
            if (!device)
                return res.status(400).json({message: 'Could not get devices'});
            
            const devicesResponse: IDeviceResponse[] = [{
                id: device.uid,
                type: device.type,
                threshold: device.threshold
            }];
            return res.status(200).json(devicesResponse);
        }
    } catch(error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error'});
    }
}

async function linkDevice(req: any, res: any) {
    const { id } = req.params;
    const userId = req.userId;

    try {
        const result = await DeviceModel.updateOne(
            {
                uid: id
            },
            {
                $addToSet: {usersIds: userId}
            }
        );

        if (!result)
            return res.status(400).json({message: "Failed to link"});

        return res.status(200).json({message: "Linked"});
    } catch(error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error'});
    }
}

async function unlinkDevice(req: any, res: any) {
    const { id } = req.params;
    const userId = req.userId;

    try {
        let result : any;
        if (!id) {
            // Unlink all devices
            result = await DeviceModel.updateMany(
                {
                    usersIds: userId
                },
                {
                    $pull: {usersIds: userId}
                }
            )
        } else {
            // Unlink specified device
            result = await DeviceModel.updateOne(
                {
                    uid: id,
                    usersIds: userId
                },
                {
                    $pull: {usersIds: userId}
                }
            )
        }

        if (!result)
            return res.status(400).json({message: "Failed to unlink"});

        return res.status(200).json({message: "Unlinked"});
    } catch(error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error'});
    }
}

async function pingDevice(req: any, res: any) {
    const {deviceId, value} = req.body;
    const userId = req.userId;
    try {
        const device = await DeviceModel.findOne({
            uid: deviceId,
            usersIds: userId
        })
        if (!device)
            return res.status(400).json({message: 'Could not ping device'});

        brokerClient.publish('alert/' + deviceId, value);

        return res.status(200).json({ message: 'Pinged device'})
    } catch(error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error'});
    }
}

export { getDevices, linkDevice, unlinkDevice, pingDevice }