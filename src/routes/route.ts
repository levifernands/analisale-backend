import { Router } from "express";
import { authenticate } from "../controller/authController";

import { authenticateToken } from "../authentication/authMiddleware";
import { AuthenticatedRequest } from "../authentication/authenticatedRequest";
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
router.get("/products/", authenticateToken, getAllProducts);
router.get("/products/:id", authenticateToken, getProductById);
router.post("/products/", authenticateToken, createProduct);
router.put("/products/:id", authenticateToken, updateProduct);
router.delete("/products/:id", authenticateToken, deleteProduct);

//Charge routes
router.get("/charges/", authenticateToken, getAllCharges);
router.get("/charges/:id", authenticateToken, getChargeById);
router.post("/charges/", authenticateToken, createCharge);
router.put("/charges/:id", authenticateToken, updateCharge);
router.delete("/charges/:id", authenticateToken, deleteCharge);

//Sale routes

router.get("/sales/", authenticateToken, getAllSales);
router.get("/sales/:id", authenticateToken, getSaleById);
router.post("/sales/", authenticateToken, createSale);
router.put("/sales/:id", authenticateToken, updateSale);
router.delete("/sales/:id", authenticateToken, deleteSale);

//Autenticação
router.post("/login", authenticate);

router.post(
  "/recurso-protegido",
  authenticateToken,
  (req: AuthenticatedRequest, res) => {
    // Se chegou até aqui, o token foi validado
    res.json({ message: "Recurso protegido", user: req.user });
  }
);
