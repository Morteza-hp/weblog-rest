import path from "path";
import { fileURLToPath } from "url";
import fileUpload from "express-fileupload";
import express from "express";
import { config } from "dotenv";
import { errorHandler } from "./middlewares/errors.js";
import { setHeaders } from "./middlewares/headers.js";
import connectDB from "./config/db.js";
import blog from "./routes/blog.js";
import users from "./routes/users.js";
import dashboard from "./routes/dashboard.js";
import { setupSwagger } from "./swagger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//* Load Config
config({ path: path.join(__dirname, 'config', 'config.env') });

//* Database connection
connectDB();

const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(setHeaders);

//* File Upload Middleware
app.use(fileUpload());

//* Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Setup Swagger (BEFORE your routes)
setupSwagger(app);

//* Routes
app.use("/", blog);
app.use("/users", users);
app.use("/dashboard", dashboard);

//* Error Controller
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`),
);
