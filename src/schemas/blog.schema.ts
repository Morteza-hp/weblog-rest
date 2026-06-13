import z from "zod";

export const schema = z.object({
  title: z
    .string("عنوان پست الزامی می باشد")
    .min(5, "عنوان پست نباید کمتر از 5 کارکتر باشد")
    .max(100, "عنوان پست نباید بیشتر از 100 کاراکتر باشد"),
  body: z.string("پست جدید باید دارای محتوا باشد"),
  status: z.enum(["private", "public"], {
    error: (issue) =>
      issue.input === undefined
        ? "وضعیت الزامی است"
        : "یکی از 2 وضعیت خصوصی یا عمومی را انتخاب کنید",
  }),
  thumbnail: z.object({
    name: z.string("عکس بند انگشتی الزامی می باشد"),
    size: z.number().max(3000000, "عکس نباید بیشتر از 3 مگابایت باشد"),
    mimetype: z.enum(["image/jpeg", "image/png"], {
      error: (issue) =>
        issue.input === undefined
          ? "پسوند الزامی است"
          : "تنها پسوندهای png و jpeg پشتیبانی می شوند",
    }),
  }),
});
