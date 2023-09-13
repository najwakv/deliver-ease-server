import express from "express";
import { validateDriverLogin } from "../validators/driverValidators.js";
import { createBill, doLogin, getAvailableProduct, getOrders, getProduct, getVendor, getVendors } from "../controllers/driverController.js";
import { driverAuthMiddleware } from "../middlewares/driverAuthMiddleware.js";
import { validateVendorId } from "../validators/vendorValidators.js";
import { validateCreateBill } from "../validators/orderValidators.js";
import { validateProductId } from "../validators/productValidators.js";
const router = express.Router();

router.get("/vendors", driverAuthMiddleware,  getVendors);
router.get("/vendors/:vendorId", driverAuthMiddleware, validateVendorId, getVendor);
router.get("/products", driverAuthMiddleware, getAvailableProduct);
router.get("/products/:productId", driverAuthMiddleware, validateProductId, getProduct);
router.get("/orders", driverAuthMiddleware, getOrders);
router.post("/login", validateDriverLogin, doLogin);
router.post("/vendors/:vendorId/createBill", driverAuthMiddleware, validateVendorId, validateCreateBill, createBill);

export default router;