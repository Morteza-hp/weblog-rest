import mongoose from "mongoose";
import { schema } from "../schemas/blog.schema.js";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
      maxLength: 100,
    },
    body: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "public",
      enum: ["private", "public"],
    },
    thumbnail: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    statics: {
      postValidation(body) {
        return schema.parseAsync(body);
      },
    },
  },
);

blogSchema.index({ title: "text" });

export default mongoose.model("Blog", blogSchema);
