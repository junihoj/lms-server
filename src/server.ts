import { app } from "./app";
import connectDb from "./config/db";
require("dotenv").config();




app.listen(process.env.PORT, ()=>{
    console.log(`server is listen on port ${process.env.PORT}`)
    connectDb();
})

