import { Request, Response } from "express";
import User from "../models/User";
import * as bcrypt from "bcrypt";
import { generateToken } from "../authentication/jwtUtils";

export const authenticate = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    console.log("Usuário encontrado:", user);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const token = generateToken({ email: user.email, userId: user.id });
    console.log("Token gerado:", token);

    res.json({ token });
  } catch (error) {
    console.error("Erro ao autenticar usuário:", error);
    res.status(500).json({ message: "Erro interno ao autenticar usuário" });
  }
};
