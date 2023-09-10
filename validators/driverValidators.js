import { check, param, validationResult } from "express-validator";

// --------------------------------------------------------------DRIVER-REGISTRATION------------------------------------------------------------------//

export const validateDriver = async (req, res, next) => {
  try {
    for (const rule of driverValidationRules) {
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

const driverValidationRules = [
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
    .isMobilePhone()
    .withMessage("Invalid mobile phone format")
    .trim(),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password Must Be at Least 8 Characters")
    .matches("[0-9]")
    .withMessage("Password Must Contain a Number")
    .matches("[A-Z]")
    .withMessage("Password Must Contain an Uppercase Letter")
    .trim()
    .escape(),
  check("address").optional().trim(),
  check("license").notEmpty().withMessage("License is required").trim(),
];

// --------------------------------------------------------------DRIVER-ID------------------------------------------------------------------//

export const validateDriverId = async (req, res, next) => {
  try {
    for (const rule of validateDriverIdRules) {
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

const validateDriverIdRules = [
  param("driverId")
    .notEmpty()
    .withMessage("Driver ID is required")
    .isMongoId()
    .withMessage("Invalid driver ID format")
    .trim(),
];

// --------------------------------------------------------------UPDATE-DRIVER------------------------------------------------------------------//

export const validateUpdateDriver = async (req, res, next) => {
  try {
    for (const rule of validateUpdateDriverRules) {
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

const validateUpdateDriverRules = [
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

  check("address").optional().trim(),

  check("license").optional().trim(),
];
