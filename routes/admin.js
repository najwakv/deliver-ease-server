import express from "express";
import { addDriver, doLogin, getDrivers } from "../controllers/adminController.js";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware.js";
const router = express.Router();

router.post("/login", doLogin);

router.post("/drivers/addDriver", adminAuthMiddleware, addDriver);
router.get("/drivers", adminAuthMiddleware, getDrivers);
export default router;