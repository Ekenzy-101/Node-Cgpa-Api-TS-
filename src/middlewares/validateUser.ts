import { body, validationResult } from "express-validator";
import { Request } from "express";

interface Errors {
  firstname: string[];
  lastname: string[];
  email: string[];
  password: string[];
}

export const validate = [
  body("firstname")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Field is required"),
  body("lastname")
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage("Field is required"),
  body("email")
    .isEmail()
    .withMessage("Email is not valid")
    .normalizeEmail()
    .isLength({ max: 250 })
    .withMessage("Field should be less than 250 characters"),
  body("password", "Password must contain at least 5 characters").isLength({
    min: 5,
    max: 1000,
  }),
];
export const getValidationErrors = (req: Request) => {
  const validationErrors = validationResult(req);

  const error: Errors = {
    firstname: [],
    lastname: [],
    email: [],
    password: [],
  };

  if (validationErrors.isEmpty()) return error;

  for (let er of validationErrors.array()) {
    if (er.param === "firstname") error.firstname.push(er.msg);
    if (er.param === "lastname") error.lastname.push(er.msg);
    if (er.param === "email") error.email.push(er.msg);
    if (er.param === "password") error.password.push(er.msg);
  }

  return error;
};
