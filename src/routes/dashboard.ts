// routes/dashboard.routes.ts
import { Router } from "express";
import { authenticated } from "../middlewares/auth.js";
import {
  deletePost,
  createPost,
  editPost,
  uploadImage,
} from "../controllers/admin-controller.js";

const router = Router();

/**
 * @openapi
 * /dashboard/delete-post/{id}:
 *   delete:
 *     tags:
 *       - داشبورد
 *     summary: حذف پست
 *     description: حذف یک پست موجود (نیاز به احراز هویت)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه پست مورد نظر برای حذف
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: پست با موفقیت حذف شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: احراز هویت نشده یا توکن نامعتبر
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: شما مجوز حذف این پست را ندارید
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
router.delete("/delete-post/:id", authenticated, deletePost);

/**
 * @openapi
 * /dashboard/add-post:
 *   post:
 *     tags:
 *       - داشبورد
 *     summary: ایجاد پست جدید
 *     description: ایجاد یک پست جدید در وبلاگ (نیاز به احراز هویت)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *               - status
 *               - thumbnail
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *                 description: عنوان پست
 *                 example: آموزش جامع Node.js
 *               body:
 *                 type: string
 *                 description: متن اصلی پست
 *                 example: در این آموزش با مفاهیم پیشرفته Node.js آشنا می‌شوید...
 *               status:
 *                 type: string
 *                 enum: [private, public]
 *                 description: وضعیت انتشار
 *                 example: public
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: فایل تصویر بندانگشتی (JPEG یا PNG، حداکثر 3MB)
 *     responses:
 *       201:
 *         description: پست با موفقیت ساخته شد
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
 *       401:
 *         description: احراز هویت نشده یا توکن نامعتبر
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
router.post("/add-post", authenticated, createPost);

/**
 * @openapi
 * /dashboard/edit-post/{id}:
 *   put:
 *     tags:
 *       - داشبورد
 *     summary: ویرایش پست
 *     description: ویرایش یک پست موجود (نیاز به احراز هویت)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه پست مورد نظر برای ویرایش
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *                 description: عنوان پست
 *                 example: آموزش پیشرفته Node.js
 *               body:
 *                 type: string
 *                 description: متن اصلی پست
 *                 example: در این آموزش به مباحث پیشرفته‌تر می‌پردازیم...
 *               status:
 *                 type: string
 *                 enum: [private, public]
 *                 description: وضعیت انتشار
 *                 example: private
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: فایل تصویر بندانگشتی جدید (اختیاری)
 *     responses:
 *       200:
 *         description: پست با موفقیت ویرایش شد
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
 *       401:
 *         description: احراز هویت نشده یا توکن نامعتبر
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: شما مجوز ویرایش این پست را ندارید
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
router.put("/edit-post/:id", authenticated, editPost);

/**
 * @openapi
 * /dashboard/image-upload:
 *   post:
 *     tags:
 *       - آپلود
 *     summary: آپلود تصویر
 *     description: آپلود تصویر برای استفاده در ویرایشگر متن (نیاز به احراز هویت)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: فایل تصویر (حداکثر 4MB)
 *     responses:
 *       200:
 *         description: آپلود با موفقیت انجام شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: خطا در آپلود یا نوع فایل نامعتبر
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: احراز هویت نشده یا توکن نامعتبر
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: حجم فایل بیشتر از حد مجاز (4MB)
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
router.post("/image-upload", authenticated, uploadImage);

export default router;