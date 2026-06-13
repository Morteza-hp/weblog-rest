import { Request } from "express";

export type AuthRequest = Request & {
  userId?: string;
  user?: {
    userId: string;
    email?: string;
    fullname?: string;
  };
};
