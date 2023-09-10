import { check, param, validationResult } from "express-validator";

// --------------------------------------------------------------CATEGORY-CREATION-------------------------------------------------------------------//

export const validateCategory = async (req, res, next) => {
  try {
    for (const rule of categoryValidationRules) {
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

const categoryValidationRules = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name can only contain letters and spaces")
    .trim()
    .customSanitizer((value) => {
      return value.replace(/\b\w/g, (match) => match.toUpperCase());
    }),
];

// --------------------------------------------------------------CATEGORY-ID------------------------------------------------------------------//

export const validateCategoryId = async (req, res, next) => {
  try {
    for (const rule of validateCategoryIdRules) {
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

const validateCategoryIdRules = [
  param("categoryId")
    .notEmpty()
    .withMessage("category ID is required")
    .isMongoId()
    .withMessage("Invalid category ID format")
    .trim(),
];
