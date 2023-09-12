import express from "express";
import { validateDriverLogin } from "../validators/driverValidators.js";
import { createBill, doLogin, getVendor, getVendors } from "../controllers/driverController.js";
import { driverAuthMiddleware } from "../middlewares/driverAuthMiddleware.js";
import { validateVendorId } from "../validators/vendorValidators.js";
const router = express.Router();

router.get("/vendors", driverAuthMiddleware,  getVendors);
router.get("/vendors/:vendorId", driverAuthMiddleware, validateVendorId, getVendor);
router.post("/login", validateDriverLogin, doLogin);
router.post("/vendors/:vendorId/createBill", driverAuthMiddleware, validateVendorId, createBill);

export default router;