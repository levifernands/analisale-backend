import { Request, Response } from "express";
import Product from "../models/Product";
import { v4 as uuidv4 } from "uuid";
import {
  validateProductName,
  validateAmountProducts,
  validateValues,
} from "./validationController";

import { AuthenticatedRequest } from "../authentication/authMiddleware";

export const getAllProducts = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.userId;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }
    const products = await Product.findAll({ where: { userId } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }
    const product = await Product.findOne({ where: { id, userId } });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { amount, name, purchaseValue, saleValue } = req.body;
  const userId = req.user?.userId;

  await validateProductName(res, name);
  validateAmountProducts(res, amount);
  validateValues(res, purchaseValue, saleValue);

  try {
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const newProduct = await Product.create({
      id: uuidv4(),
      amount,
      name,
      purchaseValue,
      saleValue,
      userId,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const { amount, name, purchaseValue, saleValue } = req.body;
  const userId = req.user?.userId;

  validateAmountProducts(res, amount);
  validateValues(res, purchaseValue, saleValue);

  try {
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }
    const [count] = await Product.update(
      { amount, name, purchaseValue, saleValue },
      { where: { id, userId } }
    );

    if (count > 0) {
      const updatedProduct = await Product.findByPk(id);

      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }
    const deletedProduct = await Product.findOne({ where: { id, userId } });

    if (deletedProduct) {
      await Product.destroy({ where: { id, userId } });

      res.json(deletedProduct);
    } else res.status(404).json({ message: "Product not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
