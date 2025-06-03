// app.js

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// ✅ Fix: correct import paths inside /src
// import errorHandler from "./src/utils/ApiError.js";
import authRoutes from "./src/routes/auth.routes.js";
import jobRoutes from "./src/routes/job.routes.js";
import applicationRoutes from "./src/routes/application.routes.js";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
}));

app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// ✅ Error handling
// app.use(errorHandler);

export default app;
