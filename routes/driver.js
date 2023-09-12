import express from "express";
import { validateDriverLogin } from "../validators/driverValidators.js";
import { doLogin } from "../controllers/driverController.js";
const router = express.Router();

router.post("/login", validateDriverLogin, doLogin);

export default router;