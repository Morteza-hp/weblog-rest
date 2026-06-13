import { Request } from "express";
import { FileFilterCallback } from "multer";

export const fileFilter = (
  _: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (file.mimetype == "image/jpeg") {
    cb(null, true);
  } else {
    cb(new Error("تنها پسوند JPEG پشتیبانی می‌شود") as any, false);
  }
};
