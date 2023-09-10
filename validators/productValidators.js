import { check, param, validationResult } from "express-validator";

// --------------------------------------------------------------VENDOR-REGISTRATION------------------------------------------------------------------//

export const validateProduct = async (req, res, next) => {
  try {
    for (const rule of productValidationRules) {
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

const productValidationRules = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name can only contain letters and spaces")
    .trim()
    .customSanitizer((value) => {
      return value.replace(/\b\w/g, (match) => match.toUpperCase());
    }),

  check("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a valid number"),

  check("categoryId")
    .notEmpty()
    .withMessage("Category ID is required")
    .isMongoId()
    .withMessage("Category ID must be a valid ObjectId"),

  check("image").optional().isURL().withMessage("Image must be a valid URL"),

  check("quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Quantity must be a positive integer"),
];

// --------------------------------------------------------------PRODUCT-ID------------------------------------------------------------------//

export const validateProductId = async (req, res, next) => {
  try {
    for (const rule of validateProductIdRules) {
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

const validateProductIdRules = [
  param("vendorId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID format")
    .trim(),
];

// --------------------------------------------------------------UPDATE-PRODUCT------------------------------------------------------------------//

export const validateUpdateProduct = async (req, res, next) => {
  try {
    for (const rule of validateUpdateProductRules) {
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

const validateUpdateProductRules = [
  check("name")
    .optional()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name can only contain letters and spaces")
    .trim()
    .customSanitizer((value) => {
      return value.replace(/\b\w/g, (match) => match.toUpperCase());
    }),

  check("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be a valid number"),

  check("categoryId")
    .optional()
    .isMongoId()
    .withMessage("Category ID must be a valid ObjectId"),

  check("image").optional().isURL().withMessage("Image must be a valid URL"),

  check("quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Quantity must be a positive integer"),
];
