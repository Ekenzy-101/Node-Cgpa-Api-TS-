import { NextFunction, Response } from "express";
import { IRequest } from "./admin";
import User from "../models/user";

export const getUser = async (
  req: IRequest,
  res: Response,
  _: NextFunction
) => {
  const user = await User.findById(req.user._id).select("-__v -password");
  return res.send(user);
};
