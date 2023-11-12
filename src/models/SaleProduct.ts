import { DataTypes, Model } from "sequelize";
import sequelize from "../database/database";

interface SaleProductAttributes {
  saleId: number;
  productId: number;
}

class SaleProduct
  extends Model<SaleProductAttributes>
  implements SaleProductAttributes
{
  public saleId!: number;
  public productId!: number;
}

SaleProduct.init(
  {
    saleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: "saleProducts",
  }
);

export default SaleProduct;
