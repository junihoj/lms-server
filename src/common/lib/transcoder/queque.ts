import { Queue } from "node-resque";
import { redis } from "@/config/redis";
const queue = new Queue({
    connection: {
        redis: redis,
    },

});