import ErrorHandler from "@/common/utils/error-handler";
import { NextFunction, Request, Response } from "express";

const errorHandler = (err:any, req:Request, res:Response, next:NextFunction)=>{
    err.statusCode = err.StatusCode || 500;
    err.message = err.message || "internal server error"

    //mongodb
    if(err.name==='CastError'){
        const message = `Resource not found Invalid: ${err.path}`
        err = new ErrorHandler(message, 400)
    }
    //duplicate key error
    if(err.code == 11000){
        const message = `Duplicate ${Object.keys(err.keyvalue)} not found Invalid: ${err.key}`
        err = new ErrorHandler(message, 400)
    }

     //wrong jwt token
     if(err.name == `JsonWebTokenError`){
        const message = `Invalid Token try again`
        err = new ErrorHandler(message, 400)
    }

    //
    if(err.name == "TokkenExpiredError"){
        const message = "Your token has expired"
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}

export default errorHandler;