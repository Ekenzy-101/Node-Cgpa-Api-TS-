import express, { Request, Response } from "express";
import _ from "lodash";
import bcrypt from "bcrypt";
import User from "../models/user";

import { validate, getValidationErrors } from "../middlewares/validateLogin";
const router = express.Router();

router.post("/", validate, async (req: Request, res: Response) => {
  // Validate request from the body
  let error = getValidationErrors(req);
  if (error) return res.status(400).send(error);

  // Check if a user is registered with the email
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    error = "Invalid Email or Password";
    return res.status(400).send(error);
  }

  // Check if the user password match
  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) {
    error = "Invalid Email or Password";
    return res.status(400).send(error);
  }

  // Generate token for the user
  const token = await user.generateAuthToken();
  return res.json(token);
});

export default router;
