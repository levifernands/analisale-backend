import { Request, Response } from "express";
import Sale, { SaleProduct } from "../models/Sale";
import Product from "../models/Product";
import Charge, { ChargeTypes } from "../models/Charge";
import { v4 as uuidv4 } from "uuid";
import { AuthenticatedRequest } from "../authentication/authMiddleware";

const updateStock = async (saleProducts: SaleProduct[]): Promise<void> => {
  for (const product of saleProducts) {
    try {
      const productInDatabase = await Product.findByPk(product.id);

      if (!productInDatabase) {
        throw new Error(`Produto com ID ${product.id} não encontrado`);
      }

      productInDatabase.amount -= product.amount;

      await productInDatabase.save();
    } catch (error) {
      console.error(`Erro ao atualizar o estoque do produto: ${error.message}`);
      throw error;
    }
  }
};

const verifyProductsAndGetSum = async (
  saleProducts: SaleProduct[]
): Promise<number> => {
  let totalProductsValue: number = 0;

  if (!saleProducts || saleProducts.length === 0)
    throw new Error("Atributo de produtos inválidos");

  for (const product of saleProducts) {
    try {
      const productSale = await Product.findByPk(product.id);

      if (!productSale) {
        throw new Error(`Produto com ID ${product.id} não encontrado`);
      }

      if (productSale.amount < product.amount) {
        throw new Error(
          `Produto com id ${product.id} não possui ${product.amount} unidades em estoque.`
        );
      }

      totalProductsValue += productSale.saleValue * product.amount;

      // TODO: deduzir valor do banco
    } catch (err) {
      throw err;
    }
  }

  return totalProductsValue;
};

const verifyChargesAndGetSum = async (
  saleCharges: string[],
  totalProductsValue: number
): Promise<number | undefined> => {
  const hasCharges = saleCharges && saleCharges.length !== 0;

  if (!hasCharges) return undefined;

  let totalChargesValue: number = 0;

  for (const chargeId of saleCharges) {
    try {
      const chargeSale = await Charge.findByPk(chargeId);

      if (chargeSale) {
        totalChargesValue +=
          chargeSale.type === ChargeTypes.Tax
            ? totalProductsValue * (chargeSale.value / 100) // Considerar Taxa como porcentagem positiva
            : -totalProductsValue * (chargeSale.value / 100); // Considerar Discount como porcentagem negativa
      } else {
        console.error(`Encargo com ID ${chargeId} não encontrada.`);
      }
    } catch (err) {
      throw err;
    }
  }

  return totalChargesValue;
};

const getTotalSaleValue = (
  totalProductsValue: number,
  totalChargesValue: number | undefined
): number => {
  const totalSaleValue = totalProductsValue + totalChargesValue;
  return totalSaleValue > 0 ? totalSaleValue : 0; // Garante que o valor total não seja negativo
};

export const createSale = async (req: AuthenticatedRequest, res: Response) => {
  const { products, charges } = req.body;

  const saleProducts = products as SaleProduct[];
  const saleCharges = charges as string[];

  const userId = req.user?.userId;

  try {
    const totalProductsValue = await verifyProductsAndGetSum(saleProducts);
    const totalChargesValue = await verifyChargesAndGetSum(
      saleCharges,
      totalProductsValue
    );

    const totalSaleValue: number = getTotalSaleValue(
      totalProductsValue,
      totalChargesValue
    );

    const newSale = await Sale.create({
      id: uuidv4(),
      charges: saleCharges,
      products: saleProducts,
      totalPrice: totalSaleValue,
      userId,
    });

    // Atualiza o estoque
    await updateStock(saleProducts);

    res.status(201).json(newSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getAllSales = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }
    const sales = await Sale.findAll({ where: { userId } });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSaleById = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const sale = await Sale.findByPk(id);

    if (sale) {
      res.json(sale);
    } else {
      res.status(404).json({ message: "Sale not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSale = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { products, charges } = req.body;

  const saleProducts = products as SaleProduct[];
  const saleCharges = charges as string[];

  const userId = req.user?.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }
    const totalProductsValue = await verifyProductsAndGetSum(saleProducts);
    const totalChargesValue = await verifyChargesAndGetSum(
      saleCharges,
      totalProductsValue
    );

    const totalSalePrice = getTotalSaleValue(
      totalProductsValue,
      totalChargesValue
    );

    const [count] = await Sale.update(
      {
        charges: saleCharges,
        products: saleProducts,
        totalPrice: totalSalePrice,
      },
      { where: { id, userId } }
    );

    if (count > 0) {
      const updatedSale = await Sale.findByPk(id);

      res.json(updatedSale);
    } else {
      res.status(404).json({ message: `Venda com id: ${id} não encontrada` });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSale = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const deletedSale = await Sale.findOne({ where: { id, userId } });
    if (deletedSale) {
      await Sale.destroy({ where: { id, userId } });

      res.json(deletedSale);
    } else {
      res.status(404).json({ message: "Sale not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
