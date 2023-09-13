import jwt from "jsonwebtoken"
import adminModel from "../models/adminModel.js";

export const adminAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized Token" });
    }
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, result) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid" });
      }
      const admin = await adminModel.findOne({ _id: result.adminId });
      req.admin = admin;
      next();
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: `An error occurred. Please try again later. ${error.message}` });
  }
};
