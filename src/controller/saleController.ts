import { Request, Response } from "express";
import Sale, { SaleProduct } from "../models/Sale";
import Product from "../models/Product";
import Charge, { ChargeTypes } from "../models/Charge";
<<<<<<< HEAD
=======
import { v4 as uuidv4 } from "uuid";
>>>>>>> origin/add-rules

const verifyProductsAndGetSum = async (
  res: Response,
  saleProducts: SaleProduct[]
): Promise<number> => {
  let totalProductsValue: number = 0;

  if (!saleProducts || saleProducts.length === 0) {
    res.status(400).json({ message: "Atributo de produtos inválidos" });
    return;
  }

  saleProducts.forEach(async (product) => {
    try {
      const productSale = await Product.findByPk(product.id);

      if (productSale.amount < product.amount) {
        res.status(400).json({
          message: `Produto com id ${product.id} não possui ${product.amount} unidades em estoque.`,
        });
        return;
      }

      totalProductsValue += productSale.saleValue * product.amount;

      // TODO: deduzir valor do banco
    } catch (err) {
      res
        .status(404)
        .json({ message: `Produto com id ${product.id} não encontrado.` });
    }
  });

  return totalProductsValue;
};

const verifyChargesAndGetSum = async (
  res: Response,
  saleCharges: string[]
): Promise<number | undefined> => {
  const hasCharges = saleCharges && saleCharges.length !== 0;

  if (!hasCharges) return undefined;

  let totalChargesValue: number = 0;

  saleCharges.forEach(async (chargeId) => {
    try {
      const chargeSale = await Charge.findByPk(chargeId);

      totalChargesValue =
        chargeSale.type === ChargeTypes.Tax
          ? totalChargesValue + chargeSale.value
          : totalChargesValue - chargeSale.value;
    } catch (err) {
      res
        .status(404)
        .json({ message: `Encargo com id ${chargeId} não encontrado.` });
    }
  });

  return totalChargesValue;
};

const getTotalSaleValue = (
  totalProductsValue: number,
  totalChargesValue: number | undefined
): number => {
  const ChargesOnProducts: number =
    totalProductsValue * (totalChargesValue ? totalChargesValue : 1);

  return totalProductsValue + ChargesOnProducts;
};

export const getAllSales = async (_req: Request, res: Response) => {
  try {
    const sales = await Sale.findAll();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSaleById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
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

export const createSale = async (req: Request, res: Response) => {
  const { products, charges } = req.body;

  const saleProducts = products as SaleProduct[];
  const saleCharges = charges as string[];

  const totalProductsValue = await verifyProductsAndGetSum(res, saleProducts);
  const totalChargesValue = await verifyChargesAndGetSum(res, saleCharges);

  const totalSaleValue: number = getTotalSaleValue(
    totalProductsValue,
    totalChargesValue
  );

  try {
    const newSale = await Sale.create({
<<<<<<< HEAD
=======
      id: uuidv4(),
>>>>>>> origin/add-rules
      charges: saleCharges,
      products: saleProducts,
      totalPrice: totalSaleValue,
    });

    res.status(201).json(newSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSale = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { products, charges } = req.body;

  const saleProducts = products as SaleProduct[];
  const saleCharges = charges as string[];

  try {
    const totalProductsValue = await verifyProductsAndGetSum(res, saleProducts);
    const totalChargesValue = await verifyChargesAndGetSum(res, saleCharges);

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
      { where: { id } }
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

export const deleteSale = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedSale = await Sale.findByPk(id);
    if (deletedSale) {
      await Sale.destroy({ where: { id } });

      res.json(deletedSale);
    } else {
      res.status(404).json({ message: "Sale not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
