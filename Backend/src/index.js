import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});

import connectDB from "./database/db.js";
import { app } from "./app.js";


const PORT = process.env.PORT || 8000;

connectDB()
.then(() => {
    const server = app.listen(PORT,() => {
        console.log(`Server is running at port ${PORT}`);
    })
    server.on("error",(error) => {
        console.log("Error occurred while starting the server !!! ",error);
        process.exit(1)
    });

})
.catch((error) => {
    console.log("MongoDB Connection failed !!! ",error)
});