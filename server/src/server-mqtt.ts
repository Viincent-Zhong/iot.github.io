import mqtt from "mqtt";
import fs from "fs";
import { processData } from "./brokerControllers/data";

// Load env locally
if (process.env.prod !== 'production')
  require('dotenv').config();

const options: any = {
    protocol: 'mqtts',
    host: process.env.BROKER_HOST,
    port: parseInt(process.env.BROKER_PORT),
    ca: [fs.readFileSync('./isrgrootx1.pem')],
    cert: fs.readFileSync('./server-broker-cert.pem'),
    key: fs.readFileSync('./server-broker-key.pem'),
    username: process.env.BROKER_USERNAME,
    password: process.env.BROKER_PASSWORD
};
  
const client = mqtt.connect(options);

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function testBroker() {
    while (true) {
        await delay(5000);  // Wait for 5 seconds
        console.log('Sending turn on')
        client.publish("alert/14484003", "1", (err) => {
            if (err) {
                console.log('Error alert : ', err);
            }
        });
        await delay(5000);
        console.log('Sending turn off')
        client.publish("alert/14484003", "0", (err) => {
            if (err) {
                console.log('Error alert : ', err);
            }
        });
    }
}

// setup the callbacks
client.on('connect', async function () {
    console.log('Connected');
    client.subscribe("data");
    //testBroker();
});

client.on('error', function (error) {
    console.log("MQTT Error : " + error);
});

client.on("message", async (topic, message: any) => {
    switch (topic) {
        case "data":
            processData(message);
            break;
    }
});

export default client;