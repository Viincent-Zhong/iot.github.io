import { DeviceModel } from "../models/device";

interface IDeviceResponse {
    id: String;
    type: String;
    threshold: Number;
}

async function getDevices(req: any, res: any) {
    const { id } = req.params;
    const userId = req.userId;

    try {
        if (!id) {
        } else {
        }

    } catch(error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error'});
    }
}

async function linkDevice(req: any, res: any) {
    const { id } = req.params;

    try {

    } catch(error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error'});
    }
}

async function unlinkDevice(req: any, res: any) {
    const { id } = req.params;
    const userId = req.userId;

    try {
        if (!id) {
        } else {
        }

    } catch(error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error'});
    }
}

async function pingDevice(req: any, res: any) {
    const {deviceId, value} = req.body;
    try {

    } catch(error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error'});
    }
}

export { getDevices, linkDevice, unlinkDevice, pingDevice }