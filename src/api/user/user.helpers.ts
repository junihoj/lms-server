import { redis } from "@/config/redis";
import UserModel from "./user.model"

export const getUserById = async (id: string) => {
    let session = await redis.get(id);
    const user = JSON.parse(session as string);
    return user;
}