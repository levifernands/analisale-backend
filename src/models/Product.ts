import { DataTypes, Model, Op } from "sequelize";
import sequelize from "../database/database";

interface ProductAttributes {
  id: string; // Conforme a abstração
  name: string;
  purchaseValue: number; // Conforme a abstração
  amount: number;
  saleValue: number; // Conforme a abstração
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
  public id!: string;
  public amount!: number;
  public name!: string;
  public purchaseValue!: number;
  public saleValue!: number;

  static searchByName: (name: string) => Promise<Product[]>;
}

Product.init(
  {
    id: {
      type: DataTypes.STRING, // Conforme a abstração
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Conforme a abstração
    },
    purchaseValue: {
      type: DataTypes.FLOAT, // Conforme a abstração
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "O valor de compra deve ser maior ou igual a zero.",
        },
      },
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
    saleValue: {
      type: DataTypes.FLOAT, // Conforme a abstração
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: "O valor de venda deve ser maior que zero.",
        },
        customValidator(value: number): void {
          if (value <= this.getDataValue("purchaseValue")) {
            throw new Error(
              "O valor de venda deve ser maior que o valor de compra."
            );
          }
        },
      },
    },
  },
  {
    sequelize,
    tableName: "products",
  }
);

Product.searchByName = async (name: string): Promise<Product[] | null> => {
  return Product.findAll({
    where: {
      name: {
<<<<<<< HEAD
        [Op.iLike]: `%${name}%`, // Case-insensitive matching
      },
    },
=======
        [Op.like]: `%${name}%`, // Case-insensitive matching for PostgreSQL
        // For MySQL, use the following:
        // [Op.like]: `%${name}%`,
      },
    },
    // For MySQL, add collate option for case-insensitive matching:
    // collate: { collation: 'utf8_general_ci' },
>>>>>>> origin/add-rules
  });
};

export default Product;
