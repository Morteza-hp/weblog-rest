// routes/users.routes.ts
import { Router } from "express";
import {
  handleLogin,
  handleForgetPassword,
  handleResetPassword,
  createUser,
} from "../controllers/user-controller.js";

const router = Router();

/**
 * @openapi
 * /users/login:
 *   post:
 *     tags:
 *       - احراز هویت
 *     summary: ورود کاربر
 *     description: با ارائه ایمیل و رمز عبور، توکن احراز هویت دریافت کنید
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: ورود موفق
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: ایمیل یا رمز عبور اشتباه است
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: خطای اعتبارسنجی
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       500:
 *         description: خطای سرور
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/login", handleLogin);

/**
 * @openapi
 * /users/forget-password:
 *   post:
 *     tags:
 *       - احراز هویت
 *     summary: فراموشی رمز عبور
 *     description: ارسال لینک بازیابی رمز عبور به ایمیل کاربر
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordInput'
 *     responses:
 *       200:
 *         description: لینک بازیابی به ایمیل ارسال شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: خطای اعتبارسنجی
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: کاربری با این ایمیل یافت نشد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: خطای سرور
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/forget-password", handleForgetPassword);

/**
 * @openapi
 * /users/reset-password/{token}:
 *   post:
 *     tags:
 *       - احراز هویت
 *     summary: بازنشانی رمز عبور
 *     description: تنظیم رمز عبور جدید با استفاده از توکن دریافتی از ایمیل
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: توکن بازیابی رمز عبور (دریافتی از ایمیل)
 *         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordInput'
 *     responses:
 *       200:
 *         description: رمز عبور با موفقیت تغییر یافت
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: خطای اعتبارسنجی یا عدم تطابق رمزهای عبور
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: توکن نامعتبر یا منقضی شده است
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: کاربر یافت نشد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: خطای سرور
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/reset-password/:token", handleResetPassword);

/**
 * @openapi
 * /users/register:
 *   post:
 *     tags:
 *       - احراز هویت
 *     summary: ثبت نام کاربر جدید
 *     description: ایجاد حساب کاربری جدید در وبلاگ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: ثبت نام با موفقیت انجام شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: کاربر با موفقیت ایجاد شد
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: خطای اعتبارسنجی یا ایمیل تکراری
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       409:
 *         description: ایمیل قبلاً ثبت شده است
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: خطای سرور
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/register", createUser);

export default router;