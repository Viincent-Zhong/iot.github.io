import { Types } from 'mongoose';
import { SensorDatasModel } from '../models/sensorDatas';
import { DeviceModel } from '../models/device';
import { AlertsModel } from '../models/alerts';
import brokerClient from '../server-mqtt';

async function processData(message: any) {
    let data = JSON.parse(message);
    console.log("Storing ", data.device, " with value ", data.value);
    try {
        SensorDatasModel.create({
            _id: new Types.ObjectId(),
            deviceId: data.device,
            value: parseInt(data.value)
        })

        let device = await DeviceModel.findOne({
            uid: data.device
        })
        if (!device) {
            device = await DeviceModel.create({
                _id: new Types.ObjectId(),
                uid: data.device,
                type: "captor"
            })
            console.log('Created new device');
        }
        if (data.value >= device.threshold) {
            console.log('Alert on device ', data.device);
            AlertsModel.create({
                _id: new Types.ObjectId(),
                deviceId: data.device,
                value: parseInt(data.value)
            })
            brokerClient.publish('alert/' + data.device, '1');
            setTimeout(() => {
                brokerClient.publish('alert/' + data.device, '0')
            }, 30000)
            // Ping all device.userIDS
        }
    } catch (err) {
        console.log('Error storing data : ', err);
    }
}

export { processData }