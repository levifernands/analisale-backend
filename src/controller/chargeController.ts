import { Request, Response } from "express";
import Charge, { ChargeTypes } from "../models/Charge";
<<<<<<< HEAD
=======
import { v4 as uuidv4 } from "uuid";
>>>>>>> origin/add-rules

const validateChargeValue = (res: Response, value: any) => {
  const isValidValue = typeof value === "number" && value > 0 && value <= 100;

  if (!isValidValue)
    res.status(400).json({
      message: `Valor do encargo deve ser maior que 0 e menor que 100. Valor: ${value}`,
    });
};

const validateChargeObject = async (
  res: Response,
  name: string,
  value: number
): Promise<void> => {
  try {
    const chargeResult = await Charge.searchByNameAndValue(name, value);

    if (chargeResult.length > 0)
      res.status(400).json({
        message: `Encargo já cadastrado com todos os valores fornecidos.`,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const validateChargeType = (res: Response, type: ChargeTypes) => {
  if (
    typeof type !== "number" ||
    (type !== ChargeTypes.Tax && type !== ChargeTypes.Discount)
  ) {
    res.status(400).json({
      message: `Tipo de encargo invalido. Tipo fornecido: ${type}`,
    });
  }
};

export const getAllCharges = async (_req: Request, res: Response) => {
  try {
    const charges = await Charge.findAll();

    res.json(charges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChargeById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const charge = await Charge.findByPk(id);
    if (charge) {
      res.json(charge);
    } else {
      res.status(404).json({ message: "Charge not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCharge = async (req: Request, res: Response) => {
  const { name, value, type } = req.body;

  validateChargeValue(res, value);
  validateChargeType(res, type);

  await validateChargeObject(res, name as string, value as number);

  try {
<<<<<<< HEAD
    const newCharge = await Charge.create({ name, type, value });
=======
    const newCharge = await Charge.create({ id: uuidv4(), name, type, value });
>>>>>>> origin/add-rules

    res.status(201).json(newCharge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCharge = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { name, value, type } = req.body;

  validateChargeValue(res, value);
  validateChargeType(res, type);

  await validateChargeObject(res, name as string, value as number);

  try {
    const [count] = await Charge.update(
      { name, type, value },
      { where: { id } }
    );

    if (count > 0) {
      const updatedCharge = await Charge.findByPk(id);

      res.json(updatedCharge);
    } else {
      res.status(404).json({ message: `Encargo com id ${id} não encontrado` });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCharge = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedCharge = await Charge.findByPk(id);

    if (deletedCharge) {
      await Charge.destroy({ where: { id } });

      res.json(deletedCharge);
    } else {
      res.status(404).json({ message: "Charge not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
