import * as mqtt from "mqtt"

const protocol = 'mqtt'
const host = 'broker.emqx.io'
const port = '1883'
const path = '/mqtt'
const clientId = `mqtt_NguyenBaHiep_30012001_Piscada_nodejs`;

const connectUrl = `${protocol}://${host}:${port}${path}`

const client : mqtt.MqttClient = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'emqx',
  password: 'public',
  reconnectPeriod: 1000,
});

const DEVICE_ID = '6f9ea7c7-6297-4283-b72d-7d673d3473fd';
const topics = [`/device/${DEVICE_ID}`, `/device/${DEVICE_ID}/Temperature`];

type DeviceModel = {
  device_id: string;
  device_name: string;
  status: boolean;
}

type DataPointModel = {
  device_id: string;
  sensor_name: string;
  value: number;
  unit: string;
}

function generateDeviceModelPayload(): DeviceModel {
  return {device_id: DEVICE_ID, device_name: "Tank", status: Date.now() % 2 == 0};
}

function generateDataPointModelPayload(): DataPointModel {
  return {device_id: DEVICE_ID, sensor_name: "Temperature", value: Math.floor(Math.random() * 101), unit: "°C"};
}

client.on('connect', () => {
  console.log('Connected')

  setInterval(() => {
    client.publish(topics[0], JSON.stringify(generateDeviceModelPayload()), { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error)
      }
    })  
  }, 1000);

  setInterval(() => {
    client.publish(topics[1], JSON.stringify(generateDataPointModelPayload()), { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error)
      }
    })  
  }, 1000);

});