import fs from "fs";
import multer from "multer";
import sharp from "sharp";
import shortId from "shortid";
import appRoot from "app-root-path";
import Blog from "../models/Blog.js";
import { fileFilter } from "../utils/multer.js";
import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../types/request.types.js";
import { AppError } from "../utils/app-error.js";

// Helper function to safely get uploaded file
const getUploadedFile = (
  files: any,
  fieldName: string,
): Express.Multer.File | undefined => {
  if (!files) return undefined;

  // If it's a single file
  if (files[fieldName] && !Array.isArray(files[fieldName])) {
    return files[fieldName];
  }

  // If it's an array of files
  if (
    files[fieldName] &&
    Array.isArray(files[fieldName]) &&
    files[fieldName].length > 0
  ) {
    return files[fieldName][0];
  }

  return undefined;
};

export const editPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const thumbnailFile = getUploadedFile(req.files, "thumbnail");
  const fileName = thumbnailFile
    ? `${shortId.generate()}_${thumbnailFile.originalname}`
    : "";
  const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;

  try {
    const post = await Blog.findOne({ _id: req.params.id });

    if (!post) {
      throw new AppError("پستی با این شناسه یافت نشد", 404);
    }

    if (post.user?.toString() !== req.userId) {
      throw new AppError("شما مجوز ویرایش این پست را ندارید", 401);
    }

    const thumbnailForValidation = thumbnailFile
      ? {
          name: thumbnailFile.originalname,
          size: thumbnailFile.size,
          mimetype: thumbnailFile.mimetype,
        }
      : {
          name: "placeholder",
          size: 0,
          mimetype: "image/jpeg",
        };

    await Blog.postValidation({
      ...req.body,
      thumbnail: thumbnailForValidation,
    });

    if (thumbnailFile && thumbnailFile.buffer) {
      // Delete old thumbnail if it exists
      const oldThumbnailPath = `${appRoot}/public/uploads/thumbnails/${post.thumbnail}`;
      if (fs.existsSync(oldThumbnailPath)) {
        fs.unlink(oldThumbnailPath, (err) => {
          if (err) console.error("Error deleting old thumbnail:", err);
        });
      }

      // Process new thumbnail using buffer
      await sharp(thumbnailFile.buffer)
        .jpeg({ quality: 60 })
        .toFile(uploadPath);

      post.thumbnail = fileName;
    }

    const { title, status, body } = req.body;
    post.title = title;
    post.status = status;
    post.body = body;

    await post.save();

    res.status(200).json({ message: "پست شما با موفقیت ویرایش شد" });
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const post = await Blog.findByIdAndDelete(req.params.id);

    if (!post) {
      throw new AppError("پستی با این شناسه یافت نشد", 404);
    }

    const filePath = `${appRoot}/public/uploads/thumbnails/${post.thumbnail}`;

    // Delete file if it exists
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting thumbnail:", err);
        }
      });
    }

    res.status(200).json({ message: "پست شما با موفقیت پاک شد" });
  } catch (err) {
    next(err);
  }
};

export const createPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const thumbnailFile = getUploadedFile(req.files, "thumbnail");

  if (!thumbnailFile || !thumbnailFile.buffer) {
    throw new AppError("عکس بند انگشتی الزامی می باشد", 400);
  }

  const fileName = `${shortId.generate()}_${thumbnailFile.originalname}`;
  const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;

  try {
    const thumbnailForValidation = {
      name: thumbnailFile.originalname,
      size: thumbnailFile.size,
      mimetype: thumbnailFile.mimetype,
    };

    req.body = { ...req.body, thumbnail: thumbnailForValidation };

    await Blog.postValidation(req.body);

    await sharp(thumbnailFile.buffer).jpeg({ quality: 60 }).toFile(uploadPath);

    await Blog.create({
      title: req.body.title,
      body: req.body.body,
      status: req.body.status,
      user: req.userId,
      thumbnail: fileName,
    });

    res.status(201).json({ message: "پست جدید با موفقیت ساخته شد" });
  } catch (err) {
    next(err);
  }
};

export const uploadImage = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const upload = multer({
    limits: { fileSize: 4000000 },
    fileFilter: fileFilter,
  }).single("image");

  upload(req, res, async (err: any) => {
    try {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(422).json({
            error: "حجم عکس ارسالی نباید بیشتر از 4 مگابایت باشد",
          });
        }
        return res.status(400).json({ error: err.message });
      }

      const file = req.file;

      if (!file || !file.buffer) {
        return res.status(400).json({
          error: "جهت آپلود باید عکسی انتخاب کنید",
        });
      }

      const fileName = `${shortId.generate()}_${file.originalname}`;
      const uploadPath = `./public/uploads/${fileName}`;

      await sharp(file.buffer).jpeg({ quality: 60 }).toFile(uploadPath);

      res.status(200).json({
        image: `http://localhost:3000/uploads/${fileName}`,
      });
    } catch (error) {
      next(error);
    }
  });
};
