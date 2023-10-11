import express from "express";
import cors from "cors";
import logger from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import { router } from "./routes/route";

export const app = express();

app.use(express.json());
app.use(cors());
app.use(logger("dev"));

// middleware
app.use(bodyParser.json());

// use user routes
app.use("/users", router);
