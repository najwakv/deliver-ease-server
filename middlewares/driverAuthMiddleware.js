import jwt from "jsonwebtoken";
import driverModel from "../models/driverModel.js";

export const driverAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, result) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid" });
      }
      const driver = await driverModel.findOne({ _id: result.driverId });
      req.driver = driver;
      req.driverId = result.driverId;
      next();
    });
  } catch (error) {
    console.error("Error in driverAuthMiddleware");
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};
