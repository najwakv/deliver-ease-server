import express from "express";
import { doLogin } from "../controllers/adminController.js";
const router = express.Router();

router.post("/login", doLogin);

export default router;