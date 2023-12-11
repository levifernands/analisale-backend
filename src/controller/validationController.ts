// validationUtils.ts
import { Response } from "express";
import Product from "../models/Product";

export async function validateProductName(res: Response, name: string) {
  const productResult = await Product.searchByName(name);

  if (productResult.length > 0)
    res.status(400).json({
      message: `Já existe um produto cadastrado com nome de ${name}`,
    });
}

export function validateAmountProducts(res: Response, amount: number) {
  if (amount <= 0)
    res.status(400).json({
      message: `Quantidade de produtos deve ser um valor inteiro positivo.`,
    });
}

export function validateValues(
  res: Response,
  purchaseValue: number,
  saleValue: number
) {
  if (purchaseValue <= 0)
    res.status(400).json({
      message: `Valor de compra do produto deve ser maior que 0 (zero).`,
    });
  else if (saleValue < purchaseValue)
    res.status(400).json({
      message: `Valor de venda do produto deve ser maior que o valor de compra.`,
    });
}
