import { NextFunction, Request, RequestHandler, Response } from "express";

export default function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}