import z from "zod";
import Blog from "../models/Blog.js";
import { sendEmail } from "../utils/mailer.js";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error.js";

export const getIndex = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const numberOfPosts = await Blog.find({
      status: "public",
    }).countDocuments();

    const posts = await Blog.find({ status: "public" }).sort({
      createdAt: "desc",
    });

    if (!posts) {
      const error = new AppError("هیچ پستی در پایگاه داده ثبت نشده است");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ posts, total: numberOfPosts });
  } catch (err) {
    next(err);
  }
};

export const getSinglePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const post = await Blog.findOne({ _id: req.params.id }).populate("user");

    if (!post) {
      const error = new AppError("پستی با این شناسه یافت نشد");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ post });
  } catch (err) {
    next(err);
  }
};

export const handleContactPage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { fullname, email, message } = req.body;

  const schema = z.object({
    fullname: z.string("نام و نام خانوادگی الزامی می باشد"),
    email: z.email({
      error: (issue) =>
        issue.input === undefined
          ? "آدرس ایمیل الزامی می باشد"
          : "آدرس ایمیل معتبر نیست",
    }),
    message: z.string("پیام اصلی الزامی می باشد"),
  });

  try {
    await schema.parseAsync(req.body);
    sendEmail({
      email,
      fullname,
      subject: "پیام از طرف وبلاگ",
      message: `${message} <br/> ایمیل کاربر : ${email}`,
    });
    res.status(200).json({ message: "پیام شما با موفقیت ارسال شد" });
  } catch (err) {
    next(err);
  }
};
