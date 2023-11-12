import { DataTypes, Model } from "sequelize";
import sequelize from "../database/database";
import Sale from "./Sale";

interface ProductAttributes {
  id: number;
  name: string;
  price: number;
  type: number;
  amount: number;
  salePurchase: number;
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public price!: number;
  public type!: number;
  public amount!: number;
  public salePurchase!: number;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    salePurchase: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "products",
  }
);

export default Product;
