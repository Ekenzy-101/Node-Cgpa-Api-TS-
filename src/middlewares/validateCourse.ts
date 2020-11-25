import { Request } from "express";
import { body, validationResult } from "express-validator";

interface Errors {
  title: string[];
  code: string[];
  unit: string[];
  score: string[];
  semester: string[];
  level: string[];
}

export const validate = [
  body("title")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Field is required")
    .isLength({ min: 5 })
    .withMessage("Field should be up to 5 characters"),
  body("code")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Field is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("Field should be 6 characters"),
  body("unit")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Field is required")
    .isInt({ min: 1, max: 6 })
    .withMessage("Field should be between 1 and 6"),
  body("score")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Field is required")
    .isInt({ min: 0, max: 100 })
    .withMessage("Field should be between 0 and 100"),
  body("semester")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Field is required")
    .isIn(["First", "Second"])
    .withMessage("Field should be in the given values"),
  body("level")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Field is required")
    .isIn(["100", "200", "300", "400", "500", "600", "700"])
    .withMessage("Field should be in the given values"),
];

export const getValidationErrors = (req: Request) => {
  let validationErrors = validationResult(req);

  let errors: Errors = {
    title: [],
    code: [],
    unit: [],
    score: [],
    semester: [],
    level: [],
  };

  if (validationErrors.isEmpty()) return errors;

  for (let er of validationErrors.array()) {
    if (er.param === "title") errors.title.push(er.msg);
    if (er.param === "code") errors.code.push(er.msg);
    if (er.param === "unit") errors.unit.push(er.msg);
    if (er.param === "score") errors.score.push(er.msg);
    if (er.param === "semester") errors.semester.push(er.msg);
    if (er.param === "level") errors.level.push(er.msg);
  }

  return errors;
};
