import { SensorDatasModel } from "../models/sensorDatas";

interface ISensorDatasResponse {
    timestamp: String;
    value: Number;    
}

async function getDatas(req: any, res: any) {
    const { id } = req.params;

    try {
        // Get datas (newest to oldest)
        const datas : any = await SensorDatasModel.find({
            deviceId: id
        }).sort({timestamp: -1});

        if (!datas) {
            return res.status(400).json({ message: 'Invalid device'});
        }

        const datasResponse : ISensorDatasResponse[] = datas.map((data: any) => ({
            timestamp: data.timestamp,
            value: data.value,
        }));

        return res.status(200).json(datasResponse);
    } catch(error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error'});
    }
}

export { getDatas }