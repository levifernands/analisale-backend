import { Request, Response } from "express";
import Charge from "../models/Charge";

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
  const { name, amount } = req.body;
  try {
    const newCharge = await Charge.create({ name, amount });
    res.status(201).json(newCharge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCharge = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, amount } = req.body;
  try {
    const [updated] = await Charge.update({ name, amount }, { where: { id } });
    if (updated) {
      const updatedCharge = await Charge.findByPk(id);
      res.json(updatedCharge);
    } else {
      res.status(404).json({ message: "Charge not found" });
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
