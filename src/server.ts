import 'module-alias/register';
import { app } from "./app";
import connectDb from "./config/db";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary"

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_SECRET,
    api_secret: process.env.CLOUDINARY_API_KEY,
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    connectDb();
});