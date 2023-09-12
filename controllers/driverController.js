import bcrypt from "bcrypt";
import driverModel from "../models/driverModel.js";
import { generateToken } from "../utils/generateJWT.js";

export const doLogin = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const driver = await driverModel.findOne({ mobile });
    if (driver) {
      bcrypt.compare(password, driver.password, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal Server Error" });
        }
        if (result) {
          const token = generateToken({ driverId: driver._id });
          const response = {
            token,
            message: "Driver login successfull",
          };
          res.status(200).json(response);
        } else {
          res
            .status(401)
            .json({ message: "Incorrect password. Please try again." });
        }
      });
    } else {
      res.status(404).json({ message: "Driver not found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};
