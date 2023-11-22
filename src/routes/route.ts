import { Router } from "express";
import { authenticate } from "../controller/authController";

import { authenticateToken } from "../authentication/authMiddleware";
import * as bcrypt from "bcrypt";
import { generateToken } from "../authentication/jwtUtils";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  disableUser,
} from "../controller/userController";

import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/productController";

import {
  getAllCharges,
  getChargeById,
  createCharge,
  updateCharge,
  deleteCharge,
} from "../controller/chargeController";

import {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
} from "../controller/saleController";

export const router = Router();

//Users routes
router.get("/users/", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.put("/users/disable/:id", disableUser);

//Products routes
router.get("/products/", getAllProducts);
router.get("/products/:id", getProductById);
router.post("/products/", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

//Charge routes
router.get("/charges/", getAllCharges);
router.get("/charges/:id", getChargeById);
router.post("/charges/", createCharge);
router.put("/charges/:id", updateCharge);
router.delete("/charges/:id", deleteCharge);

//Sale routes

router.get("/sales/", getAllSales);
router.get("/sales/:id", getSaleById);
router.post("/sales/", createSale);
router.put("/sales/:id", updateSale);
router.delete("/sales/:id", deleteSale);

//Autenticação
router.post("/login", authenticate);

router.post("/recurso-protegido", authenticateToken, (req, res) => {
  // Se chegou até aqui, o token foi validado
  res.json({ message: "Recurso protegido", user: (req as any).user });
});
