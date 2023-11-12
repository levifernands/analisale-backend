import { DataTypes, Model } from "sequelize";
import sequelize from "../database/database";
import Product from "./Product";

interface SaleAttributes {
  id: number;
  productName: string;
  quantity: number;
  totalPrice: number;
}

class Sale extends Model<SaleAttributes> implements SaleAttributes {
  public id!: number;
  public productName!: string;
  public quantity!: number;
  public totalPrice!: number;

  public setProducts: (product: Product[], options?: any) => Promise<Sale>;
}

Sale.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "sales",
  }
);

export default Sale;
