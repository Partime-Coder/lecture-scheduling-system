import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

app.use(express.static("public"));
app.use(cookieParser());

import userRoutes from "./routes/user.route.js";
import courseRoutes from "./routes/course.route.js";
import lectureRoutes from "./routes/lecture.route.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/lectures", lectureRoutes);

export {app};