import { DataTypes, Model } from "sequelize";
import sequelize from "../database/database";
import Charge from "./Charge";
import Sale from "./Sale";

interface SaleChargeAttributes {
  saleId: string; // Conforme a abstração
  chargeId: string; // Conforme a abstração
}

class SaleCharge
  extends Model<SaleChargeAttributes>
  implements SaleChargeAttributes
{
  public saleId!: string;
  public chargeId!: string;
}

SaleCharge.init(
  {
    saleId: {
      type: DataTypes.STRING, // Conforme a abstração
      allowNull: false,
      primaryKey: true,
    },
    chargeId: {
      type: DataTypes.STRING, // Conforme a abstração
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: "saleCharges",
  }
);

// Associação com Charge (N:M)
SaleCharge.belongsTo(Sale, { foreignKey: "saleId", as: "sale" });
SaleCharge.belongsTo(Charge, { foreignKey: "chargeId", as: "charge" });

export default SaleCharge;
