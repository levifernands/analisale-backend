import { Request, Response } from "express";
import Sale from "../models/Sale";

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
  const { productName, quantity, totalPrice, productId } = req.body;
  try {
    const newSale = await Sale.create({
      productName,
      quantity,
      totalPrice,
      productId,
    });
    res.status(201).json(newSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSale = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { productName, quantity, totalPrice } = req.body;
  try {
    const [updated] = await Sale.update(
      { productName, quantity, totalPrice },
      { where: { id } }
    );
    if (updated) {
      const updatedSale = await Sale.findByPk(id);
      res.json(updatedSale);
    } else {
      res.status(404).json({ message: "Sale not found" });
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
