import bcrypt from "bcrypt";
import adminModel from "../models/adminModel.js";
import { generateToken } from "../utils/generateJWT.js";
import driverModel from "../models/driverModel.js";

// ------------------------------------------------------------------ADMIN-LOGIN------------------------------------------------------------------//

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

// ------------------------------------------------------------------ADD-DRIVER------------------------------------------------------------------//

export const addDriver = async (req, res) => {
  try {
    const { name, mobile, password, address, license } = req.body;
    const driver = await driverModel.findOne({ name });

    if (driver) {
      res
        .status(201)
        .json({ message: "Driver already exists with this Username." });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newDriver = new driverModel({
        name,
        mobile,
        address,
        license,
        password: hashedPassword,
      });
      await newDriver.save();
      res.status(200).json({ message: "Driver created successfully." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};
