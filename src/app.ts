import express from "express";
import cors from "cors";
import logger from "morgan";
import bodyParser from "body-parser";
import sequelize from "./database/database";
import swaggerUi from "swagger-ui-express";
const swaggerDocument = require("./docs/swagger.json");

import { router } from "./routes/route";

export const app = express();

app.use(express.json());
app.use(cors());
app.use(logger("dev"));

// middleware
app.use(bodyParser.json());

app.use(router);

//Documentation route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

sequelize.sync({ force: true }).then(() => {
  console.log("Models synchronized with database");
});
