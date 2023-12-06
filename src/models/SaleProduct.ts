import { DataTypes, Model } from "sequelize";
import sequelize from "../database/database";
import Product from "./Product";
import Sale from "./Sale";

interface SaleProductAttributes {
  saleId: string; // Conforme a abstração
  productId: string; // Conforme a abstração
  amount: number;
}

class SaleProduct
  extends Model<SaleProductAttributes>
  implements SaleProductAttributes
{
  public saleId!: string;
  public productId!: string;
  public amount!: number;
}

SaleProduct.init(
  {
    saleId: {
      type: DataTypes.STRING, // Conforme a abstração
      allowNull: false,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.STRING, // Conforme a abstração
      allowNull: false,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: "A quantidade deve ser maior que zero.",
        },
      },
    },
  },
  {
    sequelize,
    tableName: "saleProducts",
  }
);

// Associação com Product (N:M)
SaleProduct.belongsTo(Sale, { foreignKey: "saleId", as: "sale" });
SaleProduct.belongsTo(Product, { foreignKey: "productId", as: "product" });

export default SaleProduct;
