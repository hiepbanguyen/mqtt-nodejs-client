"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt = __importStar(require("mqtt"));
const protocol = 'mqtt';
const host = 'broker.emqx.io';
const port = '1883';
const path = '/mqtt';
const clientId = `mqtt_NguyenBaHiep_30012001_Piscada_nodejs`;
const connectUrl = `${protocol}://${host}:${port}${path}`;
const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'emqx',
    password: 'public',
    reconnectPeriod: 1000,
});
const DEVICE_ID = '6f9ea7c7-6297-4283-b72d-7d673d3473fd';
const topics = [`/device/${DEVICE_ID}`, `/device/${DEVICE_ID}/Temperature`];
function generateDeviceModelPayload() {
    return { device_id: DEVICE_ID, device_name: "Tank", status: Date.now() % 2 == 0 };
}
function generateDataPointModelPayload() {
    return { device_id: DEVICE_ID, sensor_name: "Temperature", value: Math.floor(Math.random() * 101), unit: "°C" };
}
client.on('connect', () => {
    console.log('Connected');
    client.subscribe(topics, () => {
        console.log(`Subscribe to topic '${topics}'`);
        setInterval(() => {
            client.publish(topics[0], JSON.stringify(generateDeviceModelPayload()), { qos: 0, retain: false }, (error) => {
                if (error) {
                    console.error(error);
                }
            });
        }, 1000);
        setInterval(() => {
            client.publish(topics[1], JSON.stringify(generateDataPointModelPayload()), { qos: 0, retain: false }, (error) => {
                if (error) {
                    console.error(error);
                }
            });
        }, 1000);
    });
});
