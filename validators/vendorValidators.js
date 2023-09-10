import { check, param, validationResult } from "express-validator";

// --------------------------------------------------------------VENDOR-REGISTRATION------------------------------------------------------------------//

export const validateVendor = async (req, res, next) => {
  try {
    for (const rule of vendorValidationRules) {
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

const vendorValidationRules = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name can only contain letters and spaces")
    .trim()
    .customSanitizer((value) => {
      return value.replace(/\b\w/g, (match) => match.toUpperCase());
    }),

  check("mobile")
    .notEmpty()
    .withMessage("Mobile is required")
    .isString()
    .withMessage("Mobile must be a string")
    .trim(),

  check("location")
    .optional()
    .isString()
    .withMessage("Location must be a string")
    .trim(),

  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  check("address").optional().trim(),
];

// --------------------------------------------------------------VENDOR-ID------------------------------------------------------------------//

export const validateVendorId = async (req, res, next) => {
  try {
    for (const rule of validateVendorIdRules) {
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

const validateVendorIdRules = [
  param("vendorId")
    .notEmpty()
    .withMessage("Vendor ID is required")
    .isMongoId()
    .withMessage("Invalid vendor ID format")
    .trim(),
];

// --------------------------------------------------------------UPDATE-VENDOR------------------------------------------------------------------//

export const validateUpdateVendor = async (req, res, next) => {
  try {
    for (const rule of validateUpdateVendorRules) {
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

const validateUpdateVendorRules = [
  check("name")
    .optional()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name can only contain letters and spaces")
    .trim()
    .customSanitizer((value) => {
      return value.replace(/\b\w/g, (match) => match.toUpperCase());
    }),

  check("mobile")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid mobile phone format")
    .trim(),

  check("location")
    .optional()
    .isString()
    .withMessage("Location must be a string")
    .trim(),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .trim()
    .normalizeEmail(),

  check("address").optional().trim(),
];
