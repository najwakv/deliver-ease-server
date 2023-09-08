import express from "express";
import { addDriver, doLogin } from "../controllers/adminController.js";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware.js";
const router = express.Router();

router.post("/login", doLogin);

router.post("/drivers/addDriver",adminAuthMiddleware, addDriver);

export default router;