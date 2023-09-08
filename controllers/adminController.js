import bcrypt from "bcrypt";
import adminModel from "../models/adminModel.js";
import { generateToken } from "../utils/generateJWT.js";

export const doLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({ email });
    if (admin) {
      bcrypt.compare(password, admin.password, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal Server Error" });
        }
        if (result) {
          const token = generateToken({ adminId: admin._id });
          const response = {
            token,
            message: "Admin login successfull",
          };
          res.status(200).json(response);
        } else {
          res
            .status(201)
            .json({ message: "Incorrect password. Please try again." });
        }
      });
    } else {
      res.status(201).json({ message: "Incorrect Email. Please try again." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};
