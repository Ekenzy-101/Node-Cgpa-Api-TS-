import { Request, Response } from "express";
import { Error } from "mongoose";

export default (err: Error, _: Request, res: Response) => {
  console.error(err.message, err);

  return res.status(500).send("An unexpected error");
};
