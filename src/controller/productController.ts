import { Request, Response } from "express";
import Product from "../models/Product";

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, price, type, amount, salePurchase } = req.body;
  try {
    const newProduct = await Product.create({
      name,
      price,
      type,
      amount,
      salePurchase,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, type, amount, salePurchase } = req.body;
  try {
    const [updated] = await Product.update(
      { name, price, type, amount, salePurchase },
      { where: { id } }
    );
    if (updated) {
      const updatedProduct = await Product.findByPk(id);
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByPk(id);
    if (deletedProduct) {
      await Product.destroy({ where: { id } });
      res.json(deletedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
