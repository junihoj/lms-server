import { Queue, Worker } from "node-resque";
import { Redis } from 'ioredis';
import * as dotenv from 'dotenv';
dotenv.config();

const redisClient = () => {
    if (process.env.REDIS_URL) {
        return process.env.REDIS_URL
    } else {
        throw new Error(`REDIS CONNECTION FAILED`)
    }
}

