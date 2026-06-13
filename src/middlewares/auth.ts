import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/app-error.js";
import { AuthRequest } from "../types/request.types.js";
import { JwtPayload } from "../types/jwt.types.js";

export const authenticated = (
  req: AuthRequest,
  _: Response,
  next: NextFunction,
) => {
  const authHeader = req.get("Authorization");

  try {
    if (!authHeader) {
      const error = new AppError("مجوز کافی ندارید");
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.split(" ")[1]; //Bearer Token => ['Bearer', token]

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as JwtPayload;

    if (!decodedToken) {
      const error = new AppError("شما مجوز کافی ندارید");
      error.statusCode = 401;
      throw error;
    }

    req.userId = decodedToken.user.userId;
    next();
  } catch (err) {
    next(err);
  }
};
