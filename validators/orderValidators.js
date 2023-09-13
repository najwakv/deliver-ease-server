import { check, param, validationResult } from "express-validator";

// --------------------------------------------------------------CREATE-ORDER------------------------------------------------------------------//

const orderValidationRules = [
  check("items").isArray().withMessage("Items should be an array"),

  check("items.*.product")
    .isString()
    .notEmpty()
    .withMessage("Product ID is required .")
    .isMongoId()
    .withMessage("Product ID must be a valid ObjectId")
    .trim(),

  check("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity should be a positive integer")
    .trim(),

  check("items.*.totalPrice")
    .isFloat()
    .withMessage("Total Price should be a positive float number")
    .trim(),

  check("driver")
    .notEmpty()
    .withMessage("Driver ID is required")
    .isMongoId()
    .withMessage("Driver ID must be a valid ObjectId")
    .trim(),

  check("vendor")
    .notEmpty()
    .withMessage("Vendor ID is required")
    .isMongoId()
    .withMessage("Vendor ID must be a valid ObjectId")
    .trim(),

  check("totalAmount")
    .isFloat()
    .withMessage("Total Amount should be a positive float number")
    .trim(),

  check("collectedAmount")
    .isFloat({ min: 0 })
    .withMessage("Collected Amount should be a positive float number")
    .trim(),
];

export const validateOrder = async (req, res, next) => {
  try {
    for (const rule of orderValidationRules) {
      await rule.run(req);
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: `Internal Server Error: occurred while validating.${error.message}`,
      });
  }
};

// --------------------------------------------------------------GET-AN-ORDER------------------------------------------------------------------//

const orderIdValidationRules = [
  param("orderId")
    .notEmpty()
    .withMessage("Order ID is required")
    .isMongoId()
    .withMessage("Invalid Order ID format")
    .trim(),
];

export const validateOrderId = async (req, res, next) => {
  try {
    for (const rule of orderIdValidationRules) {
      await rule.run(req);
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: `Internal Server Error: occurred while validating.${error.message}` });
  }
};

export const validateCreateBill = async (req, res, next) => {
  try {
    for (const rule of createBillValidationRules) {
      await rule.run(req);
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

const createBillValidationRules = [
  check("items").isArray().withMessage("Items should be an array"),

  check("items.*.product")
    .isString()
    .notEmpty()
    .withMessage("Product ID is required and should be a non-empty string")
    .trim(),

  check("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity should be a positive integer")
    .trim(),

  check("items.*.totalPrice")
    .isFloat({ min: 0 })
    .withMessage("Total Price should be a positive float number")
    .trim(),

  check("totalAmount")
    .isFloat({ min: 0 })
    .withMessage("Total Amount should be a positive float number")
    .trim(),

  check("collectedAmount")
    .isFloat({ min: 0 })
    .withMessage("Collected Amount should be a positive float number")
    .trim(),
];
