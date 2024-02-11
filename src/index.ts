import * as chains from "viem/chains";
import config from './config.toml';
import { debounce } from 'lodash';
import QueueManager from "../QueueManager";
import { dayToMS, getNextMS, minuteToMS, secondToMS } from "./utils";

const chain = chains.bsc;

const transactions : Payment[]= [
    { address: '0x00078dbd620934e6DB168E615EB75cCFA3784528', amount: 100, created_at: new Date().getTime(), age: 0 },
    { address: '0x36696169C63e42cd08ce11f5deeBbCeBae652050', amount: 100, created_at: new Date().getTime(), age: 0 },
    { address: '0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE', amount: 100, created_at: new Date().getTime(), age: 0 },
    { address: '0x0966602E47F6a3CA5692529F1D54EcD1d9B09175', amount: 100, created_at: new Date().getTime(), age: 0 },
    { address: '0xd3D3a295bE556Cf8cef2a7FF4cda23D22c4627E8', amount: 100, created_at: new Date().getTime(), age: 0 },
];

const MAX_QUEUE_LIMIT = 10;
const MAX_QUEUE_TIMEOUT = 1000;

// const manager = new QueueManager(queue => { throw Error('sss'); },
// MAX_QUEUE_TIMEOUT, MAX_QUEUE_LIMIT);


// function delay(time: number) {
//     return new Promise(resolve => setTimeout(resolve, time));
// }

// for(let i = 0; i < 100; i++) {
//     manager.enqueue(i);
//     await delay(10);
// }

// for(let i = 1; i <= dayToMS(1); i += minuteToMS(10)) {
//     let next = getNextMS(i);
//     if (next !== null){
//         console.log(`Age is ${i/minuteToMS(1)} minutes, next iteration will be ${next/secondToMS(1)}`);
//     }
// }

Bun.serve({
  port: 9000,
  async fetch(req) {
    const url = new URL(req.url);
    if (req.method === "POST" && url.pathname === "/payment") {
      try {
        console.log(req)
        console.log(await req.json())
      } catch (_) {
        return new Response(null, { status: 400 });
      }
    }

    if (req.method === "GET") {
      try {
        const path = new URL(req.url).pathname;
        const file = Bun.file(`./public${path}`);
        if (!await file.exists()) throw Error();
        if (file.size !== 0) return new Response(file);
      } catch (error) {
        return new Response(null, { status: 404 });
      }
    }

    return new Response(null, { status: 404 });
  }
});