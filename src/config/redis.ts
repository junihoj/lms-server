import * as dotenv from 'dotenv';
import { Redis } from 'ioredis';

dotenv.config()
const redisClient = ()=>{
    if(process.env.REDIS_URL){
        return process.env.REDIS_URL
    }else{
        throw new Error(`REDIS CONNECTION FAILED`)
    }
}


export const redis = new Redis(redisClient())