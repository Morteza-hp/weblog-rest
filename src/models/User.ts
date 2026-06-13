import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { schema } from "../schemas/user.schema.js";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "نام و نام خانوادگی الزامی می باشد"],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 255,
    },
  },
  {
    timestamps: true,
    statics: {
      userValidation(body) {
        return schema.parseAsync(body);
      },
    },
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model("User", userSchema);
