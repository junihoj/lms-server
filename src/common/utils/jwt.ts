import * as dotenv from 'dotenv'
import { Response } from 'express';
import { IUser } from '@/api/user/user.model';
import { redis } from '@/config/redis';


interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    samesite: "lax" | "strict" | "none" | undefined,
    secure?: boolean;
}

export const refreshTokenExp = parseInt(process.env.ACCESS_TOKEN_EXP as string) || 5
export const accessTokenExp = parseInt(process.env.REFRESH_TOKEN_EXP as string) || 300

export const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExp * 100),
    httpOnly: true,
    maxAge: accessTokenExp * 1000,
    samesite: "lax",
}

export const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExp * 100),
    httpOnly: true,
    maxAge: refreshTokenExp * 1000,
    samesite: "lax",
}
export const sendToken = (user: IUser, statuscode: number, res: Response) => {
    const accessToken = user.signAccessToken();
    const refreshToken = user.signRefreshToken();

    // upload session to redis

    redis.set(user._id as string, JSON.stringify(user) as any)


    if (process.env.NODE_ENV === 'production') {
        accessTokenOptions.secure = true
    }

    res.cookie("accessToken", accessToken, accessTokenOptions)
    res.cookie("refreshToken", refreshToken, refreshTokenOptions)
    res.status(statuscode).json({
        sucess: true,
        user,
        accessToken,
    })
}