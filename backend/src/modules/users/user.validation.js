import { body } from "express-validator";

export const validateUpdateProfile = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be 2-50 characters"),

  body("bio")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

  body("skills")
    .optional()
    .isArray({ max: 20 })
    .withMessage("Skills must be an array with max 20 items"),

  body("socialLinks.github")
    .optional({ checkFalsy: true })
    .isURL().withMessage("Invalid GitHub URL"),

  body("socialLinks.linkedin")
    .optional({ checkFalsy: true })
    .isURL().withMessage("Invalid LinkedIn URL"),

  body("socialLinks.portfolio")
    .optional({ checkFalsy: true })
    .isURL().withMessage("Invalid portfolio URL"),

  body("socialLinks.twitter")
    .optional({ checkFalsy: true })
    .isURL().withMessage("Invalid Twitter URL"),
];
