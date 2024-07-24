import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/error-handler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "@/config/redis";


export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return next(new ErrorHandler("Authorize Please login Access Resource", 403));
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN as string) as JwtPayload;
    if (!decoded) {
        return next(new ErrorHandler("Authorize Please login Access Resource", 403));
    }

    const user = await redis.get(decoded?.id);

    if (!user) {
        return next(new ErrorHandler("User not Found", 404))
    }

    req.user = JSON.parse(user);

    next();

}


export const authorizRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role || "")) {
            return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed to access this resource`, 403))
        }

        next();
    }
}