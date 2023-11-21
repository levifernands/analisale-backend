import { DataTypes, Model, Op } from "sequelize";
import sequelize from "../database/database";

export enum ChargeTypes {
  Tax,
  Discount,
}

interface ChargeAttributes {
  id: string;
  name: string;
  value: number;
  type: ChargeTypes;
}

class Charge extends Model<ChargeAttributes> implements ChargeAttributes {
  public id!: string;
  public name!: string;
  public value!: number;
  public type!: ChargeTypes;

  static searchByNameAndValue: (
    name: string,
    value: number
  ) => Promise<Charge[] | null>;
}

Charge.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "O valor deve ser maior ou igual a zero.",
        },
        max: {
          args: [100],
          msg: "O valor deve ser menor ou igual a 100.",
        },
      },
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: {
          args: [[ChargeTypes.Tax, ChargeTypes.Discount]],
          msg: "O tipo de encargo deve ser Taxa ou Desconto.",
        },
      },
    },
  },
  {
    sequelize,
    tableName: "charges",
  }
);

Charge.searchByNameAndValue = async (
  name: string,
  value: number
): Promise<Charge[] | null> => {
  return Charge.findAll({
    where: {
      name: {
        [Op.iLike]: `%${name}%`,
      },
      value: {
        [Op.eq]: value,
      },
    },
  });
};

export default Charge;
