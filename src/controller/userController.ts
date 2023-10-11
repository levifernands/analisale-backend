import { Request, Response } from "express";
import User from "../models/User";

// in-memory array to store users
let users: { id: number; name: string; email: string }[] = [];

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userId = parseInt(req.params.id);
    const user = users.find((u) => u.id === userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const newUser = { id: users.length + 1, name, email, password };
  try {
    users.push(newUser);
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;
  const { name, email, password } = req.body;
  try {
    users = users.map((user) =>
      user.id === userId ? { ...user, ...updatedUser } : user
    );
    const user = users.find((u) => u.id === userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = parseInt(id);
  try {
    const deletedUserIndex = users.findIndex((user) => user.id === userId);
    if (deletedUserIndex !== -1) {
      const deletedUser = users[deletedUserIndex];
      users = users.filter((user) => user.id !== userId);
      res.json(deletedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
