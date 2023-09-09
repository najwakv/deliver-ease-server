import express from "express";
import { addDriver, doLogin, getDriver, getDrivers, updateDriver } from "../controllers/adminController.js";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware.js";
const router = express.Router();

router.post("/login", doLogin);

router.get("/drivers", adminAuthMiddleware, getDrivers);
router.get("/drivers/:driverId", adminAuthMiddleware, getDriver);
router.post("/drivers/addDriver", adminAuthMiddleware, addDriver);

router.patch("/drivers/:driverId", adminAuthMiddleware, updateDriver);

export default router;