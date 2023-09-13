import bcrypt from "bcrypt";
import driverModel from "../models/driverModel.js";
import { generateToken } from "../utils/generateJWT.js";
import vendorModel from "../models/vendorModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";

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
      message: `Internal Server Erroe: Unable to get Vendor list ${error.message}`,
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
      message: `Internal Server Error : Unable to get Vendor details. ${error.message}`,
    });
  }
};

// ------------------------------------------------------------------GET-AVAILABLE-PRODUCT------------------------------------------------------------------//

export const getAvailableProduct = async (req, res) => {
  try {
    const products = await productModel
      .find({ available: true })
      .populate("category", "_id name block");
    if (products.length === 0) {
      res
        .status(204)
        .header("X-No-Data-Message", "No Products found in the database.")
        .send();
    } else {
      res.status(200).json(products);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Internal Server Erroe: Unable to get Product list ${error.message}`,
    });
  }
};

// ------------------------------------------------------------------GET-ORDERS------------------------------------------------------------------//

export const getOrders = async (req, res) => {
  const driverId = req.driverId;
  try {
    const orders = await orderModel
      .find({ driver: driverId })
      .populate("items", "_id product quantity totalPrice")
      .populate({
        path: "items.product",
        select: "_id name price",
        populate: {
          path: "category",
          select: "_id name",
        },
      })
      .populate("vendor", "_id name mobile location email address")
      .select("-driver");

    if (orders.length === 0) {
      res
        .status(204)
        .header("X-No-Data-Message", "No Orders found for this driver.")
        .send();
    } else {
      res.status(200).json(orders);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to get orders. An internal server error occurred.",
    });
  }
};

// ------------------------------------------------------------------DRIVER-LOGIN------------------------------------------------------------------//

export const doLogin = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const driver = await driverModel.findOne({ mobile });
    if (driver) {
      bcrypt.compare(password, driver.password, (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({
            message: `Internal Server Error: Unable to compare passwords. ${error.message}`,
          });
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
      res.status(404).json({ message: "Driver not found with given email." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Internal Server Error: Please try again later. ${error.message}`,
    });
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
    res.status(201).json(response);
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Internal server error: Unable to Create Order ${error.message}`,
      });
  }
};
