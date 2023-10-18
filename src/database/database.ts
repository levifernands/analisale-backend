require("dotenv").config();
import { Sequelize } from "sequelize";

const database = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: 3306,
  }
);

export default database;
