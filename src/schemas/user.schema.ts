import z from "zod";

export const schema = z
  .object({
    fullname: z
      .string("نام و نام خانوادگی الزامی می باشد")
      .min(4, "نام و نام خانوادگی نباید کمتر از 4 کاراکتر باشد")
      .max(255, "نام و نام خانوادگی نباید بیشتر از 255 کاراکتر باشد"),
    email: z.email({
      error: (issue) =>
        issue.input === undefined
          ? "آدرس ایمیل الزامی می باشد"
          : "آدرس ایمیل معتبر نیست",
    }),
    password: z
      .string("کلمه عبور الزامی می باشد")
      .min(4, "کلمه عبور نباید کمتر از 4 کاراکتر باشد")
      .max(255, "کلمه عبور نباید بیشتر از 255 کاراکتر باشد"),
    confirmPassword: z.string("تکرار کلمه عبور الزامی می باشد"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "کلمه های عبور یکسان نیستند",
    path: ["confirmPassword"],
  });
