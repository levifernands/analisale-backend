import { Request, Response } from "express";
import Product from "../models/Product";
import { v4 as uuidv4 } from "uuid";

const validateProductName = async (res: Response, name: string) => {
  const productResult = await Product.searchByName(name);

  if (productResult.length > 0)
    res.status(400).json({
      message: `Já existe um produto cadastrado com nome de ${name}`,
    });
};

const validateAmountProducts = (res: Response, amount: number) => {
  if (amount <= 0)
    res.status(400).json({
      message: `Quantidade de produtos deve ser um valor inteiro positivo.`,
    });
};

const validateValues = (
  res: Response,
  purchaseValue: number,
  saleValue: number
) => {
  if (purchaseValue <= 0)
    return res.status(400).json({
      message: `Valor de compra do produto deve ser maior que 0 (zero).`,
    });
  else if (saleValue < purchaseValue)
    return res.status(400).json({
      message: `Valor de venda do produto deve ser maior que o valor de compra.`,
    });
};

const validateProductName = async (res: Response, name: string) => {
  const productResult = await Product.searchByName(name);

  if (productResult.length > 0)
    res.status(400).json({
      message: `Já existe um produto cadastrado com nome de ${name}`,
    });
};

const validateAmountProducts = (res: Response, amount: number) => {
  if (amount <= 0)
    res.status(400).json({
      message: `Quantidade de produtos deve ser um valor inteiro positivo.`,
    });
};

const validateValues = (
  res: Response,
  purchaseValue: number,
  saleValue: number
) => {
  if (purchaseValue <= 0)
    return res.status(400).json({
      message: `Valor de compra do produto deve ser maior que 0 (zero).`,
    });
  else if (saleValue < purchaseValue)
    return res.status(400).json({
      message: `Valor de venda do produto deve ser maior que o valor de compra.`,
    });
};

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
  const { amount, name, purchaseValue, saleValue } = req.body;

  await validateProductName(res, name);
  validateAmountProducts(res, amount);
  validateValues(res, purchaseValue, saleValue);

  try {
    const newProduct = await Product.create({
<<<<<<< HEAD
=======
      id: uuidv4(),
>>>>>>> origin/add-rules
      amount,
      name,
      purchaseValue,
      saleValue,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { amount, name, purchaseValue, saleValue } = req.body;

  await validateProductName(res, name);
  validateAmountProducts(res, amount);
  validateValues(res, purchaseValue, saleValue);

  try {
    const [count] = await Product.update(
      { amount, name, purchaseValue, saleValue },
      { where: { id } }
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

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByPk(id);

    if (deletedProduct) {
      await Product.destroy({ where: { id } });

      res.json(deletedProduct);
    } else res.status(404).json({ message: "Product not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
