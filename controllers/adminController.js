import bcrypt from "bcrypt";
import adminModel from "../models/adminModel.js";
import { generateToken } from "../utils/generateJWT.js";
import driverModel from "../models/driverModel.js";
import vendorModel from "../models/vendorModel.js";
import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";

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
    if (driver.length === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.status(200).json(driver);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Unable to get Driver details. An internal server error occurred.",
    });
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

// ------------------------------------------------------------------GET-CATEGORIES------------------------------------------------------------------//

export const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    if (categories.length === 0) {
      res
        .status(204)
        .header("X-No-Data-Message", "No Categories found in the database.")
        .send();
    } else {
      res.status(200).json(categories);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Unable to get Category list. An internal server error occurred.",
    });
  }
};

// ------------------------------------------------------------------GET-AN-CATEGORY------------------------------------------------------------------//

export const getCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await categoryModel.findOne({ _id: categoryId });
    if (category.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Unable to get Category details. An internal server error occurred.",
    });
  }
};

// ------------------------------------------------------------------GET-PRODUCTS------------------------------------------------------------------//

export const getProducts = async (req, res) => {
  try {
    const products = await productModel
      .find()
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
      message: "Unable to get Product list. An internal server error occurred.",
    });
  }
};

// ------------------------------------------------------------------GET-AN-PRODUCT------------------------------------------------------------------//

export const getProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await productModel
      .findOne({ _id: productId })
      .populate("category", "_id name block");
    if (product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Unable to get Product details. An internal server error occurred.",
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
            .status(401)
            .json({ message: "Incorrect password. Please try again." });
        }
      });
    } else {
      res.status(404).json({ message: "Admin not found" });
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
        .status(409)
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
      res.status(201).json({ message: "Driver created successfully." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

// ------------------------------------------------------------------ADD-VENDOR------------------------------------------------------------------//

export const addVendor = async (req, res) => {
  try {
    const { name, mobile, location, email, address } = req.body;
    const existingVendor = await vendorModel.findOne({ email });
    if (existingVendor) {
      return res.status(409).json({
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

// ------------------------------------------------------------------ADD-CATEGORY------------------------------------------------------------------//

export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const existingCategory = await categoryModel.findOne({
      name: { $regex: new RegExp(`${name}`, "i") },
    });
    if (existingCategory) {
      return res.status(409).json({ error: "Category already exists." });
    }
    const newCategory = new categoryModel({ name });
    await newCategory.save();
    return res.status(201).json({ message: "Category added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ------------------------------------------------------------------ADD-PRODUCT------------------------------------------------------------------//

export const addProduct = async (req, res) => {
  try {
    const { name, price, categoryId, image, quantity, available } = req.body;

    const existingProduct = await productModel.findOne({
      name: { $regex: new RegExp(`${name}`, "i") },
    });
    if (existingProduct) {
      return res
        .status(400)
        .json({ error: `Product with the name ${name} already exists` });
    }

    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(400).json({ error: "Category not found" });
    }

    const newProduct = await productModel.create({
      name,
      price,
      category: {
        _id: category._id,
        name: category.name,
      },
      image,
      quantity,
      available,
    });

    res.status(201).json({ message: "Product added.", newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
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
      return res.status(409).json({
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

// ------------------------------------------------------------------UPDATE-VENDOR-DETAILS------------------------------------------------------------------//

export const updateVendor = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const updateData = req.body;
    const existingVendor = await vendorModel.findOne({
      email: updateData.email,
      _id: { $ne: vendorId },
    });
    if (existingVendor) {
      return res.status(409).json({
        message: "Another Vendor with the same email already exists",
      });
    }
    const updatedVendor = await vendorModel.findByIdAndUpdate(
      vendorId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    const response = {
      message: "Vendor Details updated succesfully",
      updatedVendor,
    };
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ------------------------------------------------------------------UPDATE-PRODUCT-DETAILS------------------------------------------------------------------//

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const updateData = req.body;
    const existingProduct = await productModel.findOne({
      name: { $regex: new RegExp(`${updateData.name}`, "i") },
      _id: { $ne: productId },
    });
    if (existingProduct) {
      return res.status(409).json({
        message: "Another Product with the same name already exists",
      });
    }
    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    const response = {
      message: "Product Details updated succesfully",
      updatedProduct,
    };
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ------------------------------------------------------------------AVAILABILITY-OF-PRODUCT------------------------------------------------------------------//

export const toggleIsAvailable = async (req, res) => {
    try {
      const productId = req.params.productId;
      const product = await productModel.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      product.available = !product.available;
      await product.save();
      res
        .status(200)
        .json({ message: `Product ${product.available ? "In-stock" : "Out-of-stock"}` });
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

// ------------------------------------------------------------------DELETE-VENDOR------------------------------------------------------------------//

export const deleteVendor = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const deletedVendor = await vendorModel.findByIdAndRemove(vendorId);
    if (!deletedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ------------------------------------------------------------------DELETE-PRODUCT------------------------------------------------------------------//

export const deleteProduct = async (req, res) => {
    try {
      const productId = req.params.productId;
      const deletedProduct = await productModel.findByIdAndRemove(productId);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };