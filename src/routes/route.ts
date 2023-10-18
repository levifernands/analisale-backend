import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controller/userController";

import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/productController";

export const router = Router();

//Users routes
router.get("/users/", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

//Products routes
router.get("/products/", getAllProducts);
router.get("/products/:id", getProductById);
router.post("/products/", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
