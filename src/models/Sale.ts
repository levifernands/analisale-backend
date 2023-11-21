import { DataTypes, Model } from "sequelize";
import sequelize from "../database/database";
import Product from "./Product";
import Charge from "./Charge";

// Interface para SaleProduct
export interface SaleProduct {
  id: string;
  amount: number;
}

// Interface para SaleAttributes
interface SaleAttributes {
  id: string;
  products: SaleProduct[];
  charges: string[];
  totalPrice: number;
}

class Sale extends Model<SaleAttributes> implements SaleAttributes {
  public id!: string;
  public products!: SaleProduct[];
  public charges!: string[];
  public totalPrice!: number;
}

Sale.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    products: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        isArrayOfObjects(value: SaleProduct[]): void {
          if (
            !Array.isArray(value) ||
            !value.every((obj) => typeof obj === "object")
          ) {
            throw new Error(
              'A propriedade "products" deve ser uma lista de objetos.'
            );
          }
        },

        hasValidProducts(value: SaleProduct[]): void {
          if (value.length === 0) {
            throw new Error(
              'A lista de "products" deve ter pelo menos um item.'
            );
          }

          for (const product of value) {
            if (!product.id)
              throw new Error(
                'Cada item em "products" deve ter uma propriedade "id".'
              );
            else if (!product.amount || product.amount === 0)
              throw new Error(
                'Cada item em "products" deve ter a propriedade "amount" > 0 e != NULL.'
              );
            // Aqui você deve implementar a lógica para verificar se o product.id existe no banco de dados.
            // Você também precisa verificar a regra de quantidade (product.amount <= quantidade disponível no banco).
          }
        },
      },
    },
    charges: {
      type: DataTypes.JSON,
      validate: {
        isArrayOfTypeString(value: string[]): void {
          if (
            !Array.isArray(value) ||
            !value.every((str) => typeof str === "string")
          ) {
            throw new Error(
              'A propriedade "charges" deve ser uma lista de strings.'
            );
          }
        },
        hasValidCharges(value: string[]): void {
          for (const charge of value) {
            if (!charge) {
              throw new Error(
                'Cada item em "charges" deve ser uma string não vazia.'
              );
            }

            // Aqui você deve implementar a lógica para verificar se o charge existe no banco de dados.
          }
        },
      },
    },
  },
  {
    sequelize,
    tableName: "sales",
  }
);

// Associação N:M com Product
Sale.belongsToMany(Product, { through: "saleProducts", foreignKey: "saleId" });

// Associação N:M com Charge
Sale.belongsToMany(Charge, { through: "saleCharges", foreignKey: "saleId" });

export default Sale;
