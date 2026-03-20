import { body } from "express-validator";

export const validateApply = [
  body("message")
    .trim()
    .notEmpty().withMessage("Application message is required")
    .isLength({ min: 20, max: 1000 })
    .withMessage("Message must be 20-1000 characters"),

  body("offeredSkills")
    .optional()
    .isArray()
    .withMessage("Offered skills must be an array"),

  body("offeredSkills.*")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Each skill must be a non-empty string"),
];

export const validateUpdateStatus = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["accepted", "rejected"])
    .withMessage("Status must be accepted or rejected"),

  body("founderNote")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Founder note cannot exceed 500 characters"),
];