import bcrypt from "bcrypt";
import adminModel from "../models/adminModel.js";
import { generateToken } from "../utils/generateJWT.js";
import driverModel from "../models/driverModel.js";

// ------------------------------------------------------------------GET-ALL-DRIVERS------------------------------------------------------------------//

export const getDrivers = async (req, res) => {
  try {
    const drivers = await driverModel.find();
    res.status(200).json(drivers);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Unable to get Driver list" });
  }
};

// ------------------------------------------------------------------GET-AN-DRIVER------------------------------------------------------------------//

export const getDriver = async (req, res) => {
  try {
    const driverId = req.params.driverId;
    const driver = await driverModel.find({ _id: driverId });
    res.status(200).json(driver);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Unable to get Driver details" });
  }
};

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
    const driver = await driverModel.findOne({ mobile });
    if (driver) {
      res
        .status(201)
        .json({ message: "Driver already exists with this Mobile number." });
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

export const addVendor = async (req, res) => {};

// ------------------------------------------------------------------UPDATE-DRIVER-DETAILS------------------------------------------------------------------//

export const updateDriver = async (req, res) => {
  try {
    const driverId = req.params.driverId;
    const updateData = req.body;
    const existingDriver = await driverModel.findOne({
      mobile: updateData.mobile,
      _id: { $ne: driverId },
    });
    if (existingDriver) {
      return res
        .status(400)
        .json({ message: "Another driver with the same mobile number already exists" });
    }
    const updatedDriver = await driverModel.findByIdAndUpdate(
      driverId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    const response = {
      message: "Driver Details updated succesfully",
      updatedDriver,
    };
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ------------------------------------------------------------------BLOCK-UNBLOCK-DRIVER------------------------------------------------------------------//

export const toggleBlockDriver = async (req, res) => {
  try {
    const driverId = req.params.driverId;
    const driver = await driverModel.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    driver.block = !driver.block;
    await driver.save();
    res
      .status(200)
      .json({ message: `Driver ${driver.block ? "blocked" : "unblocked"}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ------------------------------------------------------------------DELETE-DRIVER------------------------------------------------------------------//

export const deleteDriver = async (req, res) => {
  try {
    const driverId = req.params.driverId;
    const deletedDriver = await driverModel.findByIdAndRemove(driverId);
    if (!deletedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
