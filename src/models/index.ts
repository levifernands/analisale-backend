import { DataTypes } from "sequelize";
import sequelize from "../database/database";
import Product from "./Product";
import Sale from "./Sale";

Sale.belongsToMany(Product, {
  through: "SaleProducts",
  foreignKey: "saleId",
  otherKey: "productId",
});

Product.belongsToMany(Sale, {
  through: "SaleProducts",
  foreignKey: "productId",
  otherKey: "saleId",
});
export { Product, Sale };
