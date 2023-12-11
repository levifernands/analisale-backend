import { Request, Response } from "express";
import Charge, { ChargeTypes } from "../models/Charge";
import { v4 as uuidv4 } from "uuid";

import { AuthenticatedRequest } from "../authentication/authMiddleware";

const validateChargeValue = (value: any) => {
  const isValidValue = typeof value === "number" && value > 0 && value <= 100;

  if (!isValidValue)
    throw new Error(`Encargo já cadastrado com todos os valores fornecidos.`);
};

const validateChargeObject = async (
  name: string,
  value: number
): Promise<void> => {
  try {
    const chargeResult = await Charge.searchByNameAndValue(name, value);

    if (chargeResult.length > 0)
      throw new Error(`Encargo já cadastrado com todos os valores fornecidos.`);
  } catch (error) {
    throw error;
  }
};

const validateChargeType = (type: ChargeTypes) => {
  if (
    typeof type !== "number" ||
    (type !== ChargeTypes.Tax && type !== ChargeTypes.Discount)
  ) {
    throw new Error(`Tipo de encargo invalido. Tipo fornecido: ${type}`);
  }
};

export const getAllCharges = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.userId;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }
    const charges = await Charge.findAll({ where: { userId } });

    res.json(charges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChargeById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }
    const charge = await Charge.findOne({ where: { id, userId } });
    if (charge) {
      res.json(charge);
    } else {
      res.status(404).json({ message: "Charge not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCharge = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.userId;
  const { name, value, type } = req.body;

  try {
    validateChargeValue(value);
    validateChargeType(type);

    await validateChargeObject(name as string, value as number);

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const newCharge = await Charge.create({
      id: uuidv4(),
      name,
      type,
      value,
      userId,
    });

    res.status(201).json(newCharge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCharge = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const { name, value, type } = req.body;

  try {
    validateChargeValue(value);
    validateChargeType(type);

    await validateChargeObject(name as string, value as number);

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const [count] = await Charge.update(
      { name, type, value },
      { where: { id, userId } }
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

export const deleteCharge = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }
    const deletedCharge = await Charge.findOne({ where: { id, userId } });

    if (deletedCharge) {
      await Charge.destroy({ where: { id, userId } });

      res.json(deletedCharge);
    } else {
      res.status(404).json({ message: "Charge not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
