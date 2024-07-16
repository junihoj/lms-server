import 'module-alias/register';
import { app } from "./app";
import connectDb from "./config/db";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    connectDb();
});