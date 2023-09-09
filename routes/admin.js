import express from "express";
import { addDriver, deleteDriver, doLogin, getDriver, getDrivers, toggleBlockDriver, updateDriver } from "../controllers/adminController.js";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware.js";
const router = express.Router();


router.get("/drivers", adminAuthMiddleware, getDrivers);
router.get("/drivers/:driverId", adminAuthMiddleware, getDriver);
router.post("/login", doLogin);
router.post("/drivers/addDriver", adminAuthMiddleware, addDriver);
router.patch("/drivers/:driverId", adminAuthMiddleware, updateDriver);
router.patch("/drivers/:driverId/toggleBlockDriver", toggleBlockDriver);
router.delete("/drivers/:driverId", adminAuthMiddleware, deleteDriver);

export default router;