import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import "express-async-errors";

import connectDB from "./startup/db";

import usersRouter from "./routes/user";
import authRouter from "./routes/auth";
import coursesRouter from "./routes/course";
import error from "./middlewares/error";
dotenv.config();

connectDB();

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(express.json());
app.use(cors({ origin: true }));
app.use("/api/users", usersRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/auth", authRouter);
app.use(error);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
