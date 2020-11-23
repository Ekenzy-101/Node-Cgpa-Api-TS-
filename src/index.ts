import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import "express-async-errors";

import connectDB from "./startup/db";

import usersRouter from "./routes/user";
import authRouter from "./routes/auth";
dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors({ origin: true }));
app.use(express.json());
app.use("/api/users", usersRouter);
// app.use("/api/courses", coursesRouter);
app.use("/api/auth", authRouter);
// app.use(error);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
