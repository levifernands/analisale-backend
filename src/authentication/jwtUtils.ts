import * as jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY;

interface TokenPayload {
  email: string;
}

function generateToken(user: TokenPayload): string {
  if (!secretKey) {
    throw new Error("Chave secreta não configurada");
  }

  const token = jwt.sign(user, secretKey, { expiresIn: "1h" });
  return token;
}

function verifyToken(token: string): TokenPayload | null {
  if (!secretKey) {
    throw new Error("Chave secreta não configurada");
  }

  try {
    const decoded = jwt.verify(token, secretKey) as TokenPayload;
    return decoded;
  } catch (err) {
    return null;
  }
}

export { generateToken, verifyToken };
