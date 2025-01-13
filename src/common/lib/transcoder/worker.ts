import { Queue, Worker } from "node-resque";
import { Redis } from 'ioredis';
import { redis } from "@/config/redis";
// import * as dotenv from 'dotenv';
// dotenv.config();

// const redisClient = () => {
//     if (process.env.REDIS_URL) {
//         return process.env.REDIS_URL
//     } else {
//         throw new Error(`REDIS CONNECTION FAILED`)
//     }
// }


// export const redis = new Redis(redisClient())
const worker = new Worker({
    connection: {
        redis: redis,
    },
    queues: ["video_processing"],

},);


const queque = new Queue({})