// authentication/AuthMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "./jwtUtils";

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
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

  const tokenPayloadOrNull = verifyToken(token);

  if (!tokenPayloadOrNull) {
    res.status(403).json({ message: "Token inválido" });
    return;
  }

  const { email, userId } = tokenPayloadOrNull;
  console.log("Token válido, usuário autenticado:", email);

  // Adicionando a propriedade 'user' ao objeto Request
  req.user = { email, userId };

  next();
}

export { authenticateToken };
