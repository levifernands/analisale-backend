import express from "express";
import cors from "cors";
import logger from "morgan";
import bodyParser from "body-parser";
import sequelize from "./database/database";

import { router } from "./routes/route";

export const app = express();

app.use(express.json());
app.use(cors());
app.use(logger("dev"));

// middleware
app.use(bodyParser.json());

app.use(router);

sequelize.sync({ force: true }).then(() => {
  console.log("Models synchronized with database");
});
