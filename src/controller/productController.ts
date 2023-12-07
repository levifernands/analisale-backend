import { Request, Response } from "express";
import Product from "../models/Product";
import { v4 as uuidv4 } from "uuid";

const validateProductName = async (name: string) => {
  try {
    const productResult = await Product.searchByName(name);

    if (productResult.length > 0)
      throw new Error(`Já existe um produto cadastrado com nome de ${name}`);
  } catch (err) {
    throw err;
  }
};

const validateAmountProducts = (amount: number) => {
  if (amount <= 0)
    throw new Error(
      `Quantidade de produtos deve ser um valor inteiro positivo.`
    );
};

const validateValues = (purchaseValue: number, saleValue: number) => {
  if (purchaseValue <= 0)
    throw new Error(`Valor de compra do produto deve ser maior que 0 (zero).`);
  else if (saleValue < purchaseValue)
    throw new Error(
      `Valor de venda do produto deve ser maior que o valor de compra.`
    );
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

  try {
    await validateProductName(name);
    validateAmountProducts(amount);
    validateValues(purchaseValue, saleValue);

    const newProduct = await Product.create({
      id: uuidv4(),
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

  try {
    await validateProductName(name);
    validateAmountProducts(amount);
    validateValues(purchaseValue, saleValue);

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
