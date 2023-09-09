import express from "express";
import { addDriver, addVendor, deleteDriver, deleteVendor, doLogin, getDriver, getDrivers, getVendor, getVendors, toggleBlockDriver, updateDriver, updateVendor } from "../controllers/adminController.js";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware.js";
const router = express.Router();


router.get("/drivers", adminAuthMiddleware, getDrivers);
router.get("/drivers/:driverId", adminAuthMiddleware, getDriver);
router.get("/vendors", adminAuthMiddleware, getVendors);
router.get("/vendors/:vendorId", adminAuthMiddleware, getVendor)
router.post("/login", doLogin);
router.post("/drivers/addDriver", adminAuthMiddleware, addDriver);
router.post("/vendors/addVendor", adminAuthMiddleware, addVendor);
router.patch("/drivers/:driverId", adminAuthMiddleware, updateDriver);
router.patch("/drivers/:driverId/toggleBlockDriver", toggleBlockDriver);
router.patch("/vendors/:vendorId", adminAuthMiddleware, updateVendor);
router.delete("/drivers/:driverId", adminAuthMiddleware, deleteDriver);
router.delete("/vendors/:vendorId", adminAuthMiddleware, deleteVendor);

export default router;