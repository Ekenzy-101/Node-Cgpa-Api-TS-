import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { IUser } from "src/models/user";

export default async (req: Request, res: Response, next: NextFunction) => {
  const token = await req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  const secret = process.env.SECRET_KEY as jwt.Secret;
  try {
    const decoded = (await jwt.verify(token, secret)) as IUser;
    req.user = decoded;
    return next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
