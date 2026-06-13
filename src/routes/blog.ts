// routes/blog.routes.ts
import { Router } from "express";
import {
  getIndex,
  getSinglePost,
  handleContactPage,
} from "../controllers/blog-controller.js";

const router = Router();

/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *       - وبلاگ
 *     summary: دریافت لیست تمام پست‌های عمومی
 *     description: این endpoint لیست تمام پست‌های عمومی را به همراه تعداد کل برمی‌گرداند
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: شماره صفحه
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: تعداد پست در هر صفحه
 *     responses:
 *       200:
 *         description: موفقیت آمیز
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *                 total:
 *                   type: number
 *                   example: 42
 *       500:
 *         description: خطای سرور
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", getIndex);

/**
 * @openapi
 * /post/{id}:
 *   get:
 *     tags:
 *       - وبلاگ
 *     summary: دریافت یک پست با شناسه
 *     description: اطلاعات کامل یک پست را بر اساس شناسه آن برمی‌گرداند
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه یکتای پست
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: موفقیت آمیز
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: پست یافت نشد
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
router.get("/post/:id", getSinglePost);

/**
 * @openapi
 * /contact:
 *   post:
 *     tags:
 *       - تماس با ما
 *     summary: ارسال فرم تماس
 *     description: این endpoint برای ارسال پیام از طریق فرم تماس استفاده می‌شود
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInput'
 *     responses:
 *       200:
 *         description: ایمیل با موفقیت ارسال شد
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
 *       500:
 *         description: خطای سرور
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/contact", handleContactPage);

export default router;