import { Request } from "express";

interface AuthenticatedRequest extends Request {
  user?: { email: string };
}
