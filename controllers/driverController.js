import bcrypt from "bcrypt";
import driverModel from "../models/driverModel.js";
import { generateToken } from "../utils/generateJWT.js";
import vendorModel from "../models/vendorModel.js";
import orderModel from "../models/orderModel.js";

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
    res.status(500).json({
      message: "Unable to get Vendor list. An internal server error occurred.",
    });
  }
};

// ------------------------------------------------------------------GET-AN-VENDOR------------------------------------------------------------------//

export const getVendor = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const vendor = await vendorModel.findOne({ _id: vendorId });
    if (vendor.length === 0) {
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

// ------------------------------------------------------------------DRIVER-LOGIN------------------------------------------------------------------//

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

// -------------------------------------------------------------------CREATE-BILL------------------------------------------------------------------//

export const createBill = async (req, res) => {
  const vendorId = req.params.vendorId;
  const driverId = req.driverId;
  const orderData = req.body;

  try {
    const newOrder = new orderModel({
      items: orderData.items,
      driver: driverId,
      vendor: vendorId,
      totalAmount: orderData.totalAmount,
      collectedAmount: orderData.collectedAmount,
    });
    await newOrder.save();
    const response = {
      message: "Order created successfully",
      newOrder,
    };
    if (!newOrder || newOrder._id == null) {
      return res.status(500).json({ message: "Order creation failed" });
    }
    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Error creating order" });
  }
};
