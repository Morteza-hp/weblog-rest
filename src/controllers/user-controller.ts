import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/mailer.js";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error.js";
import { JwtPayload } from "../types/jwt.types.js";

export const handleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new AppError("کاربری با این ایمیل یافت نشد");
      error.statusCode = 404;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (isEqual) {
      const token = jwt.sign(
        {
          user: {
            userId: user._id.toString(),
            email: user.email,
            fullname: user.fullname,
          },
        },
        process.env.JWT_SECRET!,
      );
      res.status(200).json({ token, userId: user._id.toString() });
    } else {
      const error = new AppError("آدرس ایمیل یا کلمه عبور اشتباه است");
      error.statusCode = 422;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await User.userValidation(req.body);
    const { fullname, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      const error = new AppError(
        "کاربری با این ایمیل در پایگاه داده موجود است",
      );
      error.statusCode = 422;
      throw error;
    } else {
      await User.create({ fullname, email, password });
      //? Send Welcome Email
      sendEmail({
        email,
        fullname,
        subject: "خوش آمدی به وبلاگ ما",
        message: "خیلی خوشحالیم که به جمع ما وبلاگرهای خفن ملحق شدی",
      });
      res.status(201).json({ message: "عضویت موفقیت آمیز بود" });
    }
  } catch (err) {
    next(err);
  }
};

export const handleForgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new AppError("کاربری با ایمیل در پایگاه داده ثبت نشده");
      error.statusCode = 404;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    const resetLink = `http://localhost:3000/users/reset-password/${token}`;

    sendEmail({
      email: user.email,
      fullname: user.fullname,
      subject: "فراموشی رمز عبور",
      message: `
        جهت تغییر رمز عبور فعلی رو لینک زیر کلیک کنید
        <a href="${resetLink}">لینک تغییر رمز عبور</a>
    `,
    });
    res.status(200).json({
      message: "لینک ریست کلمه عبور با موفقیت ارسال شد",
    });
  } catch (err) {
    next(err);
  }
};

export const handleResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = Array.isArray(req.params.token)
    ? req.params.token[0]
    : req.params.token;
  const { password, confirmPassword } = req.body;

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as JwtPayload;
    if (!decodedToken) {
      const error = new AppError("شما مجوز این عملیات را ندارید");
      error.statusCode = 401;
      throw error;
    }

    if (password !== confirmPassword) {
      const error = new AppError("کلمه های عبور یکسان نمی باشند");
      error.statusCode = 422;
      throw error;
    }

    const user = await User.findOne({ _id: decodedToken.user.userId });

    if (!user) {
      const error = new AppError("کاربری با این شناسه در پایگاه داده یافت نشد");
      error.statusCode = 404;
      throw error;
    }

    user.password = password;
    await user.save();

    res.status(200).json({ message: "عملیات با موفقیت انجام شد" });
  } catch (err) {
    next(err);
  }
};
