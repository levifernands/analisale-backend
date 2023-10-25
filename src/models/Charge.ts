import { DataTypes, Model } from "sequelize";
import sequelize from "../database/database";

interface ChargeAttributes {
  id: number;
  name: string;
  amount: number;
}

class Charge extends Model<ChargeAttributes> implements ChargeAttributes {
  public id!: number;
  public name!: string;
  public amount!: number;
}

Charge.init(
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
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "charges",
  }
);

export default Charge;
