import { Types } from 'mongoose';
import { SensorDatasModel } from '../models/sensorDatas';
import brokerClient from '../server-mqtt';

async function processData(message: any) {
    let data = JSON.parse(message);
    console.log("Storing ", data.device, " with value ", data.value);
    try {
        await SensorDatasModel.create({
            _id: new Types.ObjectId(),
            deviceId: data.device,
            value: parseInt(data.value)
        })

        // Alerte
    } catch (err) {
        console.log('Error storing data : ', err);
    }
}

export { processData }