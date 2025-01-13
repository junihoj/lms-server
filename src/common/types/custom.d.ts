import { Request } from 'express'
import { IUser } from "@/api/user/userModel"
declare global {
    namespace Express {
        interface Request {
            user: IUser,
            file: any,
        }
    }
}