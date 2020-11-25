import lodash from "lodash";
import bcrypt from "bcrypt";
import express, { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { validate, getValidationErrors } from "../middlewares/validateUser";
import admin from "../middlewares/admin";
import auth from "../middlewares/auth";

const router = express.Router();

router.get("/", [auth, admin], async (_: Request, res: Response) => {
  const users = await User.find({}).select("-__v -password ");
  return res.send(users);
});

router.get(
  "/me",
  auth,
  async (req: Request, res: Response, _: NextFunction) => {
    const user = await User.findById(req.user._id).select("-__v -password");
    return res.send(user);
  }
);

router.post("/", validate, async (req: Request, res: Response) => {
  // Validate request from the body
  let error = getValidationErrors(req);
  let { email, firstname, lastname, password } = error;
  if (email.length || firstname.length || lastname.length || password.length)
    return res.status(400).send(error);

  // Check if a user is registered with the email
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    // email.push("A user is registered with this email");
    return res.status(400).send("A user is registered with this email");
  }

  // Create and save the user to the db
  user = new User(
    lodash.pick(req.body, ["firstname", "lastname", "email", "password"])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  // Generate token for the user
  const token = await user.generateAuthToken();
  return res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(
      lodash.pick(user, ["_id", "firstname", "lastname", "email", "isAdmin"])
    );
});

export default router;
