import bcrypt from "bcrypt";
import adminModel from "../models/adminModel.js";
import { generateToken } from "../utils/generateJWT.js";
import driverModel from "../models/driverModel.js";
import vendorModel from "../models/vendorModel.js";

// ------------------------------------------------------------------GET-ALL-DRIVERS------------------------------------------------------------------//

export const getDrivers = async (req, res) => {
  try {
    const drivers = await driverModel.find();
    if (drivers.length === 0) {
      res
        .status(204)
        .header("X-No-Data-Message", "No drivers found in the database.")
        .send();
    } else {
      res.status(200).json(drivers);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to get Driver list" });
  }
};

// ------------------------------------------------------------------GET-AN-DRIVER------------------------------------------------------------------//

export const getDriver = async (req, res) => {
  try {
    const driverId = req.params.driverId;
    const driver = await driverModel.find({ _id: driverId });
    if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }
    res.status(200).json(driver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to get Driver details. An internal server error occurred." });
  }
};

// ------------------------------------------------------------------GET-VENDORS------------------------------------------------------------------//

export const getVendors = async (req, res) => {
  try {
    const vendors = await vendorModel.find();
    if (vendors.length === 0) {
      res
        .status(204)
        .header("X-No-Data-Message", "No Vendors found in the database.")
        .send();
    } else {
      res.status(200).json(vendors);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to get Vendor list. An internal server error occurred." });
  }
};

// ------------------------------------------------------------------GET-AN-VENDOR------------------------------------------------------------------//

export const getVendor = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const vendor = await vendorModel.findOne({ _id: vendorId });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.status(200).json(vendor);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Unable to get Vendor details. An internal server error occurred.",
    });
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

export const addVendor = async (req, res) => {
  try {
    const { name, mobile, location, email, address } = req.body;
    const existingVendor = await vendorModel.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({
        message:
          "Vendor with this email already exists. Registration canceled.",
      });
    }
    const newVendor = new vendorModel({
      name,
      mobile,
      location,
      email,
      address,
    });
    await newVendor.save();
    return res.status(201).json({ message: "Vendor registration successful." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

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
      return res.status(400).json({
        message: "Another driver with the same mobile number already exists",
      });
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
