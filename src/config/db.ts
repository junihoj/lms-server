import mongoose from "mongoose";
import * as dotenv from 'dotenv';

dotenv.config();

const connectDb = async ()=>{
    try{
        await  mongoose.connect(process.env.DB_URL as string, {

        })
        console.log("CONNECTED TO DATABASE")
    }catch(err:any){
       if(err?.message){
        console.log(err.message)
       }
       setTimeout(connectDb, 5000)
    }
   
}
export default connectDb;