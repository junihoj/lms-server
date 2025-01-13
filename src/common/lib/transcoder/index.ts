
import { Worker, Plugins, Scheduler, Queue } from "node-resque";

async function boot() {
    const connectionDetails = {
        pkg: "ioredis",
        host: "127.0.0.1",
        password: null,
        port: 6379,
        database: 0,
        // namespace: 'resque',
        // looping: true,
        // options: {password: 'abc'},
    };

}