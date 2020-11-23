import { NextFunction, Request, Response } from "express";
import { IUser } from "src/models/user";

export interface IRequest extends Request {
  user: IUser;
}

export default (req: IRequest, res: Response, next: NextFunction) => {
  if (!req.user.isAdmin) return res.status(403).send("Access denied.");

  return next();
};
