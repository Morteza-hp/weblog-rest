import swaggerJsdoc from "swagger-jsdoc";
import { Express } from "express";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "وبلاگ شخصی - REST API Documentation",
      version: "1.0.0",
      description: `
        مستندات کامل API وبلاگ شخصی
        
        ## قابلیت‌ها:
        - مشاهده پست‌های عمومی
        - مدیریت پست‌ها (ایجاد، ویرایش، حذف)
        - احراز هویت کاربران (ثبت نام، ورود، بازیابی رمز عبور)
        - ارسال فرم تماس
        - آپلود تصویر
        
        ## نحوه احراز هویت:
        برای دسترسی به endpoints نیازمند احراز هویت، توکن JWT را در هدر Authorization به صورت زیر ارسال کنید:
        \`\`\`
        Authorization: Bearer <your-token>
        \`\`\`
      `,
      contact: {
        name: "پشتیبانی وبلاگ",
        email: "support@blog.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "سرور توسعه (Development)",
      },
      {
        url: "https://api.yourdomain.com",
        description: "سرور تولید (Production)",
      },
    ],
    tags: [
      { name: "وبلاگ", description: "عملیات مربوط به مشاهده پست‌های عمومی" },
      { name: "داشبورد", description: "مدیریت پست‌ها (نیاز به احراز هویت)" },
      { name: "احراز هویت", description: "ثبت نام، ورود و مدیریت حساب کاربری" },
      { name: "تماس با ما", description: "ارسال فرم تماس" },
      { name: "آپلود", description: "آپلود تصاویر در داشبورد" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "توکن JWT خود را وارد کنید",
        },
      },
      schemas: {
        // ==================== Blog Model ====================
        Blog: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "شناسه یکتای پست",
              example: "507f1f77bcf86cd799439011",
            },
            title: {
              type: "string",
              minLength: 5,
              maxLength: 100,
              description: "عنوان پست",
              example: "آموزش جامع Node.js",
            },
            body: {
              type: "string",
              description: "متن اصلی پست",
              example: "در این آموزش با مفاهیم پیشرفته Node.js آشنا می‌شوید...",
            },
            status: {
              type: "string",
              enum: ["private", "public"],
              default: "public",
              description: "وضعیت انتشار (عمومی یا خصوصی)",
              example: "public",
            },
            thumbnail: {
              type: "string",
              description: "نام فایل تصویر بندانگشتی",
              example: "abc123_image.jpg",
            },
            user: {
              type: "string",
              description: "شناسه کاربر نویسنده",
              example: "507f1f77bcf86cd799439011",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "تاریخ ایجاد",
              example: "2024-01-15T10:30:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "تاریخ آخرین ویرایش",
              example: "2024-01-15T10:30:00.000Z",
            },
          },
        },

        CreatePostInput: {
          type: "object",
          required: ["title", "body", "status"],
          properties: {
            title: {
              type: "string",
              minLength: 5,
              maxLength: 100,
              description: "عنوان پست",
              example: "آموزش جامع Node.js",
            },
            body: {
              type: "string",
              description: "متن اصلی پست",
              example: "در این آموزش با مفاهیم پیشرفته Node.js آشنا می‌شوید...",
            },
            status: {
              type: "string",
              enum: ["private", "public"],
              description: "وضعیت انتشار",
              example: "public",
            },
          },
        },

        UpdatePostInput: {
          type: "object",
          properties: {
            title: {
              type: "string",
              minLength: 5,
              maxLength: 100,
              description: "عنوان پست",
              example: "آموزش پیشرفته Node.js",
            },
            body: {
              type: "string",
              description: "متن اصلی پست",
              example: "در این آموزش به مباحث پیشرفته‌تر می‌پردازیم...",
            },
            status: {
              type: "string",
              enum: ["private", "public"],
              description: "وضعیت انتشار",
              example: "private",
            },
          },
        },

        // ==================== User Model ====================
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            fullname: {
              type: "string",
              description: "نام و نام خانوادگی",
              example: "علی رضایی",
            },
            email: {
              type: "string",
              format: "email",
              description: "آدرس ایمیل",
              example: "ali@example.com",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T10:30:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T10:30:00.000Z",
            },
          },
        },

        RegisterInput: {
          type: "object",
          required: ["fullname", "email", "password"],
          properties: {
            fullname: {
              type: "string",
              description: "نام و نام خانوادگی",
              example: "علی رضایی",
            },
            email: {
              type: "string",
              format: "email",
              description: "آدرس ایمیل (یکتا)",
              example: "ali@example.com",
            },
            password: {
              type: "string",
              minLength: 4,
              maxLength: 255,
              format: "password",
              description: "رمز عبور (حداقل ۴ کاراکتر)",
              example: "password123",
            },
          },
        },

        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "آدرس ایمیل",
              example: "ali@example.com",
            },
            password: {
              type: "string",
              format: "password",
              description: "رمز عبور",
              example: "password123",
            },
          },
        },

        LoginResponse: {
          type: "object",
          properties: {
            token: {
              type: "string",
              description: "توکن JWT برای احراز هویت",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },

        ForgotPasswordInput: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "آدرس ایمیل ثبت شده",
              example: "ali@example.com",
            },
          },
        },

        ResetPasswordInput: {
          type: "object",
          required: ["password", "confirmPassword"],
          properties: {
            password: {
              type: "string",
              minLength: 4,
              format: "password",
              description: "رمز عبور جدید",
              example: "newpassword123",
            },
            confirmPassword: {
              type: "string",
              format: "password",
              description: "تکرار رمز عبور جدید",
              example: "newpassword123",
            },
          },
        },

        // ==================== Contact Model ====================
        ContactInput: {
          type: "object",
          required: ["email", "fullname", "subject", "message"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "آدرس ایمیل شما",
              example: "user@example.com",
            },
            fullname: {
              type: "string",
              description: "نام و نام خانوادگی",
              example: "مهدی کریمی",
            },
            subject: {
              type: "string",
              description: "موضوع پیام",
              example: "سوال درباره وبلاگ",
            },
            message: {
              type: "string",
              description: "متن پیام",
              example: "چگونه می‌توانم در وبلاگ شما مطلب منتشر کنم؟",
            },
          },
        },

        // ==================== Common Responses ====================
        SuccessResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "پیام موفقیت",
              example: "عملیات با موفقیت انجام شد",
            },
          },
        },

        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "پیام خطا",
              example: "خطایی رخ داده است",
            },
            data: {
              type: "object",
              nullable: true,
              description: "اطلاعات اضافی خطا",
            },
          },
        },

        ValidationErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "خطای اعتبارسنجی",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  path: {
                    type: "string",
                    example: "title",
                  },
                  message: {
                    type: "string",
                    example: "عنوان پست نباید کمتر از 5 کارکتر باشد",
                  },
                },
              },
            },
          },
        },

        // ==================== Upload Response ====================
        UploadResponse: {
          type: "object",
          properties: {
            image: {
              type: "string",
              description: "آدرس تصویر آپلود شده",
              example: "http://localhost:3000/uploads/abc123_image.jpg",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // Path to your route files
};

export const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  // Serve Swagger UI
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "وبلاگ API Documentation",
      swaggerOptions: {
        docExpansion: "list",
        filter: true,
        showRequestDuration: true,
        persistAuthorization: true,
      },
    }),
  );

  // Serve JSON spec
  app.get("/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(
    "📚 Swagger documentation available at http://localhost:3000/api-docs",
  );
};
