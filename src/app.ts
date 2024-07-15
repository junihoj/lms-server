import 'reflect-metadata'
import express from "express";
import cookieParser from "cookie-parser";
import { corsPolicy } from "@/config/cors";
import errorHandler from "@/common/middleware/errorHandler";
import appRoutes from "./routes";

export const app = express()

app.use(express.json({limit:"50mb"}));

app.use(cookieParser())

app.use(corsPolicy)



app.get("/", (_req, res)=>{
    res.status(200).json({
        success:true,
        "message":"Server is working fine"
    })
})
appRoutes(app);
app.all("*", (req, res, next)=>{
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.message = "Route not found";
    next(err);
})

app.use(errorHandler);