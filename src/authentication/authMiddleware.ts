import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./jwtUtils";

interface AuthenticatedRequest extends Request {
  email?: string;
}

function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ message: "Token não fornecido ou no formato inválido" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res
      .status(401)
      .json({ message: "Token não fornecido ou no formato inválido" });
    return;
  }

  const emailOrNull = verifyToken(token);

  if (!emailOrNull || typeof emailOrNull !== 'string') {
    res.status(403).json({ message: "Token inválido" });
    return;
  }
  const email = emailOrNull;

  // Adicionando a propriedade 'email' ao objeto Request
  req.email = email;
  next();
}

export { authenticateToken };
