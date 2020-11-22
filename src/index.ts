import dotenv from "dotenv";
import express from "express";
import "express-async-errors";

import connectDB from "./startup/db";

dotenv.config();

connectDB();

const app = express();

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
