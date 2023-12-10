import * as jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY;

interface TokenPayload {
  email: string;
}

function generateToken(user: TokenPayload): string {
  if (!secretKey) {
    console.warn(
      "Chave secreta não configurada. Certifique-se de definir a variável de ambiente SECRET_KEY."
    );
  }

  const token = jwt.sign(user, secretKey, { expiresIn: "1h" });
  return token;
}

function verifyToken(token: string): string | null {
  if (!secretKey) {
    console.warn(
      "Chave secreta não configurada. Certifique-se de definir a variável de ambiente SECRET_KEY."
    );
    return null;
  }

  try {
    const decoded = jwt.verify(token, secretKey) as TokenPayload;

    if (!decoded.email || typeof decoded.email !== "string") {
      console.error("Payload do token inválido. Não contém o campo 'email'.");
      return null;
    }

    return decoded.email;
  } catch (err) {
    console.error("Erro na verificação do token:", err.message);
    return null;
  }
}

export { generateToken, verifyToken };
