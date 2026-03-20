import { body } from "express-validator";

export const validateCreateProject = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be 5-100 characters"),

  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isLength({ min: 20, max: 2000 })
    .withMessage("Description must be 20-2000 characters"),

  body("requiredSkills")
    .optional()
    .isArray({ max: 15 })
    .withMessage("Required skills must be an array with max 15 items"),

  body("requiredSkills.*")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Each skill must be a non-empty string"),

  body("maxTeamSize")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Max team size must be between 1 and 20"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array"),
];

export const validateUpdateProject = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be 5-100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage("Description must be 20-2000 characters"),

  body("status")
    .optional()
    .isIn(["open", "in-progress", "completed", "closed"])
    .withMessage("Invalid status value"),

  body("maxTeamSize")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Max team size must be between 1 and 20"),
];